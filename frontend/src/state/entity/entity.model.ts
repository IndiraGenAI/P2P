import type { IEntityList } from "src/services/entity/entity.model";

export interface IEntityMasterState {
  entitiesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IEntityList;
  };
  createEntity: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
