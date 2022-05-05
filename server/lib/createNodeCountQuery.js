const createWhereQueryPart = require("./createWhereQueryPart");

const createNodeCountQuery = ({ name, port }) => {
    let selectQueryPart = `SELECT COUNT(*) FROM nodes`;
    let whereQueryPart = null;

    if (name || port) {
        whereQueryPart = createWhereQueryPart(name, port);
    }

    const completedQuery =
        [selectQueryPart, whereQueryPart]
            .filter((part) => part !== null)
            .join(" ") + ";";

    return completedQuery;
};

module.exports = createNodeCountQuery;
