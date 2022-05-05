import { object, string, number } from "yup";

export const inputFilterSchema = object({
    name: string()
        .strict()
        .trim("Не должно быть пробелов по краям вводимого значения"),
    port: number()
        .typeError("Введите число от 0 до 65535")
        .min(0, "Значение должно быть больше 0")
        .max(65535, "Значение должно быть меньше 65535")
        .integer("Значение должно быть целым числом"),
});
