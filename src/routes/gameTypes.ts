const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

const buildGameTypeQuery = (condition: string = "") => {
  return `SELECT * FROM "gameTypes" gt 
INNER JOIN "startingPositionsMap" spm ON (spm."gameTypeId" = gt.id) 
INNER JOIN "startingPositions" sp ON (spm."startingPositionId" = sp.id)
INNER JOIN "boundingBox" bb ON (sp."boundingBoxId" = bb.id) ${condition}`;
};

// router.get("/", (req, res) => {
//   if (req.query.ids) {
//     db.query(buildGameTypeQuery(`WHERE id in (${req.query.ids})`))
//       .then((result) => res.send(result.rows))
//       .catch((err) => console.log(err.message));
//   } else {
//     db.query(buildGameTypeQuery())
//       .then((result) => res.send(result.rows))
//       .catch((err) => console.log(err.message));
//   }
// });

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM "gameTypes" where id = ${req.params.id}`
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});

router.get("/", async (req, res) => {
  function nestQuery(query) {
    return `
    coalesce(
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (${query}) x
      ),
      '[]'
    )
  `;
  }

  try {
    const { rows } = await db.query(
      `
    SELECT
      gt.id AS id,
      gt.name,

      ${nestQuery(
        `
          SELECT gt.id, gt.name
          FROM  "startingPositionsMap" spm
          JOIN "startingPositions" sp on (sp.id = spm."startingPositionId")
          WHERE spm.id = gt.id
        `
      )} AS "startingPositionsMap"
    FROM "gameTypes" gt
  `
    );

    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});
