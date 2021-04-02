const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM pieces");
    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM pieces where id = ${req.params.id}`
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});

router.get("/code/:code", (req, res) => {
  db.query(`SELECT * FROM pieces where code = '${req.params.code}'`)
    .then((result) => res.send(result.rows))
    .catch((err) => console.log(err.message));
});
