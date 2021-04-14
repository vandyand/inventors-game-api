const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

const buildRawGameTypeQuery = (condition: string = "") => {
  return `SELECT * FROM
	game_types gt
	INNER JOIN game_type_piece_arrangement gtpa ON (gtpa.game_type_id = gt.id)
	INNER JOIN piece_arrangements pa ON (gtpa.piece_arrangement_num = pa.arrangement_num)
	INNER JOIN piece_arrangement_parts pap ON (pa.piece_arrangement_part_id = pap.id)
	INNER JOIN boards b ON (b.id = gt.board_id) ${condition}`;
};

const buildNestedGameTypeQuery = (condition: string = "") => {
  return `select gt.id as game_type_id, bb.box as piece_reference_box, b.size as board_size, array_agg(json_build_object('player',player, 'pieces', pieces)) as player_pieces
from game_types gt
inner join game_type_piece_arrangement gtpa on (gtpa.game_type_id = gt.id)
inner join 
(

select arrangement_num, array_agg(jsonb_build_object('piece_code',piece_code, 'locations', locations)) as pieces
from piece_arrangements pa
inner join piece_arrangement_parts pap on (pa.piece_arrangement_part_id = pap.id)
group by pa.arrangement_num

) x on (x.arrangement_num = gtpa.piece_arrangement_num)

join bounding_box bb on (piece_arrangement_bounding_box = bb.id)
join boards b on (b.id = gt.board_id)
${condition}
group by gt.id, bb.box, b.size`;
};

const buildNestedGameTypeQueryById = (id: number) => {
  return buildNestedGameTypeQuery(`where gt.id = ${id}`);
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
      buildNestedGameTypeQueryById(req.params.id)
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
  }
});

// router.get("/", (req, res) => {
//   if(req.query.id)
// });

router.get("/raw", (req, res) => {
  db.query(buildRawGameTypeQuery());
});
