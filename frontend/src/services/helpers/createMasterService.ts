import config from '@/utils/config';
import request from '@/axios/request';
import type { IApiResponse } from '@/utils/models/common';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

export interface IMasterListResult<T> {
  rows: T[];
  meta: IMetaProps;
}

export function createMasterService<TRow extends { id: number }>(
  resourcePath: string,
) {
  const ENDPOINT = config.baseApiMasters + resourcePath;

  return {
    ENDPOINT,

    search: (data: unknown): Promise<IApiResponse<IMasterListResult<TRow>>> =>
      request({ url: ENDPOINT, method: 'GET', params: data }).then(
        (res) => res.data,
      ),

    create: (data: Partial<TRow>): Promise<IApiResponse<TRow>> => {
      const { id: _omit, ...rest } = data as Record<string, unknown>;
      void _omit;
      return request({ url: ENDPOINT, method: 'POST', data: rest }).then(
        (res) => res.data,
      );
    },

    edit: (
      data: Partial<TRow> & { id: number },
    ): Promise<IApiResponse<TRow>> => {
      const { id, ...rest } = data;
      return request({
        url: `${ENDPOINT}/${id}`,
        method: 'PUT',
        data: rest,
      }).then((res) => res.data);
    },

    remove: (id: number): Promise<IApiResponse<unknown>> =>
      request({ url: `${ENDPOINT}/${id}`, method: 'DELETE' }).then(
        (res) => res.data,
      ),

    updateStatus: (data: {
      id: number;
      status?: boolean;
    }): Promise<IApiResponse<unknown>> =>
      request({
        url: `${ENDPOINT}/${data.id}/status`,
        method: 'PATCH',
        data: { status: data.status },
      }).then((res) => res.data),
  };
}
