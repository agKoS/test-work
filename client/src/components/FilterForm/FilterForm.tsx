import { useState } from "react";
import { Formik, Form } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    cleanFilters,
    fetchNodesForTable,
    getFilterValuesSelector,
    getPageNumberInfoSelector,
    setFilers,
} from "../../redux/slices/tableSlice";
import { FieldName } from "../../types/FieldName";
import { FormValues } from "../../types/FormValues";
import classes from "./FilterForm.module.scss";
import { inputFilterSchema } from "../../lib/inputFilterSchema";
import { InputField } from "../InputField/InputField";
import { Button } from "../Button/Button";

const fieldNames: FieldName[] = ["name", "port"];

type FormFilterValue = Omit<FormValues, "ip">;

export const FilterForm = () => {
    const [, , size] = useAppSelector(getPageNumberInfoSelector);

    const dispatch = useAppDispatch();

    const initialValues: FormFilterValue = {
        name: "",
        port: "",
    };

    return (
        <div className={classes.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={inputFilterSchema}
                validateOnChange={false}
                onSubmit={async (values) => {
                    if (!(values.name || values.port)) {
                        dispatch(cleanFilters());
                    } else {
                        dispatch(
                            setFilers({
                                nameFilter: values.name,
                                portFilter: values.port,
                            })
                        );
                    }
                    dispatch(
                        fetchNodesForTable({
                            size,
                            name: values.name,
                            page: 1,
                            port: values.port,
                        })
                    );
                }}
                onReset={() => {
                    dispatch(cleanFilters());
                    dispatch(fetchNodesForTable({ size, page: 1 }));
                }}
            >
                <Form className={classes.form}>
                    <h3>Фильтрация</h3>
                    <div className={classes.inputContainer}>
                        {[...fieldNames].map((name, index) => {
                            return <InputField key={index} fieldName={name} />;
                        })}
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button type="submit">Поиск</Button>
                        <Button type="reset">Сброс</Button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
