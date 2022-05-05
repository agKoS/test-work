const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./callbacks");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hi");
});

/**
 * Endpoint для получения всех узлы
 */
app.get("/nodes", db.getAllNodes);
// app.get("/nodes", db.getAllNodes);

/**
 * Endpoint для получения дочерних узлов первого уровня
 */
app.get("/nodes/:id/children", db.getFirstLvlChildren);

/**
 * Enopoint для получения самых первых узлов
 */
app.get("/nodes/first", db.getFirstNodes);

/**
 * Endpoint для обновления узла
 */
app.put("/nodes/:id", db.updateNodeInfo);

/**
 * Endpoint для добавления нового узла
 */
app.post("/nodes", db.createNode);

/**
 * Endpoint для удаления узла
 */
app.delete("/nodes/:id", db.deleteNodes);

app.listen(PORT, () => {
    console.log(`App.running on port ${PORT}`);
});
