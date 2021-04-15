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
