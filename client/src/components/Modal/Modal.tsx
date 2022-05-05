import classNames from "classnames";
import { ReactNode } from "react";

import classes from "./Modal.module.scss";

interface ModalProps {
    active: boolean;
    children: ReactNode;
    isDeleteModal?: boolean;
}

export const Modal = ({ active, children, isDeleteModal }: ModalProps) => {
    const modalClass = classNames(classes.modal, {
        [classes.modalActive]: active,
        [classes.modalDelete]: isDeleteModal,
    });
    const contentClass = classNames(classes.content, {
        [classes.contentActive]: active,
        [classes.contentDelete]: isDeleteModal,
    });
    return (
        <div className={modalClass}>
            <div className={contentClass}>{children}</div>
        </div>
    );
};
