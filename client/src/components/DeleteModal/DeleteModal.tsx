import { Dispatch, SetStateAction } from "react";
import {
    clearActiveNode,
    selectActiveInfoSelector,
} from "../../redux/slices/activeNodeSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { Button } from "../Button/Button";

import {
    deleteNodeRequest,
    selectParentNodeSelector,
    deletedNodesSelector,
    changeStatus
} from "../../redux/slices/nodesSlice";

import classes from "../Modal/Modal.module.scss";
import type { DeleteNode } from "../../redux/slices/nodesSlice";

interface DeleteModalProps {
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const DeleteModal = ({ setActive }: DeleteModalProps) => {
    // Получаем "активный" узел
    const info = useAppSelector(selectActiveInfoSelector);
    // Получаем id узлов, которые нужно удалить
    const nodesForDelete = useAppSelector(state => deletedNodesSelector(state, info))

    const parent_id = info ? info.parent_id : null;

    let parentNode = useAppSelector(state => selectParentNodeSelector(state, parent_id))

    const dispatch = useAppDispatch();

    const handleDeleteButton = async () => {
        if (info !== null) {
            const deleteInfo: DeleteNode = {
                id: info.id,
                parent_id,
                parentChildren:
                    parent_id ? [...parentNode!.children] : null,
                nodesForDelete
            };
            try {
                await dispatch(deleteNodeRequest(deleteInfo));
                setActive(false);
                dispatch(clearActiveNode());
            } finally {
                setTimeout(() => {
                    dispatch(changeStatus({ status: "idle", operation: null }))
                }, 2000)
            }
        }
    };
    const handleCancelButton = () => setActive(false);

    return (
        <>
            <span>
                Данное действие приведет к удалению не только самого узла, но и
                всех его дочерних узлов
            </span>
            <div className={classes.buttons}>
                <Button handleClick={handleDeleteButton}>Продолжить</Button>
                <Button handleClick={handleCancelButton}>Отмена</Button>
            </div>
        </>
    );
};
