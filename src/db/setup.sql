

create table grid_types (
	id bigserial primary key,
	name text,
	iuc_notation text
);
insert into grid_types(name, iuc_notation)
values
('chess grid', 'p4m')

create table boards(
	id bigserial primary key,
	name text,
	description text,
	grid_type_id integer references grid_types(id),
	board_shape text,
	size numeric [],
	rotation numeric
);
insert into
	boards(name, description, grid_type_id, board_shape, size, rotation)
values
('chess','square 8x8 chess board',1,'square','{8,8}',0);



create table movement (
	id bigserial primary key,
	name text,
	description text,
	moves text [],
	attack_same_as_move boolean,
	attack_moves text [],
	can_jump boolean
);
insert into movement(name,moves,attack_same_as_move,attack_moves,can_jump)
values
	('king','{"fl","f","fr","l","r","bl","b","br"}',true,'{}',false),
	('queen','{"fl+","f+","fr+","l+","r+","bl+","b+","br+"}',true,'{}',false),
	('rook','{"f+","l+","r+","b+"}',true,'{}',false),
	('bishop','{"fl+", "fr+", "bl+", "br+"}',true,'{}',false),
	('knight','{"ffl","ffr","fll","frr","bll","brr","bbl","bbr"}',true,'{}',true),
	('pawn', '{"f"}', false, '{"fl", "fr"}', false),
	('first move pawn','{"f", "ff"}',false,'{"fl", "fr"}',false),
	('super pawn','{"fl","f","ff","fr"}',true,'{}',false);



create table promotion (
	id bigserial primary key,
	promote_to_piece integer,
	promotion_condition text,
	promotion_condition_code text
);
insert into promotion(id,promote_to_piece,promotion_condition,promotion_condition_code)
values
	(1, 2, 'last row', 'lr'),
	(2, 6, 'not first move', 'nfm');



create table pieces (
	id bigserial primary key,
	name text,
	description text,
	code text unique,
	img text,
	movement_id integer references movement(id),
	promotion_id integer references promotion(id),
	strength numeric
);
insert into pieces(id,name,code,img,movement_id,promotion_id,strength)
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
	constraint promotion_pieces_fkey foreign key (promote_to_piece) references pieces(id);



--alter table pieces
--alter column code set data type piece_code using code::piece_code;
create table bounding_box (id serial primary key, box integer []);
insert into
	bounding_box (box)
values
	('{8,2}'),
	('{4,2}');



create table piece_arrangement_parts (
	id bigserial primary key,
	piece_code text references pieces(code),
	locations integer []
);
insert into piece_arrangement_parts (piece_code, locations)
values
	('p', '{1,2,3,4,5,6,7,8}'),
	('r', '{9,16}'),
	('n', '{10,15}'),
	('b', '{11,14}'),
	('q', '{12}'),
	('k', '{13}'),
	('q', '{13}'),
	('k', '{12}'),
	('n', '{1,2,3,4}'),
	('k', '{6,7}'),
	('b', '{1,4}'),
	('r', '{2}'),
	('q', '{3}');


create table piece_arrangements (
	id bigserial primary key,
	arrangement_num integer,
	piece_arrangement_part_id bigint references piece_arrangement_parts(id)
);
insert into piece_arrangements (arrangement_num, piece_arrangement_part_id)
values
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 7),
(2, 8),
(3, 9),
(3, 10),
(4, 10),
(4, 11),
(4, 12),
(4, 13);



create table game_type_piece_arrangement (
	id bigserial primary key,
	game_type_id integer,
	player integer,
	piece_arrangement_num integer
);
insert into
	game_type_piece_arrangement (game_type_id, player, piece_arrangement_num)
values
	(1, 1, 1),
	(1, 2, 2),
	(2, 1, 3),
	(2, 2, 3),
	(3, 1, 4),
	(3, 2, 4);


create table game_rules (
	id bigserial primary key,
	win_condition text
);
insert into game_rules (win_condition)
values
('kill piece: k'),
('annihilation');



create table game_types (
	id bigserial primary key,
	name text unique,
	code text unique,
	description text,
	board_id integer references boards(id),
	game_type_piece_arrangement integer,
	piece_arrangement_bounding_box integer references bounding_box(id),
	game_rules_id integer references game_rules(id),
	info text
);
insert into game_types (name,code,board_id,game_type_piece_arrangement,piece_arrangement_bounding_box,game_rules_id)
values
	('chess', 'chess', 1, 1, 1, 1),
	('knight and king mayhem','kn',1,2,2,2),
	('king queen rook bishop fun','kqrb',1,3,2,2);



alter table
	game_type_piece_arrangement
add
	constraint game_type_piece_arrangement_game_types_fkey foreign key (game_type_id) references game_types(id);



--select * from pieces where id in (1,2);
--select * from pieces where code in ('q','r');
--select * from boards
--select * from pieces inner join movement on (pieces.movement_id = movement.id) left outer join promotion on (pieces.promotion_id = promotion.id)


select
	*
from
	game_types gt
	inner join game_type_piece_arrangement gtpa on (gtpa.game_type_id = gt.id)
	inner join piece_arrangements pa on (gtpa.piece_arrangement_num = pa.arrangement_num)
	inner join piece_arrangement_parts pap on (pa.piece_arrangement_part_id = pap.id)
	inner join boards b on (b.id = gt.board_id)
where
	code = 'chess';

CREATE EXTENSION IF NOT EXISTS tablefunc;



select gt.id as game_type_id, bb.box as piece_reference_box, b.size as board_size, array_agg(json_build_object('player',player, 'pieces', pieces)) as player_pieces

--select *
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
--where gt.id = 1

group by gt.id, bb.box, b.size




select * from game_types gt
join boards b on (b.id = gt.board_id)









select * from game_type_piece_arrangement 
select * from piece_arrangements 

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
						game_type_piece_arrangement gtpa
						JOIN piece_arrangements pa on (pa.arrangement_num = gtpa.piece_arrangement_num)
				--	WHERE
				--		spm.id = gt.id
				) x
		),
		'[]'
	) AS game_type_piece_arrangement
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
	*
from
	game_types gt
	
	
	
select
	array_agg(to_jsonb(spm))
from
	game_type_piece_arrangement spm
where
	spm.game_type_id = 1
	
	
	
select
	game_type_id,
	array_agg(piece_arrangement_part_id) as sp
from
	game_type_piece_arrangement spm
where
	game_type_id = 1
group by
	game_type_id
	
	
	
select
	*
from
	game_type_piece_arrangement spm;



select
	*
from
	piece_arrangement_parts sp;



select
	*
from
	game_type_piece_arrangement spm
	join piece_arrangement_parts sp on (spm.piece_arrangement_part_id = sp.id)
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
			game_type_piece_arrangement spm
			join piece_arrangement_parts sp on (spm.piece_arrangement_part_id = sp.id) --where game_type_id = 1
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
	game_type_piece_arrangement spm
	join piece_arrangement_parts sp on (spm.piece_arrangement_part_id = sp.id)
where
	game_type_id = 1
group by
	game_type_id drop table boards cascade;


drop table grid_types cascade;
drop table boards cascade;
drop table game_rules cascade;
drop table game_types cascade;
drop table movement cascade;
drop table pieces cascade;
drop table promotion cascade;
drop table piece_arrangement_parts cascade;
drop table piece_arrangements cascade;
drop table game_type_piece_arrangement cascade;
drop table bounding_box cascade;