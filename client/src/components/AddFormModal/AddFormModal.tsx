import { Dispatch, SetStateAction } from "react";
import classNames from "classnames";
import { Formik, Form } from "formik";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    clearActiveNode,
    selectActiveInfoSelector,
} from "../../redux/slices/activeNodeSlice";
import {
    CreateNode,
    addChildRequest,
    changeStatus,
    selectStatusSelector,
} from "../../redux/slices/nodesSlice";
import { Button } from "../Button/Button";
import { InputField } from "../InputField/InputField";
import SubmitAddFormButton from "./SubmitAddButton/SubmitAddButton";

import classes from "../FormSection/FormSection.module.scss";
import inputSchema from "../../lib/inputSchema";

import type { FieldName } from "../../types/FieldName";
import type { FormValues } from "../../types/FormValues";

interface AddFormModalProps {
    setActive: Dispatch<SetStateAction<boolean>>;
}

const fieldNames: FieldName[] = ["name", "ip", "port"];

export const AddFormModal = ({ setActive }: AddFormModalProps) => {
    //* Начальные значения
    const initialValues: FormValues = {
        name: "",
        ip: "",
        port: "",
    };
    //* Активный узел
    const info = useAppSelector(selectActiveInfoSelector);
    //* Статус загрузки
    const [status, operation] = useAppSelector(selectStatusSelector);

    const dispatch = useAppDispatch();

    //* Классы для стилей
    const formClass = classNames(classes.form, classes.active);
    const titleClass = classNames(classes.title);
    const messageClass = classNames(
        classes.message,
        { [classes.messageError]: status === "failed" },
        { [classes.messageSuccess]: status === "succeeded" }
    );

    return (
        <div className={classes.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={inputSchema}
                validateOnChange={false}
                onSubmit={async (values, { resetForm }) => {
                    const createInfo: CreateNode = {
                        name: values.name,
                        ip: values.ip,
                        port: +values.port,
                        parent_id: info ? info.id : null,
                    };

                    try {
                        await dispatch(addChildRequest(createInfo)).unwrap();
                        setActive(false);
                        dispatch(clearActiveNode());
                        resetForm();
                    } finally {
                        setTimeout(
                            () =>
                                dispatch(
                                    changeStatus({
                                        status: "idle",
                                        operation: null,
                                    })
                                ),
                            2000
                        );
                    }
                }}
                onReset={() => {
                    setActive(false);
                }}
            >
                <Form className={formClass}>
                    <h3 className={titleClass}>Новый узел</h3>
                    <div className={classes.inputs}>
                        {[...fieldNames].map((name, index) => {
                            return <InputField key={index} fieldName={name} />;
                        })}
                    </div>
                    <div className={classes.buttons}>
                        <SubmitAddFormButton>Подтвердить</SubmitAddFormButton>
                        <Button type="reset">Отмена</Button>
                    </div>
                    {status === "failed" && operation === "create" && (
                        <div className={messageClass}>
                            "Узел с такими данными уже существует"
                        </div>
                    )}
                </Form>
            </Formik>
        </div>
    );
};
