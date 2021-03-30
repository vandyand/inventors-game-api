"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// import mountRoutes from "./routes";
const status_1 = require("./controllers/status");
// import { getBoards } from "./db/queries";
const boards = require("./routes/boards");
// Our Express APP config
const app = express();
// mountRoutes(app);
app.use("/boards", boards);
app.set("port", process.env.PORT || 3001);
// API Endpoints
app.get("/", (req, res) => {
    res.send("Hi");
});
app.post("/", status_1.awesome);
// app.get("/boards", (req, res) => {
//   getBoards().then((boards) => {
//     res.send(boards);
//   });
// });
// app.use("/boards", boards);
// export our app
exports.default = app;
//# sourceMappingURL=app.js.map