import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addActiveNode, selectActiveInfoSelector } from "../../../redux/slices/activeNodeSlice";

import type {INodeElement} from "../../../types/INodeElement";

import classes from "./NodeTitle.module.scss";
import classNames from "classnames";

export const NodeTitle = ({ node }: { node: INodeElement }) => {
    const info = useAppSelector(selectActiveInfoSelector)
    const dispatch = useAppDispatch();

    const statusActive = info && node.id === info.id;

    const titleClass = classNames(classes.name, {
        [classes.active]: statusActive,
        [classes.children]: !(node.children.length > 0),
    });

    const handleClick = () => {
        dispatch(addActiveNode(node))
    }

    return (
        <span className={titleClass} onClick={handleClick}>
            {node?.name}
        </span>
    );
};
