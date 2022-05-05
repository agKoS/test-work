const keys = require("./keys");
const queries = require("./queries");
const createNodeQuery = require("./lib/createNodeQuery");
const createNodeCountQuery = require("./lib/createNodeCountQuery");

const Pool = require("pg").Pool;
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
});

/**
 ** Сallback для получение узлов в зависимости от параметров
 ** или всех узлов
 *
 * @param {Request} req
 * @param {Response} res
 */
const getAllNodes = async (req, res) => {
    const { size, page } = req.query;
    const querySelectNodes = createNodeQuery(req.query);
    const { rows: selectedNodes } = await pgClient.query(querySelectNodes);
    let totalCount;
    if (!(size || page)) {
        totalCount = selectedNodes.length;
    } else {
        const queryCountNodes = createNodeCountQuery(req.query);
        const resultCount = await pgClient.query(queryCountNodes);
        totalCount = resultCount.rows[0].count;
    }
    res.json({ totalCount, selectedNodes });
};

/**
 ** Callback для получение узлов, у которых parent_id IS NULL
 *
 * @param {Request} req
 * @param {Response} res
 */
const getFirstNodes = (req, res) => {
    pgClient.query(queries.GET_FIRST_NODES, (error, results) =>
        getChildsCallback(error, req, res, results)
    );
};

/**
 ** Callback для получение дочерних элементов первого уровня
 *
 * @param {Request} req
 * @param {Response} res
 * */
const getFirstLvlChildren = (req, res) => {
    const id = parseInt(req.params.id);

    pgClient.query(queries.GET_FIRST_CHILDS, [id], (error, results) =>
        getChildsCallback(error, req, res, results)
    );
};

/**
 ** Callback для обновления информации об узле
 *
 * @param {Request} req
 * @param {Response} res
 */
const updateNodeInfo = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, ip, port } = req.body.data;

    pgClient.query(
        queries.UPDATE_NODE,
        [name, ip, port, id],
        (error, results) => {
            if (error) {
                res.status("500").send();
            } else {
                res.status("200").json(results.rows[0]);
            }
        }
    );
};

/**
 ** Callback для создания нового узла
 *
 * @param {Request} req
 * @param {Response} res
 */
const createNode = (req, res) => {
    console.log(req.body);
    const { name, port, ip, parent_id } = req.body.data;
    console.log(name, port, ip, parent_id);
    pgClient
        .query(queries.CREATE_NODE, [parent_id, name, ip, port])
        .then((results) => {
            console.log(results.rows[0]);
            res.status("201").json(results.rows[0]);
        })
        .catch((error) => {
            res.status("500").send();
        });
};

/**
 ** Callback для удаления узлов
 *
 * @param {Request} req
 * @param {Response} res
 */
const deleteNodes = (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.body);

    pgClient.query(queries.DELETE_NODE, [id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send();
    });
};

//* Дополнительные функции

const getChildsCallback = (error, req, res, results) => {
    if (error) {
        throw error;
    }

    const firstNodes = results.rows;
    Promise.all(
        firstNodes.map((node) =>
            pgClient.query(queries.GET_FIRST_CHILDS_ID, [node.id])
        )
    )
        .then((result) => {
            for (let i = 0; i < firstNodes.length; i++) {
                firstNodes[i].children = [
                    ...result[i].rows.map((row) => row.id),
                ];
            }

            res.status(200).json(firstNodes);
        })
        .catch((error) => {
            res.status(500).send("Error");
        });
};

//* Экспорт

module.exports = {
    getAllNodes,
    getFirstLvlChildren,
    getFirstNodes,
    updateNodeInfo,
    createNode,
    deleteNodes,
};
