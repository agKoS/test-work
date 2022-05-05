// Запрос на получение всех узлов
const GET_ALL_NODES = `
    SELECT * FROM nodes
    ORDER BY id;
`;

// Запрос на получение узлов, у которых parent_id IS NULL
const GET_FIRST_NODES = `
    SELECT * FROM nodes
    WHERE parent_id IS NULL;
`;

// Запрос на получение дочерних id
const GET_FIRST_CHILDS_ID = `
    SELECT id FROM nodes
    WHERE parent_id = $1;
`;

// Получение дочерних узлов первого уровня
const GET_FIRST_CHILDS = `
    SELECT * FROM nodes
    WHERE parent_id = $1;
`;

// Запрос на обновление информации об узле
const UPDATE_NODE = `
    UPDATE nodes
    SET name = $1, ip = $2, port = $3
    WHERE id = $4
    RETURNING *;
`;

// Запрос на создание нового узла
const CREATE_NODE = `
    INSERT INTO nodes (parent_id, name, ip, port) 
    VALUES ($1, $2, $3, $4)  
    RETURNING *;
`;

// Запрос на удаление нового узла
const DELETE_NODE = `
    DELETE FROM nodes
    WHERE id = $1
    RETURNING id;
`;

module.exports = {
    CREATE_NODE,
    GET_ALL_NODES,
    GET_FIRST_NODES,
    GET_FIRST_CHILDS_ID,
    GET_FIRST_CHILDS,
    UPDATE_NODE,
    DELETE_NODE,
};
