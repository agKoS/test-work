import { useEffect } from "react";
import { FilterForm } from "../../components/FilterForm/FilterForm";
import { TableSection } from "../../components/TableSection/TableSection";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    fetchNodesForTable,
    showTableLoaderSelector,
} from "../../redux/slices/tableSlice";

import classes from "./table.module.scss";

export const TablePage = () => {
    const dispatch = useAppDispatch();

    const showLoader = useAppSelector(showTableLoaderSelector);

    useEffect(() => {
        dispatch(fetchNodesForTable({ size: 10, page: 1 }));
    }, []);

    return (
        <>
            {!showLoader ? (
                <div className={classes.container}>
                    <TableSection />
                    <FilterForm />
                </div>
            ) : (
                "LOADING..."
            )}
        </>
    );
};
