import NodesTable from "../NodesTable/NodesTable";
import { PaginationBar } from "../PaginationBar/PaginationBar";
import { useAppSelector } from "../../redux/hooks";
import { getPageNumberInfoSelector } from "../../redux/slices/tableSlice";

export const TableSection = () => {
    const [, totalCount] = useAppSelector(getPageNumberInfoSelector);

    return (
        <>
            {totalCount ? (
                <>
                    <NodesTable />
                    <PaginationBar />
                </>
            ) : (
                "Узлы отсутствуют"
            )}
        </>
    );
};
