import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, signInWithGoogle } from "@/src/lib/firebase";
import { getUserProfile, createUserProfile } from "@/src/lib/db/users";
import { UserProfile, Workspace, Channel } from "@/src/types";
import { listUserWorkspaces } from "@/src/lib/db/workspaces";
import { listWorkspaceChannels } from "@/src/lib/db/channels";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  channels: Channel[];
  activeChannel: Channel | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setActiveWorkspaceId: (id: string) => void;
  setActiveChannelId: (id: string) => void;
  refreshWorkspaces: () => Promise<void>;
  refreshChannels: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Handle User Profile
        let userProfile = await getUserProfile(firebaseUser.uid);
        if (!userProfile) {
          const newProfile: Partial<UserProfile> = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await createUserProfile(firebaseUser.uid, newProfile);
          userProfile = newProfile as UserProfile;
        }
        setProfile(userProfile);
        
        // Load Workspaces
        const userWorkspaces = await listUserWorkspaces(firebaseUser.uid);
        setWorkspaces(userWorkspaces);
        
        if (userWorkspaces.length > 0) {
          const storedWorkspaceId = localStorage.getItem("activeWorkspaceId");
          const workspaceToSet = userWorkspaces.find(w => w.id === storedWorkspaceId) || userWorkspaces[0];
          setActiveWorkspace(workspaceToSet);
        } else {
          setActiveWorkspace(null);
        }
      } else {
        setProfile(null);
        setWorkspaces([]);
        setActiveWorkspace(null);
        setChannels([]);
        setActiveChannel(null);
        localStorage.removeItem("activeWorkspaceId");
        localStorage.removeItem("activeChannelId");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load Channels when active workspace changes
  useEffect(() => {
    async function loadChannels() {
      if (activeWorkspace) {
        const workspaceChannels = await listWorkspaceChannels(activeWorkspace.id);
        setChannels(workspaceChannels);
        
        if (workspaceChannels.length > 0) {
          const storedChannelId = localStorage.getItem("activeChannelId");
          const channelToSet = workspaceChannels.find(c => c.id === storedChannelId) || workspaceChannels[0];
          setActiveChannel(channelToSet);
        } else {
          setActiveChannel(null);
        }
      } else {
        setChannels([]);
        setActiveChannel(null);
      }
    }
    
    loadChannels();
  }, [activeWorkspace]);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const setActiveWorkspaceId = (id: string) => {
    const ws = workspaces.find(w => w.id === id);
    if (ws) {
      setActiveWorkspace(ws);
      localStorage.setItem("activeWorkspaceId", id);
    }
  };

  const setActiveChannelId = (id: string) => {
    const ch = channels.find(c => c.id === id);
    if (ch) {
      setActiveChannel(ch);
      localStorage.setItem("activeChannelId", id);
    }
  };

  const refreshWorkspaces = async () => {
    if (user) {
      const userWorkspaces = await listUserWorkspaces(user.uid);
      setWorkspaces(userWorkspaces);
    }
  };

  const refreshChannels = async () => {
    if (activeWorkspace) {
      const workspaceChannels = await listWorkspaceChannels(activeWorkspace.id);
      setChannels(workspaceChannels);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      workspaces,
      activeWorkspace,
      channels,
      activeChannel,
      loading,
      signIn,
      signOut,
      setActiveWorkspaceId,
      setActiveChannelId,
      refreshWorkspaces,
      refreshChannels
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
