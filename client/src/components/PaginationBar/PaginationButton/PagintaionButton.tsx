import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    fetchNodesForTable,
    getFilterValuesSelector,
    getPageNumberInfoSelector,
} from "../../../redux/slices/tableSlice";
import { Button } from "../../Button/Button";

interface PaginationButtonProps {
    children: string;
    dir: "toStart" | "toEnd";
    type: "stepByStep" | "toTheEdge";
}

export const PaginationButton = ({
    children,
    dir,
    type,
}: PaginationButtonProps) => {
    const [currentPage, totalPages, size] = useAppSelector(
        getPageNumberInfoSelector
    );
    const [nameFilter, portFilter] = useAppSelector(getFilterValuesSelector);

    const dispatch = useAppDispatch();

    // Условие для disable
    const disableCondition = (dir: PaginationButtonProps["dir"]) => {
        let toStartCondition = dir === "toStart" && currentPage === 1;
        let toEndCondition = dir === "toEnd" && currentPage === totalPages;

        if (dir === "toStart") {
            return toStartCondition;
        } else {
            return toEndCondition;
        }
    };

    const handleClick = (
        dir: PaginationButtonProps["dir"],
        type: PaginationButtonProps["type"]
    ) => {
        const filterObj: { name?: string; port?: number } = {};
        if (nameFilter !== undefined) {
            filterObj.name = nameFilter;
        }
        if (portFilter !== undefined) {
            filterObj.port = portFilter;
        }

        if (dir === "toEnd") {
            if (type === "stepByStep") {
                dispatch(
                    fetchNodesForTable({
                        size,
                        page: currentPage + 1,
                        ...filterObj,
                    })
                );
            } else {
                dispatch(
                    fetchNodesForTable({ size, page: totalPages, ...filterObj })
                );
            }
        } else {
            if (type === "stepByStep") {
                dispatch(
                    fetchNodesForTable({
                        size,
                        page: currentPage - 1,
                        ...filterObj,
                    })
                );
            } else {
                dispatch(fetchNodesForTable({ size, page: 1, ...filterObj }));
            }
        }
    };

    return (
        <Button
            disable={disableCondition(dir)}
            handleClick={() => handleClick(dir, type)}
        >
            {children}
        </Button>
    );
};
