import { LoadingStatus } from "./../../types/LoadingStatus";
import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    PayloadAction,
} from "@reduxjs/toolkit";

import axios from "axios";

import type { RootState } from "../store";
import type { INodeElement, NodesInfo } from "../../types/INodeElement";

//* Типы для operation и status
type OperationType = "create" | "update" | "delete" | null;

interface OpearationStatusAction {
    status: LoadingStatus;
    operation: OperationType;
}

//* Типы для создания нового узла
export interface CreateNode {
    name: string;
    ip: string;
    port: number;
    parent_id: number | null;
}

type ChildResponse = Omit<
    INodeElement,
    "loadChildren" | "isOpen" | "childNodes"
>;

//* Типы для удаления узла
export interface DeleteNode {
    id: number;
    parent_id: number | null;
    parentChildren: number[] | null;
    nodesForDelete: number[];
}

interface DeletedNodesResponse {
    parent_id: number;
    newChildrenList: number[];
    deletedIds: number[];
}

//! Thunks
/**
 ** Получение узлов, у которых parent_id === null
 */
export const fetchFirstNodes = createAsyncThunk(
    "nodes/fetchFirstNodes",
    async () => {
        const response = await axios.get(`/api/nodes/first`);
        return (await response.data) as ChildResponse[];
    }
);

/**
 ** Получение дочерних узлов
 */
export const fetchChildren = createAsyncThunk(
    "nodes/fetchChildren",
    async (id: number) => {
        const response = await axios.get(`/api/nodes/${id}/children`);
        return (await response.data) as ChildResponse[];
    }
);

/**
 ** Обновление информации об узле
 */
export const fetchUpdateNode = createAsyncThunk(
    "nodes/fetchUpdateNode",
    async (data: NodesInfo) => {
        const { id, ...rest } = data;
        const response = await axios.put(`/api/nodes/${id}`, {
            data: { ...rest },
        });
        return (await response.data) as NodesInfo;
    }
);

/**
 ** Добавление дочернего узла
 */
export const addChildRequest = createAsyncThunk(
    "nodes/addChildRequest",
    async (info: CreateNode) => {
        const response = await axios.post(`/api/nodes`, { data: { ...info } });
        return (await response.data) as ChildResponse;
    }
);

/**
 ** Удаляем узел вместе с дочерними
 */
export const deleteNodeRequest = createAsyncThunk(
    "nodes/deleteNodeRequest",
    async (data: DeleteNode) => {
        const {
            id,
            parent_id,
            parentChildren,
            nodesForDelete: deletedIds,
        } = data;
        await axios.delete(`/api/nodes/${id}`);

        let newChildrenList;
        if (parentChildren) {
            newChildrenList = parentChildren.filter(
                (childId) => childId !== id
            );
        } else {
            newChildrenList = null;
        }

        return {
            newChildrenList,
            deletedIds,
            parent_id,
        } as DeletedNodesResponse;
    }
);

//! Создаем nodeSlice

interface NodesInitialState {
    status: LoadingStatus;
    isNodesLoaded: boolean;
    operation: OperationType;
}

const initialValue: NodesInitialState = {
    status: "idle",
    isNodesLoaded: false,
    operation: null,
};

const nodesAdapter = createEntityAdapter<INodeElement>();

const initialState = nodesAdapter.getInitialState(initialValue);

const nodesSlice = createSlice({
    name: "nodes",
    initialState,
    reducers: {
        // Изменение isOpen
        isOpenChange(state, action) {
            const { isOpen, id } = action.payload;
            nodesAdapter.updateOne(state, { id, changes: { isOpen } });
        },
        // Изменение статуса
        changeStatus(state, action: PayloadAction<OpearationStatusAction>) {
            const { operation, status } = action.payload;
            state.operation = operation;
            state.status = status;
        },
    },
    extraReducers(builder) {
        builder
            /**
             * Получение информации об узле
             */
            .addCase(fetchFirstNodes.pending, (state, _) => {
                state.status = "loading";
            })
            .addCase(fetchFirstNodes.fulfilled, (state, { payload }) => {
                const nodes: INodeElement[] = payload.map((node) => ({
                    ...node,
                    loadChildren: false,
                    isOpen: false,
                }));
                nodesAdapter.upsertMany(state, nodes);
                state.status = "succeeded";
                state.isNodesLoaded = true;
            })
            .addCase(fetchFirstNodes.rejected, (state, action) => {
                state.status = "failed";
            })
            /**
             * Получение дочерних узлов первого уровня
             */
            .addCase(fetchChildren.fulfilled, (state, { payload }) => {
                const childNodes: INodeElement[] = payload.map((node) => ({
                    ...node,
                    loadChildren: false,
                    isOpen: false,
                }));
                const parentId = childNodes[0].parent_id;
                nodesAdapter.updateOne(state, {
                    id: parentId!,
                    changes: { loadChildren: true },
                });
                nodesAdapter.addMany(state, childNodes);
            })
            /**
             * Обновление узла
             */
            .addCase(fetchUpdateNode.pending, (state, _) => {
                state.operation = "update";
                state.status = "loading";
            })
            .addCase(fetchUpdateNode.fulfilled, (state, action) => {
                const { id, name, ip, port }: NodesInfo = action.payload;
                nodesAdapter.updateOne(state, {
                    id,
                    changes: { name, ip, port },
                });
                state.status = "succeeded";
            })
            .addCase(fetchUpdateNode.rejected, (state, _) => {
                state.status = "failed";
            })
            /**
             * Добавление узла
             */
            .addCase(addChildRequest.pending, (state, _) => {
                state.operation = "create";
                state.status = "loading";
            })
            .addCase(
                addChildRequest.fulfilled,
                (state, action: PayloadAction<ChildResponse>) => {
                    const newNode = action.payload;
                    nodesAdapter.updateOne(state, {
                        id: newNode.parent_id!,
                        changes: {
                            children: [newNode.id],
                            isOpen: true,
                            loadChildren: true,
                        },
                    });
                    const childNode: INodeElement = {
                        ...newNode,
                        children: [],
                        loadChildren: false,
                        isOpen: false,
                    };
                    nodesAdapter.addOne(state, childNode);
                    state.status = "succeeded";
                }
            )
            .addCase(addChildRequest.rejected, (state, _) => {
                state.status = "failed";
            })
            /**
             * Удаление узла
             */
            .addCase(deleteNodeRequest.pending, (state, _) => {
                state.operation = "delete";
                state.status = "loading";
            })
            .addCase(
                deleteNodeRequest.fulfilled,
                (state, action: PayloadAction<DeletedNodesResponse>) => {
                    const {
                        deletedIds,
                        parent_id,
                        newChildrenList,
                    }: DeletedNodesResponse = action.payload;
                    if (parent_id) {
                        nodesAdapter.updateOne(state, {
                            id: parent_id,
                            changes: { children: newChildrenList },
                        });
                    }
                    nodesAdapter.removeMany(state, deletedIds);
                    state.status = "succeeded";
                }
            )
            .addCase(deleteNodeRequest.rejected, (state, _) => {
                state.status = "failed";
            });
    },
});

