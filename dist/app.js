"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const status_1 = require("./controllers/status");
// Our Express APP config
const app = express();
app.set("port", process.env.PORT || 3001);
// API Endpoints
app.get("/", (req, res) => {
    res.send("Hi");
});
app.post("/", status_1.awesome);
// export our app
exports.default = app;
//# sourceMappingURL=app.js.map