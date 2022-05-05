import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

import ConfigIcon from "./ConfigIcon";

export const ButtonIcon = ({ active }: { active: boolean }) => {
    return (
        <ConfigIcon>
            {active ? <AiOutlineMinusCircle /> : <AiOutlinePlusCircle />}
        </ConfigIcon>
    );
};
