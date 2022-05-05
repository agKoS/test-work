import { Button } from "../../Button/Button";
import { useAppSelector } from "../../../redux/hooks";
import { selectActiveInfoSelector } from "../../../redux/slices/activeNodeSlice";
import classes from "../NodesSection.module.scss"
import { Dispatch, SetStateAction } from "react";

interface INodeSectionButtonsProps {
  [key: string]: Dispatch<SetStateAction<boolean>>
}

const NodesSectionButtons = (props: INodeSectionButtonsProps) => {
    const info = useAppSelector(selectActiveInfoSelector);

    return (
        <div className={classes.buttons}>
            <Button handleClick={() => props.setActiveAddModal(true)}>
                Добавить узел
            </Button>
            <Button handleClick={() => props.setActiveDeleteModal(true)} disable={!info}>
                Удалить узел
            </Button>
        </div>
    );
};

export default NodesSectionButtons;
