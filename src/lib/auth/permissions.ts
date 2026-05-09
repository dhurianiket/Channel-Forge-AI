import { RoleType, ProjectStage } from "@/src/types";

export interface PermissionMatrix {
  canEditScript: boolean;
  canApproveFactCheck: boolean;
  canApproveRoughCut: boolean;
  canManageDisclosures: boolean;
  canScheduleUpload: boolean;
  canCompleteAnalyticsReview: boolean;
  canCreatePostmortem: boolean;
  canManageAutomations: boolean;
  canAssignWork: boolean;
  canManageTemplates: boolean;
  canFinalizeScript: boolean;
  canFinalizePublish: boolean;
  canManageRoles: boolean;
}

const DEFAULT_PERMISSIONS: PermissionMatrix = {
  canEditScript: false,
  canApproveFactCheck: false,
  canApproveRoughCut: false,
  canManageDisclosures: false,
  canScheduleUpload: false,
  canCompleteAnalyticsReview: false,
  canCreatePostmortem: false,
  canManageAutomations: false,
  canAssignWork: false,
  canManageTemplates: false,
  canFinalizeScript: false,
  canFinalizePublish: false,
  canManageRoles: false,
};

export const ROLE_PERMISSIONS: Record<RoleType, PermissionMatrix> = {
  owner: {
    ...DEFAULT_PERMISSIONS,
    canEditScript: true,
    canApproveFactCheck: true,
    canApproveRoughCut: true,
    canManageDisclosures: true,
    canScheduleUpload: true,
    canCompleteAnalyticsReview: true,
    canCreatePostmortem: true,
    canManageAutomations: true,
    canAssignWork: true,
    canManageTemplates: true,
    canFinalizeScript: true,
    canFinalizePublish: true,
    canManageRoles: true,
  },
  admin: {
    ...DEFAULT_PERMISSIONS,
    canEditScript: true,
    canApproveFactCheck: true,
    canApproveRoughCut: true,
    canManageDisclosures: true,
    canScheduleUpload: true,
    canCompleteAnalyticsReview: true,
    canCreatePostmortem: true,
    canManageAutomations: true,
    canAssignWork: true,
    canManageTemplates: true,
    canFinalizeScript: true,
    canFinalizePublish: true,
    canManageRoles: true,
  },
  producer: {
    ...DEFAULT_PERMISSIONS,
    canEditScript: true,
    canApproveFactCheck: true,
    canApproveRoughCut: true,
    canManageDisclosures: true,
    canScheduleUpload: true,
    canCompleteAnalyticsReview: true, // Needs producer confirmation
    canCreatePostmortem: true,
    canManageAutomations: true,
    canAssignWork: true,
    canManageTemplates: true,
    canFinalizeScript: true,
    canFinalizePublish: true,
  },
  scriptwriter: {
    ...DEFAULT_PERMISSIONS,
    canEditScript: true,
  },
  researcher: {
    ...DEFAULT_PERMISSIONS,
    canEditScript: true,
    canApproveFactCheck: true, // Pre-approval, producer finalises
  },
  visual_designer: {
    ...DEFAULT_PERMISSIONS,
  },
  editor: {
    ...DEFAULT_PERMISSIONS,
    canApproveRoughCut: true, // QA approval only
  },
  ops_manager: {
    ...DEFAULT_PERMISSIONS,
    canManageDisclosures: true,
    canScheduleUpload: true,
    canCompleteAnalyticsReview: true,
    canCreatePostmortem: true,
    canManageAutomations: true,
    canAssignWork: true,
    canManageTemplates: true,
  },
  reviewer: {
    ...DEFAULT_PERMISSIONS,
    canApproveFactCheck: true,
    canApproveRoughCut: true,
  }
};

export function hasPermission(role: RoleType, permission: keyof PermissionMatrix): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}
