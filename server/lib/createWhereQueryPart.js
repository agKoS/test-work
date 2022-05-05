/**
 * Создает часть запроса WHERE для фильтрации значений по имени и порту
 *
 * @param {string} name
 * @param {number} port
 * @returns {string}
 */
const createWhereQueryPart = (name, port) => {
    const whereParams = [];

    if (name) {
        whereParams.push(`name LIKE '${name}%'`);
    }
    if (port) {
        whereParams.push(`port=${port}`);
    }

    whereQuery = ["WHERE", whereParams.join(" AND ")].join(" ");

    return whereQuery;
};

module.exports = createWhereQueryPart;
