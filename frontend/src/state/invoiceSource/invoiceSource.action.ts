import { createAsyncThunk } from "@reduxjs/toolkit";
import invoiceSourceService, {
  type IInvoiceSourceRecord,
} from "src/services/invoiceSource/invoiceSource.service";
import type {
  IInvoiceSourceDetails,
  IInvoiceSourceStatus,
} from "src/services/invoiceSource/invoiceSource.model";

export const searchInvoiceSourceData = createAsyncThunk(
  "invoiceSourceMaster/searchInvoiceSourceData",
  async (data: any) => {
    return invoiceSourceService.searchInvoiceSourceData(data);
  },
);

export const createNewInvoiceSource = createAsyncThunk(
  "invoiceSourceMaster/createNewInvoiceSource",
  async (data: IInvoiceSourceDetails) => {
    return invoiceSourceService.createNewInvoiceSource(data);
  },
);

export const editInvoiceSourceById = createAsyncThunk(
  "invoiceSourceMaster/editInvoiceSourceById",
  async (data: IInvoiceSourceRecord) => {
    return invoiceSourceService.editInvoiceSourceById(data);
  },
);

export const removeInvoiceSourceById = createAsyncThunk(
  "invoiceSourceMaster/removeInvoiceSourceById",
  async (id: number) => {
    return invoiceSourceService.removeInvoiceSourceById(id);
  },
);

export const updateInvoiceSourceStatus = createAsyncThunk(
  "invoiceSourceMaster/updateInvoiceSourceStatus",
  async (data: IInvoiceSourceStatus) => {
    return invoiceSourceService.updateInvoiceSourceStatus(data);
  },
);
