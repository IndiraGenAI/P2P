import {
  createAsyncThunk,
  createSlice,
  type AsyncThunkPayloadCreator,
} from '@reduxjs/toolkit';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

export interface IMasterRecord {
  id: number;
}

export interface IMasterListData<T> {
  rows: T[];
  meta: IMetaProps;
}

export interface IMasterApiResponse<T> {
  data: T;
  message: string;
}

export interface IMasterStateBlock {
  loading: boolean;
  hasErrors: boolean;
  message: string;
}

export interface IMasterState<TRow> {
  list: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IMasterListData<TRow>;
  };
  create: IMasterStateBlock;
  edit: IMasterStateBlock;
  remove: IMasterStateBlock;
  status: IMasterStateBlock;
}

export interface IMasterServiceContract<TRow, TCreate, TEdit> {
  search: (
    data: unknown,
  ) => Promise<IMasterApiResponse<IMasterListData<TRow>>>;
  create: (data: TCreate) => Promise<IMasterApiResponse<TRow>>;
  edit: (data: TEdit) => Promise<IMasterApiResponse<TRow>>;
  remove: (id: number) => Promise<IMasterApiResponse<unknown>>;
  updateStatus: (data: {
    id: number;
    status?: boolean;
  }) => Promise<IMasterApiResponse<unknown>>;
}

export function createMasterSlice<TRow, TCreate, TEdit>(
  name: string,
  service: IMasterServiceContract<TRow, TCreate, TEdit>,
) {
  const initialState: IMasterState<TRow> = {
    list: {
      loading: false,
      hasErrors: false,
      message: '',
      data: {
        rows: [],
        meta: {
          take: 0,
          itemCount: 0,
          pageCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      },
    },
    create: { loading: false, hasErrors: false, message: '' },
    edit: { loading: false, hasErrors: false, message: '' },
    remove: { loading: false, hasErrors: false, message: '' },
    status: { loading: false, hasErrors: false, message: '' },
  };

  const search = createAsyncThunk(
    `${name}/search`,
    (async (data: unknown) => service.search(data)) as AsyncThunkPayloadCreator<
      IMasterApiResponse<IMasterListData<TRow>>,
      unknown
    >,
  );
  const create = createAsyncThunk(
    `${name}/create`,
    (async (data: TCreate) => service.create(data)) as AsyncThunkPayloadCreator<
      IMasterApiResponse<TRow>,
      TCreate
    >,
  );
  const edit = createAsyncThunk(
    `${name}/edit`,
    (async (data: TEdit) => service.edit(data)) as AsyncThunkPayloadCreator<
      IMasterApiResponse<TRow>,
      TEdit
    >,
  );
  const remove = createAsyncThunk(
    `${name}/remove`,
    (async (id: number) => service.remove(id)) as AsyncThunkPayloadCreator<
      IMasterApiResponse<unknown>,
      number
    >,
  );
  const updateStatus = createAsyncThunk(
    `${name}/updateStatus`,
    (async (data: { id: number; status?: boolean }) =>
      service.updateStatus(data)) as AsyncThunkPayloadCreator<
      IMasterApiResponse<unknown>,
      { id: number; status?: boolean }
    >,
  );

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      clearMessage: (state) => {
        state.list.message = '';
        state.create.message = '';
        state.edit.message = '';
        state.remove.message = '';
        state.status.message = '';
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(search.pending, (state) => {
          state.list.loading = true;
        })
        .addCase(search.fulfilled, (state, action) => {
          const next = action.payload.data;
          state.list.data.rows = next.rows as typeof state.list.data.rows;
          state.list.data.meta = next.meta;
          state.list.message = action.payload.message;
          state.list.loading = false;
          state.list.hasErrors = false;
        })
        .addCase(search.rejected, (state, action) => {
          state.list.loading = false;
          state.list.hasErrors = true;
          state.list.message = action.error.message ?? '';
        })

        .addCase(create.pending, (state) => {
          state.create.loading = true;
        })
        .addCase(create.fulfilled, (state, action) => {
          state.create.loading = false;
          state.create.hasErrors = false;
          state.create.message = action.payload.message;
        })
        .addCase(create.rejected, (state, action) => {
          state.create.loading = false;
          state.create.hasErrors = true;
          state.create.message = action.error.message ?? '';
        })

        .addCase(edit.pending, (state) => {
          state.edit.loading = true;
        })
        .addCase(edit.fulfilled, (state, action) => {
          state.edit.loading = false;
          state.edit.hasErrors = false;
          state.edit.message = action.payload.message;
        })
        .addCase(edit.rejected, (state, action) => {
          state.edit.loading = false;
          state.edit.hasErrors = true;
          state.edit.message = action.error.message ?? '';
        })

        .addCase(remove.pending, (state) => {
          state.remove.loading = true;
        })
        .addCase(remove.fulfilled, (state, action) => {
          state.remove.loading = false;
          state.remove.hasErrors = false;
          state.remove.message = action.payload.message;
        })
        .addCase(remove.rejected, (state, action) => {
          state.remove.loading = false;
          state.remove.hasErrors = true;
          state.remove.message = action.error.message ?? '';
        })

        .addCase(updateStatus.pending, (state) => {
          state.status.loading = true;
        })
        .addCase(updateStatus.fulfilled, (state, action) => {
          state.status.loading = false;
          state.status.hasErrors = false;
          state.status.message = action.payload.message;
        })
        .addCase(updateStatus.rejected, (state, action) => {
          state.status.loading = false;
          state.status.hasErrors = true;
          state.status.message = action.error.message ?? '';
        });
    },
  });

  return {
    initialState,
    actions: {
      search,
      create,
      edit,
      remove,
      updateStatus,
    },
    slice,
    reducer: slice.reducer,
    clearMessage: slice.actions.clearMessage,
  };
}
