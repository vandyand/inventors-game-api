"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const status_1 = require("./controllers/status");
const boards = require("./routes/boards");
const pieces = require("./routes/pieces");
const gameTypes = require("./routes/gameTypes");
// Our Express APP config
const app = express();
app.use(cors());
app.use("/boards", boards);
app.use("/pieces", pieces);
app.use("/gameTypes", gameTypes);
app.set("port", process.env.PORT || 3001);
// API Endpoints
app.get("/", (req, res) => {
    res.send("Home");
});
app.post("/", status_1.awesome);
exports.default = app;
//# sourceMappingURL=app.js.map