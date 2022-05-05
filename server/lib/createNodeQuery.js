const createWhereQueryPart = require("./createWhereQueryPart");

/**
 * Создание запроса для получения узлов по указанным параметрам
 *
 * @param {} param0
 * @returns {string}
 */
const createQuery = ({ name, port, size, page }) => {
    let selectQueryPart = `SELECT * FROM nodes`;
    let whereQueryPart = null;
    const queryOrder = `ORDER BY id`;
    let limitQueryPart = null;
    let offsetQueryPart = null;

    if (name || port) {
        whereQueryPart = createWhereQueryPart(name, port);
    }

    if (size) {
        limitQueryPart = `LIMIT ${size}`;

        if (page) {
            offsetQueryPart = `OFFSET ${(page - 1) * size}`;
        }
    }

    //* Составляем запрос
    const completedQuery =
        [
            selectQueryPart,
            whereQueryPart,
            queryOrder,
            limitQueryPart,
            offsetQueryPart,
        ]
            .filter((part) => part !== null)
            .join(" ") + ";";

    return completedQuery;
};

module.exports = createQuery;
