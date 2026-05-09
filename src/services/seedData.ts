import { db } from "@/src/lib/firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { ProjectStage } from "@/src/types";

export async function seedDemoData(userId: string) {
  const workspaceId = `ws_${userId}`;
  const channelId = `ch_mythology`;
  
  // 1. Seed Workspace
  await setDoc(doc(db, "workspaces", workspaceId), {
    name: "Elite Creators Hub",
    ownerId: userId,
    members: [userId],
    createdAt: Timestamp.now()
  });

  // 2. Seed Channel
  await setDoc(doc(db, "channels", channelId), {
    workspaceId,
    name: "Silicon Mythology",
    niche: "Future History & Tech Deep Dives",
    audienceProfile: "Curious tech-literate professionals (25-45)",
    branding: {
        tone: "Cinematic, Authoritative, Mysterious",
        colors: ["#14b8a6", "#f97316", "#09090b"]
    },
    strategy: {
        pillars: ["The Ruin Economy", "Speculative Biology", "Nuclear Futures"],
        series: ["Why [Subject] is Vanishing", "The Hidden Cost of [System]"]
    },
    createdAt: Timestamp.now()
  });

  // 3. Seed Projects
  const projects = [
    { 
        id: "p1", 
        title: "The Rise of Silicon Mythology", 
        stage: ProjectStage.SCRIPT, 
        status: "ACTIVE" 
    },
    { 
        id: "p2", 
        title: "Why Architecture is Failing", 
        stage: ProjectStage.RESEARCH, 
        status: "ACTIVE" 
    },
    { 
        id: "p3", 
        title: "The Future of Space Habitats", 
        stage: ProjectStage.METADATA, 
        status: "ACTIVE" 
    }
  ];

  for (const p of projects) {
    await setDoc(doc(db, "projects", p.id), {
        ...p,
        channelId,
        workspaceId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    });
  }

  console.log("Seed data created successfully!");
}
