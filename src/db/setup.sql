create table boards(
	id bigserial primary key,
	name text,
	code text,
	grid_type text,
	board_shape text,
	size numeric []
);



insert into
	boards(id, name, code, grid_type, board_shape, size)
values
	(
		1,
		'chess board',
		'chess',
		'squares',
		'square',
		'{8,8}'
	);



create table movement (
	id bigserial primary key,
	name text,
	moves text [],
	attack_same_as_move boolean,
	attack_moves text [],
	can_jump boolean
);



insert into
	movement(
		id,
		name,
		moves,
		attack_same_as_move,
		attack_moves,
		can_jump
	)
values
	(
		1,
		'king',
		'{"fl","f","fr","l","r","bl","b","br"}',
		true,
		'{}',
		false
	),
	(
		2,
		'queen',
		'{"fl+","f+","fr+","l+","r+","bl+","b+","br+"}',
		true,
		'{}',
		false
	),
	(
		3,
		'rook',
		'{"f+","l+","r+","b+"}',
		true,
		'{}',
		false
	),
	(
		4,
		'bishop',
		'{"fl+", "fr+", "bl+", "br+"}',
		true,
		'{}',
		false
	),
	(
		5,
		'knight',
		'{"ffl","ffr","fll","frr","bll","brr","bbl","bbr"}',
		true,
		'{}',
		true
	),
	(6, 'pawn', '{"f"}', false, '{"fl", "fr"}', false),
	(
		7,
		'first move pawn',
		'{"f", "ff"}',
		false,
		'{"fl", "fr"}',
		false
	),
	(
		8,
		'super pawn',
		'{"fl","f","ff","fr"}',
		true,
		'{}',
		false
	);



create table promotion (
	id bigserial primary key,
	promoted_to_piece integer,
	promotion_condition text,
	promotion_condition_code text
);



insert into
	promotion(
		id,
		promoted_to_piece,
		promotion_condition,
		promotion_condition_code
	)
values
	(1, 2, 'last row', 'lr'),
	(2, 6, 'not first move', 'nfm');



create table pieces (
	id bigserial primary key,
	name text,
	code text unique,
	img text,
	movement_id integer references movement(id),
	promotion_id integer references promotion(id),
	strength numeric
);



insert into
	pieces(
		id,
		name,
		code,
		img,
		movement_id,
		promotion_id,
		strength
	)
values
	(1, 'king', 'k', 'king', 1, null, 0),
	(2, 'queen', 'q', 'queen', 2, null, 0),
	(3, 'rook', 'r', 'rook', 3, null, 0),
	(4, 'bishop', 'b', 'bishop', 4, null, 0),
	(5, 'knight', 'n', 'knight', 5, null, 0),
	(6, 'pawn', 'p', 'pawn', 6, 1, 0),
	(7, 'first move pawn', 'fmp', 'pawn', 7, 2, 0),
	(8, 'super pawn', 'sp', 'pawn', 8, 1, 0);



alter table
	promotion
add
	constraint promotion_pieces_fkey foreign key (promoted_to_piece) references pieces(id);



--alter table pieces
--alter column code set data type piece_code using code::piece_code;
create table bounding_box (id serial primary key, bounding_box integer []);



insert into
	bounding_box (bounding_box)
values
	('{8,2}'),
	('{4,2}');



create table starting_positions (
	id bigserial primary key,
	bounding_box_id integer references bounding_box(id),
	piece_code text references pieces(code),
	spaces integer []
);



insert into
	starting_positions (bounding_box_id, piece_code, spaces)
values
	(1, 'p', '{1,2,3,4,5,6,7,8}'),
	(1, 'r', '{9,16}'),
	(1, 'n', '{10,15}'),
	(1, 'b', '{11,14}'),
	(1, 'q', '{12}'),
	(1, 'k', '{13}'),
	(1, 'q', '{13}'),
	(1, 'k', '{12}'),
	(2, 'n', '{1,2,3,4}'),
	(2, 'k', '{6,7}'),
	(2, 'b', '{1,4}'),
	(2, 'r', '{2}'),
	(2, 'q', '{3}');



