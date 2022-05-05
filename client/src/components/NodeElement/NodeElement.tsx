import { fetchChildren } from "../../redux/slices/nodesSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { OpenButton } from "./OpenButton/OpenButton";

import { isOpenChange } from "../../redux/slices/nodesSlice";

import { NodeTitle } from "./NodeTitle/NodeTitle";

import classes from "./NodeElement.module.scss";
import { INodeElement } from "../../types/INodeElement";

export const NodeElement = ({ node }: { node: INodeElement }) => {

    const dispatch = useAppDispatch();

    const [showChildren, setShowChildren] = useState<boolean>(node.isOpen);

    useEffect(() => {
        setShowChildren(node.isOpen)
    }, [node.isOpen])

    const handleShowClick = async () => {
        if (!node.loadChildren) {
            dispatch(fetchChildren(node.id));
        }
        dispatch(isOpenChange({id: node.id, isOpen: !showChildren}))
        setShowChildren(!showChildren);
    };

    return (
        <div className={classes.node}>
            <div className={classes.name}>
                {(node.children.length > 0) && (
                    <OpenButton
                        handleShowClick={handleShowClick}
                        showChildren={showChildren}
                    />
                )}
                <NodeTitle node={node} />
            </div>
            <div className={classes.children}>
                {(node!.children.length > 0) &&
                    showChildren &&
                    node.childNodes!.map((node) => <NodeElement node={node} key={node.id} />)}
            </div>
        </div>
    );
};
