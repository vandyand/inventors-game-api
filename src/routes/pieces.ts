const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

const buildPiecesQuery = (condition = "") => {
  return `SELECT * FROM pieces
      INNER JOIN movement ON (pieces."movementId" = movement.id)
      LEFT OUTER JOIN promotion ON (pieces."promotionId" = promotion.id) ${condition}`;
};

router.get("/", (req, res) => {
  if (req.query.ids) {
    db.query(buildPiecesQuery(`WHERE id in (${req.query.ids})`))
      .then((result) => res.send(result.rows))
      .catch((err) => console.log(err.message));
  } else if (req.query.codes) {
    db.query(
      buildPiecesQuery(
        `WHERE code in (${req.query.codes
          .split(",")
          .map((x) => `'${x}'`)
          .join(",")})`
      )
    )
      .then((result) => res.send(result.rows))
      .catch((err) => console.log(err.message));
  } else {
    db.query(buildPiecesQuery())
      .then((result) => res.send(result.rows))
      .catch((err) => console.log(err.message));
  }
});

router.get("/:id", (req, res) => {
  db.query(buildPiecesQuery(`WHERE id = ${req.params.id}`))
    .then((result) => res.send(result.rows))
    .catch((err) => console.log(err.message));
});

router.get("/code/:code", (req, res) => {
  db.query(buildPiecesQuery(`WHERE code = '${req.params.code}'`))
    .then((result) => res.send(result.rows))
    .catch((err) => console.log(err.message));
});
