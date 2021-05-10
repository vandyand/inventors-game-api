import express = require("express");
const cors = require("cors");
import { awesome } from "./controllers/status";
const boards = require("./routes/boards");
const pieces = require("./routes/pieces");
const gameTypes = require("./routes/gameTypes");
const test = require("./routes/test");

// Our Express APP config
const app = express();

app.use(express.json());
app.use(cors());

app.use("/boards", boards);
app.use("/pieces", pieces);
app.use("/gameTypes", gameTypes);
app.use("/test", test);

app.set("port", process.env.PORT || 3001);

// API Endpoints
app.get("/", (req, res) => {
  res.send("Home");
});

app.post("/", awesome);

export default app;
