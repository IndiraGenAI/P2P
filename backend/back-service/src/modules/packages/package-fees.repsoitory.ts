import { dataSource } from "@core/data-source";
import { PackageFees } from "erp-db";

export const packageFeesReposirtory = dataSource.getRepository(PackageFees)