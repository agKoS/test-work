import { useAppSelector } from "../../redux/hooks";
import { getPageNumberInfoSelector } from "../../redux/slices/tableSlice";
import classes from "./PaginationBar.module.scss";
import { PaginationButton } from "./PaginationButton/PagintaionButton";
import { SelectSizePagination } from "./SelectSizePagination/SelectSizePagination";

export const PaginationBar = () => {
    const [currentPage, totalPages] = useAppSelector(getPageNumberInfoSelector);

    return (
        <div className={classes.container}>
            <PaginationButton dir="toStart" type="toTheEdge">
                {"<<"}
            </PaginationButton>
            <PaginationButton dir="toStart" type="stepByStep">
                {"<"}
            </PaginationButton>
            <span>
                {currentPage} of {totalPages}
            </span>
            <PaginationButton dir="toEnd" type="stepByStep">
                {">"}
            </PaginationButton>
            <PaginationButton dir="toEnd" type="toTheEdge">
                {">>"}
            </PaginationButton>
            <SelectSizePagination />
        </div>
    );
};
