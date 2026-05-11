import config from '@/utils/config';
import mainRequest from '@/axios/mainRequest';
import type { IApiResponse } from '@/utils/models/common';
import type { IBudgetListResult, IBudgetPayload, IBudgetRow } from './budget.model';

const ENDPOINT = config.baseApiMain + '/budget';

const budgetService = {
  ENDPOINT,

  search: (
    params: unknown,
  ): Promise<IApiResponse<IBudgetListResult>> =>
    mainRequest({ url: ENDPOINT, method: 'GET', params }).then((res) => res.data),

  getById: (id: number): Promise<IApiResponse<IBudgetRow>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'GET' }).then((res) => res.data),

  create: (
    data: IBudgetPayload,
  ): Promise<IApiResponse<IBudgetRow>> =>
    mainRequest({ url: ENDPOINT, method: 'POST', data }).then((res) => res.data),
};

export default budgetService;
