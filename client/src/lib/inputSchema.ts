import { object, string, number } from "yup";

const inputSchema = object({
    name: string()
        .strict(true)
        .trim("Не должно быть пробелов по краям вводимого значения")
        .required("Поле не должно быть пустым"),
    ip: string()
        .strict(true)
        .trim("Не должно быть пробелов по краям вводимого значения")
        .required("Поле не должно быть пустым")
        .matches(
            /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)$/,
            {
                excludeEmptyString: true,
                message: "Неверное значение IP-адреса",
            }
        ),
    port: number()
        .typeError("Введите число от 0 до 65535")
        .required("Поле не должно быть пустым")
        .min(0, "Значение должно быть больше 0")
        .max(65535, "Значение должно быть меньше 65535")
        .integer("Значение должно быть целым числом"),
});

export default inputSchema;
