import { Button } from "../../Button/Button";
import type { FormValues } from "../../../types/FormValues";
import { useFormikContext } from "formik";
import { INodeElement } from "../../../types/INodeElement";

const SubmitUpgradeButton = ({
    children,
    info,
}: {
    children: string;
    info: INodeElement | null;
}) => {
    const { values, errors } = useFormikContext<FormValues>();

    const disableApplyButton = (info: INodeElement | null) => {
        const isChangeValues =
            info?.name === values.name &&
            info?.ip === values.ip &&
            info?.port === +values.port;

        const isCorrectValues = errors.name || errors.ip || errors.port;

        return isChangeValues || Boolean(isCorrectValues);
    };

    return (
        <Button disable={disableApplyButton(info)} type="submit">
            {children}
        </Button>
    );
};

export default SubmitUpgradeButton;
