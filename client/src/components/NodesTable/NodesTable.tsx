import { useMemo } from "react";
import { Column, useTable } from "react-table";
import { useAppSelector } from "../../redux/hooks";
import { getDataForTable } from "../../redux/slices/tableSlice";
import { NodesInfo } from "../../types/INodeElement";

import classes from "./NodesTable.module.scss";

const NodesTable = () => {
    const tableData = useAppSelector(getDataForTable);

    const data = useMemo(() => {
        const result = tableData.map((row: NodesInfo) => ({
            name: row.name,
            ip: row.ip,
            port: row.port,
        }));
        return result;
    }, [tableData]);

    //* Интерфейс для столбцов
    interface NodeColumns {
        name: string;
        ip: string;
        port: number;
    }

    const columns: Column<NodeColumns>[] = useMemo(() => {
        return [
            { Header: "Name", accessor: "name" },
            { Header: "IP", accessor: "ip" },
            { Header: "Port", accessor: "port" },
        ];
    }, []);

    const tableInstance = useTable({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;
    return (
        <table {...getTableProps()} className={classes.table}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps()}
                                className={classes.headerTable}
                            >
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        className={classes.cellTable}
                                    >
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default NodesTable;
