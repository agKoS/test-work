import { RootState } from "./../store";
import type { NodesResponse } from "./../../types/INodeElement";
import { LoadingStatus } from "../../types/LoadingStatus";
import { omit } from "lodash-es";

import axios from "axios";

import {
    createEntityAdapter,
    createSlice,
    createSelector,
    createAsyncThunk,
    PayloadAction,
} from "@reduxjs/toolkit";

//! Типы

interface TableInitialState {
    status: LoadingStatus;
    isTableLoaded: boolean;
    currentPage: number; // Текущая страница
    totalPages: number; // Общее число страниц
    perPage: number; // Число отображаемых элементов
    totalCount: number; //? Общее число элементов
    nameFilter?: string; // поле для фильтрации значения имени
    portFilter?: number; // поле для фильтрации значения по порту
}

//* Параметры для запроса
interface RequestParams {
    name?: string;
    port?: number | string;
    size: number;
    page: number;
}

//* Интерфейс для получаемого ответа с сервера при наличии параметров
interface ResponseWithParams {
    totalCount: number;
    selectedNodes: NodesResponse[];
}

//* Возвращаемое значение из fetchNodesForTable
interface ReturnFetchNodes {
    receivedData: ResponseWithParams;
    currentPage: number;
    perPage: number;
}

interface IFilters {
    nameFilter: string;
    portFilter: string;
}
//! Thunks

/**
 ** Получение всех узлов
 */
export const fetchNodesForTable = createAsyncThunk(
    "table/fetchNodesForTable",
    async (params: RequestParams) => {
        const copyParams: Partial<RequestParams> = { ...params };
        if (copyParams.name === "") {
            delete copyParams.name;
        }
        if (copyParams.port === "") {
            delete copyParams.port;
        } else if (copyParams.port !== undefined) {
            copyParams.port = +copyParams.port;
        }
        const response = await axios.get("/api/nodes", { params: copyParams });
        const receivedData = (await response.data) as ResponseWithParams;
        return {
            receivedData,
            currentPage: params.page,
            perPage: params.size,
        } as ReturnFetchNodes;
    }
);

//! Cоздаем tableSlice

const initialValue: TableInitialState = {
    status: "idle",
    isTableLoaded: false,
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalCount: 0,
};

const tableAdapter = createEntityAdapter<NodesResponse>();

const initialState = tableAdapter.getInitialState(initialValue);

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        cleanFilters(state) {
            delete state.nameFilter;
            delete state.portFilter;
        },
        setFilers(state, action: PayloadAction<IFilters>) {
            const { nameFilter, portFilter } = action.payload;
            if (nameFilter && portFilter) {
                state.nameFilter = nameFilter;
                state.portFilter = +portFilter;
            } else if (!nameFilter && portFilter) {
                delete state.nameFilter;
                state.portFilter = +portFilter;
            } else if (nameFilter && !portFilter) {
                state.nameFilter = nameFilter;
                delete state.portFilter;
            }
        },
    },
    extraReducers(builder) {
        builder
            /**
             ** Получение всех данных
             */
            .addCase(fetchNodesForTable.pending, (state, _) => {
                state.status = "loading";
            })
            .addCase(
                fetchNodesForTable.fulfilled,
                (state, action: PayloadAction<ReturnFetchNodes>) => {
                    const { receivedData, currentPage, perPage } =
                        action.payload;

                    let { totalCount, selectedNodes } = receivedData;
                    state.currentPage = currentPage;
                    state.perPage = perPage;
                    state.totalPages = Math.ceil(totalCount / perPage);
                    state.totalCount = totalCount;
                    tableAdapter.removeAll(state);
                    tableAdapter.upsertMany(state, selectedNodes);
                    state.status = "succeeded";
                    state.isTableLoaded = true;
                }
            )
            .addCase(fetchNodesForTable.rejected, (state, _) => {
                state.status = "failed";
            });
        /**
         ** Получение данных для пагинации
         */
    },
});

//! Редьюсер

export default tableSlice.reducer;

export const { cleanFilters, setFilers } = tableSlice.actions;

//! Селекторы

//* Стандартные селекторы адаптера
export const { selectAll, selectById } = tableAdapter.getSelectors<RootState>(
    (state) => state.table
);

//* Нужно ли отображать лоадер при загрузке страницы
export const showTableLoaderSelector = createSelector(
    (state: RootState) => state.table,
    (state) => {
        return (
            !state.isTableLoaded &&
            (state.status === "idle" || state.status === "loading")
        );
    }
);

//* Получение данных для построения таблицы
export const getDataForTable = createSelector(selectAll, (tableData) =>
    tableData.map((data) => omit(data, ["parent_id"]))
);

//* Получение номера текущей страницы, общего числа страниц и числа отображаемых элементов
export const getPageNumberInfoSelector = createSelector(
    (state: RootState) => state.table,
    (tableState) =>
        [tableState.currentPage, tableState.totalPages, tableState.perPage] as [
            number,
            number,
            number
        ]
);

//* Получение значений фильтров для поиска
export const getFilterValuesSelector = createSelector(
    (state: RootState) => state.table,
    (tableState) =>
        [tableState.nameFilter, tableState.portFilter] as [
            string | undefined,
            number | undefined
        ]
);
