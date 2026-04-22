export interface IPaginationProps {
  meta: IMetaProps;
}

export interface IMetaProps {
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
