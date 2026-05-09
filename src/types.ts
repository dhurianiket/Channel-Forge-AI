export enum ProjectStage {
  IDEA = "IDEA",
  RESEARCH = "RESEARCH",
  SCRIPT = "SCRIPT",
  FACT_CHECK = "FACT_CHECK",
  VISUAL_PLAN = "VISUAL_PLAN",
  VOICE = "VOICE",
  EDIT_QA = "EDIT_QA",
  METADATA = "METADATA",
  READY_TO_PUBLISH = "READY_TO_PUBLISH",
  PUBLISHED = "PUBLISHED",
  ANALYZED = "ANALYZED"
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  REJECTED = "REJECTED"
}

export interface Approval {
  id: string;
  projectId: string;
  workspaceId: string;
  channelId: string;
  stage: ProjectStage;
  targetType: string;
  targetId: string;
  status: ApprovalStatus;
  requestedBy: string;
  requestedAt: number;
  decidedBy?: string | null;
  decidedAt?: number | null;
  notes?: string;
  snapshotStageBefore?: ProjectStage;
  snapshotStageAfter?: ProjectStage;
}

export interface ChecklistItem {
  id: string;
  key: string;
  label: string;
  completed: boolean;
  completedBy?: string | null;
  completedAt?: number | null;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  defaultLanguage: string;
  defaultTone: string;
}

