import express = require("express");
// import mountRoutes from "./routes";
import { awesome } from "./controllers/status";
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

app.post("/", awesome);

// app.get("/boards", (req, res) => {
//   getBoards().then((boards) => {
//     res.send(boards);
//   });
// });

// app.use("/boards", boards);

// export our app
export default app;
