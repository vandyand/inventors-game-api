const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM gametypes");
    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM gametypes where id = ${req.params.id}`
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});
