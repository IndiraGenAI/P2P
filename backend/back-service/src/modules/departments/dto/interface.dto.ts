import { Departments } from "erp-db";

export interface DepartmentResponse {
    rows: Departments[],
    count: number
  }