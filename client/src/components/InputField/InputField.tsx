import classNames from "classnames";
import { useField } from "formik";

import { inputInfoField } from "./inputInfo";
import classes from "./InputField.module.scss";

import type { FieldName } from "../../types/FieldName";

interface InputProps {
    fieldName: FieldName;
}

export const InputField = ({ fieldName }: InputProps) => {
    const { label, ...props } = inputInfoField[fieldName];

    const [field, meta] = useField(props);

    const correctClass: string = classNames(classes.input, {
        //? Посмотреть проверки
        [classes.input_error]: meta.error && meta.touched,
    });

    return (
        <div className={classes.container}>
            <label htmlFor={props.id}>{label}:</label>
            <input className={correctClass} {...field} {...props} />
            {meta.touched && meta.error && (
                <span className={classes.error}>{meta.error}</span>
            )}
        </div>
    );
};
