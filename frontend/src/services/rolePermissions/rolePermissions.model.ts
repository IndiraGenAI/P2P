export interface ISaveRolePermissionsPayload {
  role_id: number;
  page_action_ids: number[];
  created_by?: number | null;
}

export interface ISaveRolePermissionsResponse {
  success: boolean;
}
