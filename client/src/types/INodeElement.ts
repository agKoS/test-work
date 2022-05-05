export interface INodeElement {
    id: number; // ID-узла
    parent_id: number | null; // id родительского узла
    name: string; // Имя узла
    ip: string; // IP-адрес узла
    port: number; // Порт узла
    loadChildren: boolean; // Загружены ли дочерние узлы
    children: number[]; // Массив id дочерних узлов
    childNodes?: INodeElement[];
    isOpen: boolean; // Открыт ли узел
}

export type NodesResponse = Pick<
    INodeElement,
    "id" | "name" | "ip" | "port" | "parent_id"
>;

export type NodesInfo = Omit<NodesResponse, "parent_id">;
// export type TableData = Pick<INodeElement, "">;
