import express = require("express");
import { awesome } from "./controllers/status";

// Our Express APP config
const app = express();
app.set("port", process.env.PORT || 3001);

// API Endpoints
app.get("/", (req, res) => {
  res.send("Hi");
});

app.post("/", awesome);

// export our app
export default app;
