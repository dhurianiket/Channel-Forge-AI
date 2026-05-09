export enum ProjectStage {
  IDEA = "IDEA",
  RESEARCH = "RESEARCH",
  FACT_PACK = "FACT_PACK",
  OUTLINE = "OUTLINE",
  SCRIPT = "SCRIPT",
  VISUAL_PLAN = "VISUAL_PLAN",
  VOICE = "VOICE",
  ASSETS = "ASSETS",
  ROUGH_CUT = "ROUGH_CUT",
  PACKAGING = "PACKAGING",
  PUBLISHED = "PUBLISHED",
}

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  niche: string;
  audienceProfile: string;
  branding: {
    tone: string;
    colors: string[];
  };
  strategy: {
    pillars: string[];
    series: string[];
  };
}

export interface Project {
  id: string;
  channelId: string;
  workspaceId: string;
  title: string;
  stage: ProjectStage;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
}
