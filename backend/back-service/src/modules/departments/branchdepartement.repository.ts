import { dataSource } from "@core/data-source";
import { BranchDepartments } from "erp-db";

export const branchDepartementRepository = dataSource.getRepository(BranchDepartments)