export interface Membership {
  userId: string;
  role: string | "owner" | "admin" | "member";
  joinedAt: number;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  niche: string;
  language: string;
  tone: string;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  channelId: string;
  title: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  currentStage: ProjectStage;
  selectedIdeaId?: string | null;
  activeScriptVersionId?: string | null;
  approvedScriptVersionId?: string | null;
  factCheckStatus?: ApprovalStatus | null;
  visualPlanStatus?: string | null;
  voiceStatus?: string | null;
  approvedVoiceTakeId?: string | null;
  editQaStatus?: ApprovalStatus | null;
  activeRoughCutId?: string | null;
  approvedRoughCutId?: string | null;
  metadataStatus?: ApprovalStatus | null;
  publishStatus?: string | null;
  readyToPublishAt?: number | null;
  publishedAt?: number | null;
  youtubeVideoId?: string | null;
  lastAnalyticsSyncAt?: number | null;
  createdBy: string;
  membershipTier?: "PUBLIC" | "EARLY_ACCESS" | "MEMBERS_ONLY";
  sponsorDealIds?: string[];
  affiliateLinkIds?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Sponsor {
  id: string;
  workspaceId: string;
  channelId: string;
  name: string;
  industry: string;
  brandFitScore: number;
  contactEmail?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SponsorshipDeal {
  id: string;
  workspaceId: string;
  channelId: string;
  sponsorId: string;
  projectId?: string;
  status: "PROSPECT" | "PITCHED" | "NEGOTIATING" | "CONTRACTED" | "PUBLISHED" | "PAID";
  amount: number;
  deliverables: string;
  dueDate?: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface AffiliateLink {
  id: string;
  workspaceId: string;
  channelId: string;
  productName: string;
  url: string;
  category: string;
  commissionRate?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RevenueRecord {
  id: string;
  workspaceId: string;
  channelId: string;
  projectId: string;
  revenueType: "ADSENSE" | "SPONSOR" | "AFFILIATE" | "MEMBERSHIP";
  amount: number;
  recordedAt: number;
  createdAt: number;
}

export interface Idea {
  id: string;
  projectId: string;
  title: string;
  angle: string;
  hook: string;
  scoreDemand: number;
  scoreOriginality: number;
  scoreComplexity: number;
  scoreSafety: number;
  scoreEvergreen: number;
  scoreEmotionalPull: number;
  notes: string;
  status: "DRAFT" | "READY" | "REJECTED";
  createdAt: number;
  updatedAt: number;
}

export interface FactCard {
  id: string;
  projectId: string;
  claim: string;
  summary: string;
  sourceUrl: string;
  sourceLabel: string;
  confidence: number;
  isSpeculative: boolean;
  tags: string[];
  notes: string;
  approvedForScript: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ScriptVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  sourceIdeaId?: string | null;
  title: string;
  hook: string;
  outline: string;
  fullText: string;
  language: string;
  tone: string;
  status: "DRAFT" | "READY" | "ARCHIVED";
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface SceneRow {
  id: string;
  projectId: string;
  order: number;
  narrationText: string;
  durationSec: number;
  visualType: string;
  imagePrompt: string;
  videoPrompt: string;
  stockFootageNotes: string;
  onScreenText: string;
  soundDesignCue: string;
  status: "DRAFT" | "READY" | "ARCHIVED";
  createdAt: number;
  updatedAt: number;
}

export interface VoiceTake {
  id: string;
  projectId: string;
  provider: string;
  voiceName: string;
  audioUrl: string;
  durationSec: number;
  status: "GENERATING" | "READY" | "ERROR";
  notes: string;
  approved: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MetadataPackage {
  id: string;
  projectId: string;
  titleOptions: string[];
  chosenTitle: string;
  description: string;
  tags: string[];
  chapters: { timestamp: string, title: string }[];
  pinnedComment: string;
  hashtags: string[];
  status: "DRAFT" | "READY";
  createdAt: number;
  updatedAt: number;
}

export interface RoughCut {
  id: string;
  projectId: string;
  scriptVersionId: string;
  voiceTakeId: string;
  previewUrl: string | null;
  status: "DRAFT" | "GENERATING" | "READY" | "FAILED";
  errorMessage?: string;
  durationSec?: number;
  sceneCount?: number;
  renderMode?: string;
  timelineJson?: any;
  subtitleMode?: string;
  musicMode?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PublishJob {
  id: string;
  projectId: string;
  roughCutId: string;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "FAILED" | "SCHEDULED";
  youtubeVideoId?: string;
  errorMessage?: string;
  scheduledFor?: number;
  metadataId?: string;
  title?: string;
  description?: string;
  tags?: string[];
  visibility?: string;
  syntheticDisclosureRequired?: boolean;
  syntheticDisclosureConfirmed?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AnalyticsSnapshot {
  id: string;
  projectId: string;
  youtubeVideoId: string;
  capturedAt: number;
  views: number;
  likes: number;
  comments: number;
  subscribersGained: number;
  ctr: number;
  averagePercentageViewed: number;
  impressions?: number;
  averageViewDurationSec?: number;
  watchTimeHours?: number;
  topTrafficSources?: any;
  retentionNotes?: string;
  packagingNotes?: string;
  improvementSummary?: string;
}

export interface ProjectEvent {
  id: string;
  projectId: string;
  workspaceId: string;
  channelId: string;
  type: string;
  actorType: "USER" | "SYSTEM" | "WORKER";
  actorId: string;
  message: string;
  metadata?: any;
  createdAt: number;
}

export interface AutomationRun {
  id: string;
  projectId: string;
  triggerType: "MANUAL" | "STAGE_CHANGE" | "SCHEDULED" | "WEBHOOK";
  workflowType: "RENDER_ROUGH_CUT" | "PUBLISH_VIDEO" | "SYNC_ANALYTICS" | "EXTRACT_SHORTS";
  status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  startedAt: number;
  finishedAt: number | null;
  errorMessage: string | null;
  payload: any;
  result: any;
  idempotencyKey: string;
  createdAt: number;
}

export interface ShortProject {
  id: string;
  projectId: string;
  sourceVideoId: string | null;
  sourceRoughCutId: string | null;
  startSec: number;
  endSec: number;
  transcriptExcerpt: string;
  hookLine: string;
  titleOptions: string[];
  caption: string;
  verticalVideoUrl: string | null;
  subtitleStyle: string;
  status: "DRAFT" | "READY" | "PUBLISHED";
  createdAt: number;
  updatedAt: number;
}

export interface SystemAlert {
  id: string;
  workspaceId: string;
  channelId: string;
  type: string;
  message: string;
  context?: any;
  resolved: boolean;
  resolvedAt?: number | null;
  resolvedBy?: string | null;
  createdAt: number;
}

export interface AnalyticsReview {
  id: string;
  projectId: string;
  workspaceId: string;
  channelId: string;
  youtubeVideoId: string;
  checkpoint: "48h" | "7d" | "28d";
  status: "PENDING" | "COMPLETED";
  metricsSnapshotId?: string | null;
  ctr?: number;
  averagePercentageViewed?: number;
  retentionDropNotes?: string;
  packagingLesson?: string;
  hookLesson?: string;
  nextVideoAdjustment?: string;
  seriesFollowUpSuggestion?: string;
  reviewedBy?: string | null;
  reviewedAt?: number | null;
  createdAt: number;
}

export interface Postmortem {
  id: string;
  projectId: string;
  workspaceId: string;
  channelId: string;
  incidentType: "FAILED_RENDER" | "FAILED_PUBLISH" | "UNDERPERFORMANCE" | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  rootCause: string;
  stageAffected: ProjectStage;
  timeline: string;
  fixApplied: string;
  preventionRule: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}

export type RoleType = "owner" | "producer" | "scriptwriter" | "researcher" | "visual_designer" | "editor" | "ops_manager" | "reviewer" | "admin";

export interface TeamMember {
  id: string; // usually userId
  workspaceId: string;
  email: string | null;
  displayName: string | null;
  role: RoleType;
  channelAccess?: string[]; // channel IDs. If empty, all channels or no channels based on role
  joinedAt: number;
  capacityHoursPerWeek?: number;
}

export interface StageAssignment {
  id: string;
  workspaceId: string;
  channelId: string;
  projectId: string;
  stage: ProjectStage;
  assigneeId: string | null;
  assignedAt: number;
  dueDate: number | null;
  blockedReason: string | null;
  reviewRequestedFrom: string | null;
  reviewCompletedAt: number | null;
  handoffNotes: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface SOPTemplate {
  id: string;
  workspaceId: string;
  channelId?: string; // If left empty, acts as global template
  type: "SCRIPT_STRUCTURE" | "VISUAL_STYLE" | "THUMBNAIL_RULES" | "TITLE_FORMULA" | "HOOK_FORMULA" | "METADATA_CHECKLIST" | "EDIT_QA_CHECKLIST" | "UPLOAD_CHECKLIST" | "ANALYTICS_REVIEW" | "POSTMORTEM";
  name: string;
  content: string; // Markdown or JSON string
  isActive: boolean;
  version: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  workspaceId: string;
  content: string;
  version: number;
  createdBy: string;
  createdAt: number;
}

