import { Button } from "../../Button/Button";
import type { FormValues } from "../../../types/FormValues";
import { useFormikContext } from "formik";

interface ISubmitButton {
    children: string;
}

const SubmitAddFormButton = ({ children }: ISubmitButton) => {
    const { values, errors } = useFormikContext<FormValues>();

    const disableApplyButton = () => {
        const isChangeValues =
            values.name === "" || values.ip === "" || values.port === "";

        const isCorrectValues = !errors.name && !errors.ip && !errors.port;

        return isChangeValues || !isCorrectValues;
    };

    return (
        <Button disable={disableApplyButton()} type="submit">
            {children}
        </Button>
    );
};

export default SubmitAddFormButton;
