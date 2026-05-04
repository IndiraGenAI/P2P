/**
 * Approval workflow UI loads `/users` to pick reviewers/approvers.
 * Allow that read when the user can view or edit workflows, without USERS_USERS_VIEW.
 */
export const APPROVAL_WORKFLOW_USER_LIST_ROLE_TAGS: string[] = [
  'WORKFLOW_V1_VIEW',
  'WORKFLOW_V1_CREATE',
  'WORKFLOW_V1_UPDATE',
  'WORKFLOW_V2_VIEW',
  'WORKFLOW_V2_CREATE',
  'WORKFLOW_V2_UPDATE',
];
