import classNames from "classnames";

import { useAppSelector } from "../../redux/hooks";
import { NodeElement } from "../NodeElement/NodeElement";
import {
    getCountFirstNodesSelector,
    getTreeNodes,
} from "../../redux/slices/nodesSlice";

import classes from "./Nodes.module.scss";

export const Nodes = () => {
    const nodeTree = useAppSelector(getTreeNodes);
    const countFirstNodes = useAppSelector(getCountFirstNodesSelector);

    const classContainer = classNames(classes.container, {
        [classes.without_nodes]: !countFirstNodes,
    });

    return (
        <div className={classContainer}>
            {!countFirstNodes ? (
                <p className={classes.notification}>Узлы отсутствуют</p>
            ) : (
                nodeTree.map((firstNode) => (
                    <NodeElement node={firstNode} key={firstNode.id} />
                ))
            )}
        </div>
    );
};