//! Редьюсер

export default nodesSlice.reducer;

//! Селекторы

//* Стандартные селекторы адаптера
export const {
    selectAll: selectAllNodes,
    selectById: selectNodeById,
    selectIds,
} = nodesAdapter.getSelectors<RootState>((state) => state.nodes);

export const { isOpenChange, changeStatus } = nodesSlice.actions;

//* Нужно ли отображать лоадер при загрузке страницы
export const showNodesLoaderSelector = createSelector(
    (state: RootState) => state.nodes,
    (state) => {
        return (
            !state.isNodesLoaded &&
            (state.status === "idle" || state.status === "loading")
        );
    }
);

//* Получение глобального статуса загрузки
export const selectStatusSelector = createSelector(
    (state: RootState) => state.nodes,
    (state) => [state.status, state.operation]
);

//* Получение элемента по parent_id дочернего элемента
export const selectParentNodeSelector = createSelector(
    selectAllNodes,
    (state: RootState, parent_id: number | null) => parent_id,
    (allNodes, parent_id) => {
        if (parent_id === null) return null;

        return allNodes.find((node) => node.id === parent_id);
    }
);

//* Селектор для получения массива id дочерних узлов элемента
export const getChildIdsSelector = createSelector(
    [selectAllNodes, selectNodeById],
    (allNodes, parentNode) =>
        allNodes
            .filter((node) => parentNode?.children.includes(node.id))
            .map((node) => node.id)
);

//* Получение дочерних узлов по id-родителя
export const getChildrenSelector = createSelector(
    [selectAllNodes, (state, id) => id],
    (allNodes, parentId) =>
        allNodes.filter((node) => node.parent_id === parentId)
);

//* Получение узлов, у которых parent_id === null
export const getFirstNodesSelector = createSelector(selectAllNodes, (nodes) =>
    nodes.filter((node) => node.parent_id === null)
);

//* Получение числа узлов, у которых parent_id === null
export const getCountFirstNodesSelector = createSelector(
    (state: RootState) => getFirstNodesSelector(state),
    (nodes) => nodes.length
);

//* Селектор, возвращающий дерево узлов
export const getTreeNodes = createSelector(
    selectAllNodes,
    getFirstNodesSelector,
    (allNodes, firstNodes) => {
        function recursiveResult(parentNode: INodeElement) {
            // Получаем копию узла
            const nodeCopy: INodeElement = JSON.parse(
                JSON.stringify(parentNode)
            );
            // Если отсутствуют дочерние узлы, то возвращаем просто узел
            if (nodeCopy.children.length === 0) {
                return nodeCopy;
            }
            // Получаем массив дочерних узлов, представленных объектами
            const childs: INodeElement[] = allNodes.filter(
                (node) => node.parent_id === parentNode.id
            );

            nodeCopy.childNodes = childs.map((node) => recursiveResult(node));

            return nodeCopy;
        }

        return firstNodes.map((node) => recursiveResult(node));
    }
);

//* Селектор для получения id удаленных узлов
export const deletedNodesSelector = createSelector(
    selectAllNodes,
    (state: RootState, activeNode: INodeElement | null) => activeNode,
    (allNodes, activeNode) => {
        function recursiveResult(
            ids: number[],
            childrenIds: number[]
        ): number[] {
            if (childrenIds.length === 0) {
                return ids;
            }

            // Получаем дочерние узлы
            const childrenNodesIds = allNodes
                .filter((node) => childrenIds.includes(node.id))
                .reduce(
                    (result: number[], child) => [...result, ...child.children],
                    []
                );

            const allNodesId = [...ids, ...childrenIds];

            return recursiveResult(allNodesId, childrenNodesIds);
        }

        if (activeNode === null) return [];

        return recursiveResult([activeNode.id], activeNode.children);
    }
);
