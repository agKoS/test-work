import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    fetchNodesForTable,
    getFilterValuesSelector,
    getPageNumberInfoSelector,
} from "../../../redux/slices/tableSlice";

export const SelectSizePagination = () => {
    const [, , size] = useAppSelector(getPageNumberInfoSelector);
    const [nameFilter, portFilter] = useAppSelector(getFilterValuesSelector);
    const dispatch = useAppDispatch();

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const filterObj: { name?: string; port?: number } = {};
        if (nameFilter !== undefined) {
            filterObj.name = nameFilter;
        }
        if (portFilter !== undefined) {
            filterObj.port = portFilter;
        }
        dispatch(
            fetchNodesForTable({
                page: 1,
                size: +event.target.value,
                ...filterObj,
            })
        );
    };

    return (
        <label>
            Size:
            <select value={size} onChange={(event) => handleChange(event)}>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
            </select>
        </label>
    );
};
