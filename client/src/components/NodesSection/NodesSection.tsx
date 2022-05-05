import { useState } from "react";
import { Modal } from "../Modal/Modal";

import { DeleteModal } from "../DeleteModal/DeleteModal";
import { Nodes } from "../Nodes/Nodes";

import classes from "./NodesSection.module.scss";
import { AddFormModal } from "../AddFormModal/AddFormModal";
import NodesSectionButtons from "./NodesSectionButtons/NodesSectionButtons";

export const NodesSection = () => {
    const [activeAddModal, setActiveAddModal] = useState<boolean>(false);
    const [activeDeleteModal, setActiveDeleteModal] = useState<boolean>(false);

    const props = {
        setActiveAddModal,
        setActiveDeleteModal,
    };

    return (
        <>
            <div className={classes.nodesSection}>
                <Nodes />

                <NodesSectionButtons {...props} />
            </div>
            <Modal active={activeAddModal}>
                <AddFormModal setActive={setActiveAddModal} />
            </Modal>
            <Modal active={activeDeleteModal} isDeleteModal={true}>
                <DeleteModal setActive={setActiveDeleteModal} />
            </Modal>
        </>
    );
};
