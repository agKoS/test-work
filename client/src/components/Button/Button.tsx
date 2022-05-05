import { useAppSelector } from "../../redux/hooks";
import { selectStatusSelector } from "../../redux/slices/nodesSlice";

import classes from "./Button.module.scss";

interface IButtonProps {
    children: string;
    handleClick?: () => void;
    disable?: boolean;
    type?: "button" | "submit" | "reset";
}

export const Button = ({
    children,
    handleClick,
    disable,
    type = "button",
}: IButtonProps) => {
    const [status] = useAppSelector(selectStatusSelector);
    let conditionDisable = disable || status === "loading";

    return (
        <button
            type={type}
            className={classes.button}
            disabled={conditionDisable}
            onClick={handleClick}
        >
            {children}
        </button>
    );
};
