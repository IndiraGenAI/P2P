import { dataSource } from "@core/data-source";
import { Area } from "erp-db";

export const areasRepository = dataSource.getRepository(Area)