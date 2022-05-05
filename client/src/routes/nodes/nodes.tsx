import { useEffect } from "react";
import { FormSection } from "../../components/FormSection/FormSection";
import { NodesSection } from "../../components/NodesSection/NodesSection";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    fetchFirstNodes,
    showNodesLoaderSelector,
} from "../../redux/slices/nodesSlice";
import classes from "./nodes.module.scss";

export const NodesPage = () => {
    const dispatch = useAppDispatch();
    //* Получение глобального статуса загрузки
    const showLoader = useAppSelector(showNodesLoaderSelector);

    useEffect(() => {
        dispatch(fetchFirstNodes());
    }, []);

    return (
        <>
            {!showLoader ? (
                <div className={classes.nodesPageContainer}>
                    <NodesSection />
                    <FormSection />
                </div>
            ) : (
                "LOADING..."
            )}
        </>
    );
};
