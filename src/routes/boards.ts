const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM boards");
    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM boards where id = ${req.params.id}`
    );
    res.send(rows[0]);
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const query = `INSERT INTO boards(name, description, grid_type_id, board_shape, size, rotation) values('${
      req.body.name || "null"
    }','${req.body.description || "null"}',${
      req.body.grid_type_id || "null"
    },'${req.body.board_shape || "null"}','{${req.body.size || "null"}}',${
      req.body.rotation || "null"
    })`;
    await db.query(query);
    res.send(req.body);
  } catch (e) {
    console.log(e);
  }
});
