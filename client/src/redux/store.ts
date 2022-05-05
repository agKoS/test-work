import { configureStore } from "@reduxjs/toolkit";
import nodesReducer from "./slices/nodesSlice";
import activeNodeReducer from "./slices/activeNodeSlice";
import tableReducer from "./slices/tableSlice";

export const store = configureStore({
    reducer: {
        nodes: nodesReducer,
        active: activeNodeReducer,
        table: tableReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
