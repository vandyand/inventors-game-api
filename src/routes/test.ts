const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (req, res) => {
  function nestQuerySingle(query) {
    return `
    (SELECT row_to_json(x) FROM (${query}) x)
  `;
  }

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
      u.user_id AS id,
      u.display_name,
      
      ${nestQuery(
        `
          SELECT t.team_id AS id, t.display_name
          FROM user_teams ut
          JOIN teams t USING (team_id)
          WHERE ut.user_id = u.user_id
        `
      )} AS teams
    FROM users u
  `
    );

    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});

// ${nestQuerySingle(
//         `
//           SELECT m.user_id AS id, m.display_name
//           FROM users m WHERE m.user_id = u.manager_id
//         `
//       )} AS manager,
