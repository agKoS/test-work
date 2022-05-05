import { HTMLInputTypeAttribute } from "react";

interface InputInfo {
    readonly [key: string]: {
        readonly label: string;
        readonly id: string;
        readonly name: string;
        readonly type: HTMLInputTypeAttribute;
        readonly placeholder: string;
    };
}

export const inputInfoField: InputInfo = {
    name: {
        label: "Имя узла",
        id: "inputName",
        name: "name",
        type: "text",
        placeholder: "Введите имя узла",
    },
    ip: {
        label: "IP-адрес",
        id: "inputIp",
        name: "ip",
        type: "text",
        placeholder: "Введите IP-адрес",
    },
    port: {
        label: "Web-порт",
        id: "inputPort",
        name: "port",
        type: "text",
        placeholder: "Введите номер web-порта",
    },
};
