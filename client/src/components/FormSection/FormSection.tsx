import classNames from "classnames";
import { Formik, Form } from "formik";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import classes from "./FormSection.module.scss";
import { Button } from "../Button/Button";
import {
    clearActiveNode,
    addActiveNode,
    selectActiveInfoSelector,
} from "../../redux/slices/activeNodeSlice";
import { InputField } from "../InputField/InputField";
import inputSchema from "../../lib/inputSchema";

//! Types
import type { NodesInfo } from "../../types/INodeElement";
import type { FieldName } from "../../types/FieldName";

import {
    changeStatus,
    fetchUpdateNode,
    selectStatusSelector,
} from "../../redux/slices/nodesSlice";
import SubmitUpgradeButton from "./SubmitUpgradeButton/SubmitUpgradeButton";
import { FormValues } from "../../types/FormValues";

const fieldNames: FieldName[] = ["name", "ip", "port"];

export const FormSection = () => {
    //* Активный узел
    const info = useAppSelector(selectActiveInfoSelector);
    //* Статус загрузки
    const [status, operation] = useAppSelector(selectStatusSelector);

    //* Начальные значения
    const initialValues: FormValues = {
        name: info ? info.name : "",
        ip: info ? info.ip : "",
        port: info ? info.port.toString() : "",
    };

    const dispatch = useAppDispatch();

    //* Классы для стилей
    const formClass = classNames(classes.form, { [classes.active]: info });
    const titleClass = classNames(classes.title);
    const messageClass = classNames(
        classes.message,
        { [classes.messageError]: status === "failed" },
        { [classes.messageSuccess]: status === "succeeded" },
        { [classes.messageCreate]: operation === "create" }
    );

    return (
        <div className={classes.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={inputSchema}
                validateOnChange={false}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    if (info) {
                        const updateInfo: NodesInfo = {
                            id: info.id,
                            name: values.name,
                            ip: values.ip,
                            port: +values.port,
                        };
                        try {
                            await dispatch(
                                fetchUpdateNode(updateInfo)
                            ).unwrap();
                            dispatch(addActiveNode({ ...info, ...updateInfo }));
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
                    }
                }}
            >
                <Form className={formClass}>
                    <h3 className={titleClass}>Информация об узле</h3>
                    <div className={classes.inputs}>
                        {fieldNames.map((name) => {
                            return <InputField key={name} fieldName={name} />;
                        })}
                    </div>

                    <div className={classes.buttons}>
                        <SubmitUpgradeButton info={info}>
                            Применить
                        </SubmitUpgradeButton>
                        <Button
                            type="button"
                            handleClick={() => dispatch(clearActiveNode())}
                        >
                            Отмена
                        </Button>
                    </div>
                    {status === "failed" && operation === "update" && (
                        <div className={messageClass}>
                            "Узел с такими данными уже существует"
                        </div>
                    )}
                </Form>
            </Formik>
            {status === "succeeded" && operation === "update" && (
                <div className={messageClass}>"Узел успешно обновлен"</div>
            )}
            {status === "succeeded" && operation === "create" && (
                <div className={messageClass}>"Узел успешно добавлен"</div>
            )}
            {status === "succeeded" && operation === "delete" && (
                <div className={messageClass}>"Узел успешно удален"</div>
            )}
        </div>
    );
};
