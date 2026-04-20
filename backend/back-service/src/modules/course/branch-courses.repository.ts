import { dataSource } from "@core/data-source";
import { BranchCourse } from "erp-db";

export const branchesCourseRepository = dataSource.getRepository(BranchCourse)