import { ButtonIcon } from "./ButtonIcon/ButtonIcon";
import classes from "./OpenButton.module.scss";

interface IOpenButtonProps {
    showChildren: boolean;
    handleShowClick: () => void;
}

export const OpenButton = ({
    showChildren: active,
    handleShowClick,
}: IOpenButtonProps) => {
    return (
        <button className={classes.button} onClick={handleShowClick}>
            <ButtonIcon active={active} />
        </button>
    );
};
