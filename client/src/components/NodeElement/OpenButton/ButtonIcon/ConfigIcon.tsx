import { IconBaseProps, IconContext } from "react-icons/lib";
import classes from "../OpenButton.module.scss";

export default function ConfigIcon({ children }: IconBaseProps) {
    return (
        <IconContext.Provider value={{ className: classes.icon }}>
            {children}
        </IconContext.Provider>
    );
}
