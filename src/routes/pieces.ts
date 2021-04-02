const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/", (req, res) => {
  if (req.query.ids) {
    db.query(`SELECT * FROM pieces WHERE id in (${req.query.ids})`)
      .then((result) => res.send(result.rows))
      .catch((err) => console.log(err.message));
  } else {
    db.query(`SELECT * FROM pieces`)
      .then((result) => res.send(result.rows))
      .catch((err) => console.log(err.message));
  }
});

router.get("/:id", (req, res) => {
  db.query(`SELECT * FROM pieces where id = ${req.params.id}`)
    .then((result) => res.send(result.rows))
    .catch((err) => console.log(err.message));
});

router.get("/code/:code", (req, res) => {
  db.query(`SELECT * FROM pieces where code = '${req.params.code}'`)
    .then((result) => res.send(result.rows))
    .catch((err) => console.log(err.message));
});
