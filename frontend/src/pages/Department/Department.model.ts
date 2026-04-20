export interface IDepartmentRecord {
  name: string;
  code: number;
  branch_departments: IDepartmentBranch[];
  branch_id?: number[];
  status?: boolean;
  id: number;
}

export interface IBranch {
  course_id: number;
  branch: {
    name: string;
    branch_id: number;
    id: number;
  };
  branch_id: number;
  id: number;
}
export interface IDepartmentBranch {
  branch_id?: number;
  id?: number;
  branch?: {
    name: string;
  };
}
export interface IBranchData {
  branch: {
    name: string;
    code : string;
    status: boolean;
  };
}

export interface IDepartmentProps {
  filterModalClose?: boolean;
}
