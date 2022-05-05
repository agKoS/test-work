import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

import type { INodeElement } from "../../types/INodeElement";

interface ActiveState {
    activeNode: INodeElement | null;
}

const initialState: ActiveState = {
    activeNode: null,
};

const activeNodeSlice = createSlice({
    name: "activeNode",
    initialState,
    reducers: {
        /**
         * Reducer для добавления активного узла в state
         */
        addActiveNode: {
            reducer: (state, action: PayloadAction<INodeElement>) => {
                state.activeNode = action.payload;
            },
            prepare: (node: INodeElement) => {
                const { children, ...rest } = node;
                return { payload: { ...rest, children: [...children] } };
            },
        },
        /**
         * Reducer для 'очистки' активного узла
         *
         * @param state
         */
        clearActiveNode: (state) => {
            state.activeNode = null;
        },
    },
});

export default activeNodeSlice.reducer;

export const { addActiveNode, clearActiveNode } = activeNodeSlice.actions;

/**
 * Селектор для получения значения поля
 *
 * @param {RootState} - состояние приложения
 */
export const selectActiveInfoSelector = createSelector(
    (state: RootState) => state.active,
    (active) => active.activeNode
);