create table starting_positions_map (
	id bigserial primary key,
	game_type_id integer,
	teams integer [],
	starting_position_id integer references starting_positions(id)
);



insert into
	starting_positions_map (game_type_id, teams, starting_position_id)
values
	(1, '{1,2}', 1),
	(1, '{1,2}', 2),
	(1, '{1,2}', 3),
	(1, '{1,2}', 4),
	(1, '{1}', 5),
	(1, '{1}', 6),
	(1, '{2}', 7),
	(1, '{2}', 8),
	(2, '{1,2}', 9),
	(2, '{1,2}', 10),
	(3, '{1,2}', 10),
	(3, '{1,2}', 11),
	(3, '{1,2}', 12),
	(3, '{1,2}', 13);



create table game_types (
	id bigserial primary key,
	name text,
	code text unique,
	board_id integer references boards(id),
	starting_piece_positions_map integer,
	win_condition text
);



insert into
	game_types (
		name,
		code,
		board_id,
		starting_piece_positions_map,
		win_condition
	)
values
	('chess', 'chess', 1, 1, 'k'),
	(
		'knight and king mayhem',
		'kn',
		1,
		2,
		'annihilation'
	),
	(
		'king queen rook bishop fun',
		'kqrb',
		1,
		3,
		'annihilation'
	);



alter table
	starting_positions_map
add
	constraint starting_positions_map_game_types_fkey foreign key (game_type_id) references game_types(id);



--select * from pieces where id in (1,2);
--select * from pieces where code in ('q','r');
--select * from boards
--select * from pieces inner join movement on (pieces.movement_id = movement.id) left outer join promotion on (pieces.promotion_id = promotion.id)
select
	*
from
	game_types gt
	inner join starting_positions_map spm on (spm.game_type_id = gt.id)
	inner join starting_positions sp on (spm.starting_position_id = sp.id)
	inner join bounding_box bb on (sp.bounding_box_id = bb.id)
where
	code = 'chess'
SELECT
	gt.id,
	gt.name,
	coalesce(
		(
			SELECT
				array_to_json(array_agg(to_json(x)))
			FROM
				(
					SELECT
						*
					FROM
						starting_positions_map spm
						JOIN starting_positions sp on (sp.id = spm.starting_position_id)
					WHERE
						spm.id = gt.id
				) x
		),
		'[]'
	) AS starting_positions_map
FROM
	game_types gt
select
	array_to_json(array_agg(gt.name))
from
	game_types gt
select
	jsonb_build_array(gt)
from
	game_types gt
select
	to_jsonb(gt)
from
	game_types gt
select
	array_agg(to_jsonb(spm))
from
	starting_positions_map spm
where
	spm.game_type_id = 1
select
	game_type_id,
	array_agg(starting_position_id) as sp
from
	starting_positions_map spm
where
	game_type_id = 1
group by
	game_type_id
select
	*
from
	starting_positions_map spm;



select
	*
from
	starting_positions sp;



select
	*
from
	starting_positions_map spm
	join starting_positions sp on (spm.starting_position_id = sp.id)
where
	game_type_id = 1
select
	x.game_type_id,
	array_agg(x.piece_code_spaces) as piece_code_spaces,
	x.bounding_box_id
from
	(
		select
			game_type_id,
			array [unnest(array_agg(to_jsonB(piece_code))),unnest(array_agg(to_jsonb(spaces)))] as piece_code_spaces
		from
			starting_positions_map spm
			join starting_positions sp on (spm.starting_position_id = sp.id) --where game_type_id = 1
		group by
			game_type_id
	) x
group by
	x.game_type_id
select
	game_type_id,
	array [unnest(array_agg(to_jsonB(piece_code))),unnest(array_agg(to_jsonb(spaces)))] as piece_code_spaces,
	array_agg(bounding_box_id) as bounding_box_id
from
	starting_positions_map spm
	join starting_positions sp on (spm.starting_position_id = sp.id)
where
	game_type_id = 1
group by
	game_type_id drop table boards cascade;



drop table game_types cascade;



drop table movement cascade;



drop table pieces cascade;



drop table promotion cascade;



drop table starting_positions cascade;



drop table starting_positions_map cascade;



drop table bounding_box cascade;