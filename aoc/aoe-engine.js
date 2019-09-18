// Adventures Of Engine main processes

aoe.engine = {};

// Global people and object references

var CHRIS;
var MR_F;
var VICKI;
var SAM;
var MRS_J;
var E8_TO_HUT_ENTRANCE_DOOR;
var HUT_ENTRANCE_TO_E8_DOOR;
var MR_F_DOCKING_STATION_E8;
var MR_F_DOCKING_STATION_N2;
var MR_F_DESK;
var MRS_J_DESK;
var SEWING_MACHINE_DESK;
var N2_STORE_ROOM_BOXES;

aoe.engine.setup_game_data = function (restart) {

	aoe.engine.screens.e8 = new Screen("e8", aoe.images.e8_bg, 16, 13, 32, 32);
	aoe.engine.screens.hut_entrance = new Screen("hut_entrance", aoe.images.hut_entrance_bg, 10, 9, 80, 48);
	aoe.engine.screens.n2 = new Screen("n2", aoe.images.n2_bg, 16, 13, 32, 32);
	aoe.engine.screens.e8_store_room = new Screen("e8_store_room", aoe.images.e8_store_room_bg, 6, 5, 112, 80);
	aoe.engine.screens.n2_store_room = new Screen("n2_store_room", aoe.images.n2_store_room_bg, 6, 5, 112, 80);
	aoe.engine.screens.l5 = new Screen("l5", aoe.images.l5_bg, 16, 13, 32, 32);	
	
	aoe.engine.set_screen("e8");
		
	// Helper functions
	const interaction_point_at = function (x, y, w, h, s, k, vals) {
		vals.grid_x = x;
		vals.grid_y = y;
		vals.grid_w = w;
		vals.grid_h = h;
		vals.interaction_key = k;
		vals.renders = false;
		vals.does_anything = false;
		vals.screen_ref = s;
		return aoe.engine.add_ob(new Ob(vals)).move_to(x, y, s);
	};
	
	const desk_at = function (orientation, x, y, s) {return aoe.engine.add_ob(new Desk(orientation, {grid_x: x, grid_y: y, screen_ref: s}));};
	const chair_at = function (facing, colour, x, y, s) {return aoe.engine.add_ob(new Chair(facing, colour, {grid_x: x, grid_y: y, screen_ref: s}));};
	const wall_at = function (x, y, w, h, s) {return aoe.engine.add_ob(new Wall(x, y, w, h, s, {}));};
	const door_at = function (x, y, s, xx, yy, ss) {return aoe.engine.add_ob(new Door(x, y, s, xx, yy, ss, {}));};
		
	const outer_walls = function (sr) {
		const s = aoe.engine.screens[sr];
		const w = s.grid_width;
		const h = s.grid_height;
		
		wall_at(0, 0, 1, h, sr);
		wall_at(0, 0, w, 1, sr);
		wall_at(0, h - 1, w, 1, sr);
		wall_at(w - 1, 0, 1, h, sr);
	}
		
	// EEEEE  88888
	// E      8   8
	// EEEEE  88888
	// E      8   8
	// EEEEE  88888
	
	outer_walls("e8");
	
	aoe.engine.screens.e8.all_vertical_desks = [];
	aoe.engine.screens.e8.all_right_chairs = [];
	
	[2, 4, 6, 8, 10].forEach((x) => {
		[2, 3, 6, 7, 10, 11].forEach((y) => {
			aoe.engine.screens.e8.all_right_chairs.push(chair_at("r", "red", x, y, "e8"));
		});
		[2, 6, 10].forEach((y) => {
			aoe.engine.screens.e8.all_vertical_desks.push(desk_at("v", x, y, "e8"));
		});
	});

	aoe.engine.screens.e8.mr_f_chair = chair_at("l", "teal", 12, 6, "e8");
	
	MR_F_DESK = desk_at("v", 12, 6, "e8");
	aoe.engine.screens.e8.all_vertical_desks.push(MR_F_DESK);
	MR_F_DESK.is_mr_f_desk = true;
	MR_F_DESK.img = aoe.images["desk_v_mr_f"];
	
	interaction_point_at(12, 7, 1, 1, "e8", "e8_thermos", {});
	interaction_point_at(12, 6, 1, 1, "e8", "e8_homework_pile", {});
	
	interaction_point_at(0, 9, 1, 2, "e8", "e8_boards_bottom", {});
	interaction_point_at(0, 6, 1, 2, "e8", "e8_boards_middle", {});
	interaction_point_at(0, 3, 1, 2, "e8", "e8_boards_top", {});
	
	[2, 3, 4, 6, 7, 8, 10, 11, 12].forEach((x) => {
		interaction_point_at(x, 0, 1, 1, "e8", "e8_window", {});
	});
	
	interaction_point_at(15, 9, 1, 1, "e8", "e8_poster", {});
	interaction_point_at(15, 5, 1, 3, "e8", "e8_blackboard", {});	
	
	MR_F_DOCKING_STATION_E8 = (aoe.engine.add_ob(new Mr_F_Docking_Station(13, 6, "e8")));	
	
	E8_TO_HUT_ENTRANCE_DOOR = door_at(15, 10, "e8", 1, 6, "hut_entrance");
	door_at(15, 2, "e8", 1, 2, "e8_store_room").is_door_to_e8_store_room = true;
	
	// E8 store room
	
	outer_walls("e8_store_room");
	
	aoe.engine.add_ob(new Ob({grid_x: 3, grid_y: 3, grid_w: 2, grid_h: 1, display_w: 32, display_h: 32, img: aoe.images["box"], interaction_key: "e8_store_room_box"})).move_to(3, 3, "e8_store_room");

	interaction_point_at(1, 0, 1, 1, "e8_store_room", "e8_store_room_paper", {});
	interaction_point_at(2, 0, 1, 1, "e8_store_room", "e8_store_room_pens", {});
	
	aoe.engine.add_ob(new Ob({grid_x: 3, grid_y: 0, grid_w: 1, grid_h: 1, display_w: 16, display_h: 32, img: aoe.images["books_left"], interaction_key: "e8_store_room_books_left"})).move_to(3, 0, "e8_store_room");
	
	aoe.engine.add_ob(new Ob({grid_x: 4, grid_y: 0, grid_w: 1, grid_h: 1, display_w: 16, display_h: 32, img: aoe.images["books_right"], interaction_key: "e8_store_room_books_right"})).move_to(4, 0, "e8_store_room");
	
	door_at(0, 2, "e8_store_room", 14, 2, "e8");
	door_at(5, 2, "e8_store_room", 1, 2, "n2_store_room");
	
	
	// H   H  U   U  TTTTT         EEEEE  N   N  TTTTT  RRRRR  AAAAA  N   N  CCCCC  EEEEE
	// H   H  U   U    T           E      NN  N    T    R   R  A   A  NN  N  C      E
	// HHHHH  U   U    T           EEEEE  N N N    T    RRRRR  AAAAA  N N N  C      EEEEE
	// H   H  U   U    T           E      N  NN    T    RRR    A   A  N  NN  C      E
	// H   H  UUUUU    T           EEEEE  N   N    T    R  RR  A   A  N   N  CCCCC  EEEEE
	
	outer_walls("hut_entrance");
	
	interaction_point_at(4, 8, 2, 1, "hut_entrance", "huts_main_exit", {});
	interaction_point_at(3, 0, 1, 1, "hut_entrance", "hut_entrance_coat", {});
	
	HUT_ENTRANCE_TO_E8_DOOR = door_at(0, 6, "hut_entrance", 14, 10, "e8");
	
	HUT_ENTRANCE_TO_E8_DOOR.is_door_to_e8 = true;
	door_at(9, 6, "hut_entrance", 1, 10, "n2");
	
	// N   N  22222
	// NN  N      2
	// N N N    222
	// N  NN  22
	// N   N  22222
	
	outer_walls("n2");
	
	[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach((x) => {
		chair_at("d", "red", x, 3, "n2");
	});
	
	[4, 5, 6, 7, 8, 9].forEach((y) => {
		chair_at("l", "red", 13, y, "n2");
	});
	
	[4, 6, 8, 10, 12].forEach((x) => {
		[3, 10].forEach((y) => {
			if (!(x === 10 && y === 3)) {
				desk_at("h", x, y, "n2");
			}
		});
	});
	
	SEWING_MACHINE_DESK = desk_at("h", 10, 3, "n2");
	aoe.engine.screens.e8.all_vertical_desks.push(SEWING_MACHINE_DESK);
	SEWING_MACHINE_DESK.is_sewing_machine_desk = true;
	SEWING_MACHINE_DESK.img = aoe.images["desk_h_sewing_machine"];
	
	interaction_point_at(11, 3, 1, 1, "n2", "sewing_machine", {});
	interaction_point_at(0, 5, 1, 4, "n2", "n2_blackboard", {});
	
	[4, 6, 8].forEach((y) => {
		desk_at("v", 13, y, "n2");
	});
	
	desk_at("v", 3, 6, "n2");
	
	[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach((x) => {
		chair_at("u", "red", x, 10, "n2");
	});
	
	[3, 4, 5, 7, 8, 9, 11, 12, 13].forEach((x) => {
		interaction_point_at(x, 0, 1, 1, "n2", "e8_window", {});
	});	
	
	MR_F_DOCKING_STATION_N2 = (aoe.engine.add_ob(new Mr_F_Docking_Station(2, 6, "n2")));
	
	door_at(0, 10, "n2", 8, 6, "hut_entrance");
	door_at(0, 2, "n2", 4, 2, "n2_store_room");
	
	// N2 store room
	
	outer_walls("n2_store_room");
	
	door_at(5, 2, "n2_store_room", 1, 2, "n2");
	door_at(0, 2, "n2_store_room", 4, 2, "e8_store_room");
	
	N2_STORE_ROOM_BOXES = new Ob({grid_x: 1, grid_y: 3, grid_w: 4, grid_h: 1, display_w: 64, display_h: 62, img: aoe.images["n2_store_room_boxes"], interaction_key: "n2_store_room_boxes"});
	aoe.engine.add_ob(N2_STORE_ROOM_BOXES).move_to(1, 3, "n2_store_room");	
	
	interaction_point_at(1, 1, 4, 1, "n2_store_room", "n2_store_room_boxes", {});
	
	interaction_point_at(2, 3, 1, 1, "n2_store_room", "n2_store_room_thread", {});
	
	// L      5555
	// L      5
	// L      5555
	// L          5
	// LLLLL  5555
	
	outer_walls("l5");
	
	[2, 4, 6, 8, 10].forEach((x) => {
		[2, 3, 6, 7, 10, 11].forEach((y) => {
			if (!(x === 10 && (y === 6 || y ===7))) {
				aoe.engine.screens.e8.all_right_chairs.push(chair_at("r", "red", x, y, "l5"));
			}
		});
		[2, 6, 10].forEach((y) => {
			if (!(x === 10 && y === 6)) {
				aoe.engine.screens.e8.all_vertical_desks.push(desk_at("v", x, y, "l5"));
			}
		});
	});
	
	MRS_J_DESK = desk_at("v", 12, 6, "l5");
	MRS_J_DESK.is_mrs_j_desk = true;
	MRS_J_DESK.img = aoe.images["desk_v_mrs_j"];
	
	interaction_point_at(15, 10, 1, 1, "l5", "l5_door", {});	
	interaction_point_at(0, 2, 1, 9, "l5", "e8_window", {});
	
	interaction_point_at(2, 0, 2, 1, "l5", "l5_boards_1", {});
	interaction_point_at(5, 0, 2, 1, "l5", "l5_boards_2", {});
	interaction_point_at(9, 0, 2, 1, "l5", "l5_boards_3", {});
	interaction_point_at(12, 0, 2, 1, "l5", "l5_boards_4", {});
	
	interaction_point_at(12, 7, 1, 1, "l5", "l5_tape_recorder", {});
	interaction_point_at(15, 6, 1, 1, "l5", "l5_plug_socket", {});

	// PPPPP  EEEEE  OOOOO  PPPPP  L      EEEEE
	// P   P  E      O   O  P   P  L      E
	// PPPPP  EEEEE  O   O  PPPPP  L      EEEEE
	// P      E      O   O  P      L      E
	// P      EEEEE  OOOOO  P      LLLLL  EEEEE

	CHRIS = aoe.engine.add_ob(new Person("chris", {
		display_x: 16, 
		display_y: 16, 
		display_w: 16, 
		display_h: 32,
		grid_x: 9,
		grid_y: 3,
		screen_ref: "e8",
		grid_w: 1,
		grid_h: 1,
		display_name: "Chris",		
		is_player_controlled: true,
		}));
		
	CHRIS.images.r_kicking = aoe.images.chris_r_kicking;
	CHRIS.images.d_with_book = aoe.images.chris_d_with_book;
		
	MR_F = aoe.engine.add_ob(new Person("mr_f", {
		display_x: 16, 
		display_y: 16, 
		display_w: 16, 
		display_h: 32,
		grid_x: 13,
		grid_y: 6,
		screen_ref: "e8",
		grid_w: 1,
		grid_h: 1,
		display_name: "Mr F",
		}));
		
	MR_F.face("l");
		
	VICKI = aoe.engine.add_ob(new Person("vicki", {
		display_x: 16, 
		display_y: 16, 
		display_w: 16, 
		display_h: 32,
		grid_x: 5,
		grid_y: 1,
		screen_ref: "hut_entrance",
		grid_w: 1,
		grid_h: 1,
		display_name: "Vicki",
		}));

	SAM = aoe.engine.add_ob(new Person("sam", {
		display_x: 16, 
		display_y: 16, 
		display_w: 16, 
		display_h: 32,
		grid_x: 9,
		grid_y: 11,
		screen_ref: "e8",
		grid_w: 1,
		grid_h: 1,
		display_name: "Sam",
		}));
		
	SAM.face("up");
	
	MRS_J = aoe.engine.add_ob(new Person("mrs_j", {
		display_x: 16, 
		display_y: 16, 
		display_w: 16, 
		display_h: 32,
		grid_x: 13,
		grid_y: 6,
		screen_ref: "l5",
		grid_w: 1,
		grid_h: 1,
		display_name: "Mrs J",		
	}));
	MRS_J.face("down");


	if (!restart) {
		aoe.engine.set_music("main_theme");
		aoe.engine.music.loop = false;
		aoe.engine.scrolling_image("intro", 90000).and_then(() => {
			aoe.engine.set_music("huts");	
		});
	} else {
		aoe.engine.set_music("huts");
	}
	
	aoe.game_running = true;
	aoe.engine.cycle();
}

aoe.engine.start = function () {
	
	const canvas = document.querySelector("canvas#aoe-game-area");
	const loading_screen = document.querySelector("#loading");
	const S = aoe.settings;
	
	loading_screen.style.display = "block";
	
	const check_loaded_assets = function () {
		if (aoe.total_images_loaded < aoe.total_images_required || aoe.total_audio_loaded < aoe.total_audio_required) {
			setTimeout(check_loaded_assets, 100);
			return;
		} else {
			loading_screen.style.display = "none";
			aoe.engine.obs = [];
			aoe.engine.screens = {};
			aoe.engine.is_in_text_mode = false;
			aoe.engine.texts_to_display = [];
			aoe.keys = [];			
			
			if (console && console.log) {
				console.log("Oh look, amazing hackerman has opened the dev tools. How clever. \n \nListen, you may be 1337, but there are tonnes of spoilers if you go nosing in here Mr H4x0r. You've been warned.");
			}
			
			document.querySelector("#donate .close-button").addEventListener("click", () => {
				document.querySelector("#donate").style.display = "none";
			});
			
			// Special for Howes in case you're on a modernfangled pokey thing
			if ("ontouchstart" in document.documentElement) {
				document.querySelector("#pokey-device-controls").style.display = "block";
				const upPoker = document.querySelector("#pokey-device-up");
				const downPoker = document.querySelector("#pokey-device-down");
				const leftPoker = document.querySelector("#pokey-device-left");
				const rightPoker = document.querySelector("#pokey-device-right");
				const interactPoker = document.querySelector("#pokey-device-interact");
				
				upPoker.addEventListener("ontouchstart", () => {aoe.keydown({"keyCode": aoe.settings.keys.up});});
				downPoker.addEventListener("ontouchstart", () => {aoe.keydown({"keyCode": aoe.settings.keys.down});});
				leftPoker.addEventListener("ontouchstart", () => {aoe.keydown({"keyCode": aoe.settings.keys.left});});
				rightPoker.addEventListener("ontouchstart", () => {aoe.keydown({"keyCode": aoe.settings.keys.right});});
				interactPoker.addEventListener("ontouchstart", () => {aoe.keydown({"keyCode": aoe.settings.keys.action});});

				upPoker.addEventListener("ontouchend", () => {aoe.keyup({"keyCode": aoe.settings.keys.up});});
				downPoker.addEventListener("ontouchend", () => {aoe.keyup({"keyCode": aoe.settings.keys.down});});
				leftPoker.addEventListener("ontouchend", () => {aoe.keyup({"keyCode": aoe.settings.keys.left});});
				rightPoker.addEventListener("ontouchend", () => {aoe.keyup({"keyCode": aoe.settings.keys.right});});
				interactPoker.addEventListener("ontouchend", () => {aoe.keyup({"keyCode": aoe.settings.keys.action});});
			}
			
			aoe.engine.setup_game_data();
		}
	}
	
	window.addEventListener("keydown", aoe.keydown);
	window.addEventListener("keyup", aoe.keyup);
	
	if (S.display_scale === "auto") {
		S.display_scale = Math.floor(window.innerWidth / S.display_width);
		if (S.display_height * S.display_scale > window.innerHeight) {
			S.display_scale = Math.floor(window.innerHeight / S.display_height);
		}
		if (S.display_scale < 1) {
			S.display_scale = 1;
		}
	}
	
	canvas.setAttribute("width", S.display_width);
	canvas.setAttribute("height", S.display_height);
	canvas.style.width = ((S.display_width * S.display_scale) / window.devicePixelRatio) + "px";
	canvas.style.height = ((S.display_height * S.display_scale) / window.devicePixelRatio) + "px";
	
	aoe.canvas = canvas;
	aoe.display = canvas.getContext("2d");
	aoe.display.font = aoe.settings.font_size + " " + aoe.settings.font;
	aoe.browser = aoe.detect_browser();
	
	aoe.images = {};
	aoe.total_images_required = 0;
	aoe.total_images_loaded = 0;
	
	aoe.audio = {};
	aoe.total_audio_required = 0;
	aoe.total_audio_loaded = 0;
	
	aoe.engine.load_all_images();
	aoe.engine.load_all_audio();
	
	check_loaded_assets();
	
};

aoe.engine.restart = function () {
	aoe.game_running = false;
	aoe.engine.obs = [];
	aoe.engine.screens = {};
	aoe.engine.is_in_text_mode = false;
	aoe.engine.texts_to_display = [];
	aoe.keys = [];
	aoe.engine.stop_all_audio();
	aoe.engine.setup_game_data(true);
}

aoe.engine.load_all_images = function () {
	
	let img;
	
	for (img in aoe.images_to_load) {
		if (aoe.images_to_load.hasOwnProperty(img)) {
			if (!aoe.images.hasOwnProperty(img)) {
				aoe.total_images_required += 1;
				aoe.images[img] = new Image();
				aoe.images[img].src = aoe.images_to_load[img];
				aoe.images[img].onload = function () {
					aoe.total_images_loaded += 1;
				}
			}
		}
	}
	
};

aoe.engine.load_all_audio = function () {
	
	let audio;
	
	for (audio in aoe.audio_to_load) {
		if (aoe.audio_to_load.hasOwnProperty(audio)) {
			if (!aoe.audio.hasOwnProperty(audio)) {
				aoe.total_audio_required += 1
				aoe.audio[audio] = new Audio();
				aoe.audio[audio].muted = true;
				aoe.audio[audio].oncanplaythrough = function () {
					aoe.total_audio_loaded += 1;
				};
				aoe.audio[audio].preload = "auto";
				aoe.audio[audio].src = aoe.audio_to_load[audio];
				aoe.audio[audio].load();
			}
		}
	}
	
};

aoe.engine.play_audio = function (audio_key) {
	const a = aoe.audio[audio_key];
	a.play();
	a.muted = false;
};

aoe.engine.stop_audio = function (audio_key) {
	const a = aoe.audio[audio_key];
	a.pause();
	a.currentTime = 0;
}

aoe.engine.stop_all_audio = function () {
	for (a in aoe.audio) {
		if (aoe.audio.hasOwnProperty(a)) {
			aoe.engine.stop_audio(a);
		}
	}
};

aoe.engine.set_music = function (music_reference_key, loops) {
	aoe.engine.stop_music();
	aoe.engine.music = aoe.audio[music_reference_key];
	aoe.engine.music.loop = loops ? loops : true;
	aoe.engine.music.volume = aoe.settings.music_volume;
	aoe.engine.play_audio(music_reference_key);
};

aoe.engine.stop_music = function () {
	if (aoe.engine.music) {
		aoe.engine.music.pause();
		aoe.engine.music.currentTime = 0;
	}
};

aoe.engine.text_box = function(lines, x, y) {
	aoe.engine.texts_to_display.push(new Textbox(lines, 32, 32));
};

aoe.engine.choose = function (choices, x, y, preselected_choice) {
	const box = new Choicebox(choices, x, y, preselected_choice);
	aoe.engine.texts_to_display.push(box)
	return box;
};

aoe.engine.image_box = function (img_name, x, y) {
	const box = new Imagebox(aoe.images[img_name], x, y);
	aoe.engine.texts_to_display.push(box);
	return box;
};

aoe.engine.scrolling_image = function (img_name, duration) {
	const scroller = new ScrollingImage(img_name, duration);
	aoe.engine.texts_to_display.push(scroller);
	return scroller;
};

aoe.engine.full_screen_animation = function (img_key, animation_key, skippable) {
	const fsa = new FullScreenAnimation(img_key, animation_key, skippable);
	aoe.engine.texts_to_display.push(fsa);
	return fsa;
}

aoe.engine.next_text = function () {
	const and_then = aoe.engine.texts_to_display[0].and_then_function;
	aoe.engine.texts_to_display.shift();
	if (aoe.engine.texts_to_display.length === 0 && and_then && typeof and_then === "function" && !this.and_then_function_fired) {
		and_then();
	}
};

aoe.engine.add_ob = function (new_ob) {
	aoe.engine.obs.push(new_ob);
	return new_ob;
};

aoe.engine.set_screen = function (screen_reference_key) {
	aoe.engine.screen = aoe.engine.screens[screen_reference_key];
};

aoe.engine.ob_at = function (x, y, screen_ref) {
	let s = screen_ref ? aoe.engine.screens[screen_ref] : aoe.engine.screen;
	if (s.grid[x + "-" + y]) {
		return s.grid[x + "-" + y].contents;
	} else {
		return false;
	}
}

aoe.engine.end_game = function (ending_key) {
	// TODO - sort out game endings
	// aoe.game_running = false;
	
	if (!aoe.donation_link_shown) {
		setTimeout(() => {document.querySelector("#donate").style.display = "block"}, 60000);
		aoe.donation_link_shown = true;
	}
	
	aoe.engine.stop_all_audio();
	aoe.engine.show_title_screen = true;
};

aoe.engine.cycle = function () {
	let cycle_start = Date.now();
	
	aoe.engine.update_obs();
	aoe.engine.render();
	
	if (aoe.game_running) {
		let time_passed = Date.now() - cycle_start;
		aoe.engine_cycle_timer = setTimeout(aoe.engine.cycle, Math.max((1000 / aoe.settings.fps) - time_passed, 0));
	} else {
		aoe.display.fillStyle = "#000000";
		aoe.display.fillRect(0, 0, aoe.settings.display_width, aoe.settings.display_height);
	}
};

aoe.engine.update_obs = function () {
	let i;
	
	for (i = 0; i < aoe.engine.obs.length; i += 1) {
		aoe.engine.update_ob(aoe.engine.obs[i]);
	}
};

aoe.engine.update_ob = function(ob) {
	if (ob.does_anything) {
		ob.do_things();
	}
};

aoe.engine.render = function () {
	const D = aoe.display;
	let sorted_obs = [];
	let i;
	
	D.clearRect(0, 0, aoe.canvas.width, aoe.canvas.height);
	
	if (aoe.engine.show_title_screen) {
		D.drawImage(aoe.images.title_screen, 0, 0);
		D.fillStyle = "#FFFFFF";
		D.fillText("Press space to restart", 18, 180);
		return;
	}
	
	if (aoe.engine.screen) {
		let screen = aoe.engine.screen;
		D.drawImage(screen.background_image, 0, 0);
		if (screen.extra_images.length > 0) {
			screen.extra_images.forEach((extra) => {
				D.drawImage(extra.img, extra.x, extra.y);
			});
		}
	}
	
	for (i = 0; i < aoe.engine.obs.length; i += 1) {
		if (aoe.engine.obs[i].screen_ref === aoe.engine.screen.reference_key) {
			sorted_obs.push(aoe.engine.obs[i]);
		}
	}
	
	sorted_obs.sort(function (a, b){
		return (a.grid_y + a.grid_h) - (b.grid_y + b.grid_h);
	});
	
	for (i = 0; i < sorted_obs.length; i += 1) {
		if (sorted_obs[i].renders) {
			aoe.engine.render_ob(sorted_obs[i]);
		}
	}
	
	if (aoe.engine.texts_to_display.length > 0) {
		aoe.engine.texts_to_display[0].render();
	}
};

aoe.engine.render_ob = function (ob) {
	const D = aoe.display;
	const screen = aoe.engine.screen;
	if (ob.img) {
		if (ob.animation) {
			if (Date.now() - ob.frame_last_cycled > ob.animation.frame_millis) {
				ob.frame_last_cycled = Date.now();
				ob.current_frame += 1;
				if (ob.current_frame >= ob.animation.frames) {
					if (ob.animation.loops) {
						ob.current_frame = 0
					} else {
						ob.current_frame = ob.animation.frames - 1;
					}
				}
			}
			let frame_width = ob.img.width / ob.animation.frames;
			let frame_height = ob.img.height;
			D.drawImage(ob.img, ob.current_frame * frame_width, 0, frame_width, frame_height, ob.display_x + screen.floor_start_x, ob.display_y + screen.floor_start_y, frame_width, frame_height);
		} else {
			D.drawImage(ob.img, ob.display_x + screen.floor_start_x, ob.display_y + screen.floor_start_y)
		}
	}
	if (ob.additional_images) {
		let i;
		for (i = 0; i < ob.additional_images.length; i += 1) {
			let ad_img = ob.additional_images[i];
			// Super-special case for tie hat. Delete if re-using code.
			if(ad_img.img === aoe.images.tie_hat && ob.animation && ob.animation === aoe.animations.person_walking && ob.current_frame % 2 !== 0) {
				D.drawImage(ad_img.img, ob.display_x + screen.floor_start_x + ad_img.offset_x, ob.display_y + screen.floor_start_y + ad_img.offset_y + 1);			
			} else {
				D.drawImage(ad_img.img, ob.display_x + screen.floor_start_x + ad_img.offset_x, ob.display_y + screen.floor_start_y + ad_img.offset_y);
			}
		}
	}
};

// Input stuff

aoe.keydown = function(e) {
	if (aoe.engine.texts_to_display.length === 0) {
		aoe.keys[e.keyCode] = true;
	}
};

aoe.keyup = function (e) {
	aoe.keys[e.keyCode] = false;
	
	if (aoe.engine.show_title_screen) {
		if (e.keyCode === aoe.settings.keys.action) {
			aoe.engine.show_title_screen = false;
			aoe.engine.restart();
		}
	} else {
		if (aoe.engine.texts_to_display.length > 0) {
			if (aoe.engine.interaction_just_started) {
				aoe.engine.interaction_just_started = false;
			} else {
				if (e.keyCode === aoe.settings.keys.action) {
					if (aoe.engine.texts_to_display[0].type === "Choicebox") {
						aoe.engine.texts_to_display[0].choose();
					}
					if (aoe.engine.texts_to_display[0].type === "FullScreenAnimation" && !aoe.engine.texts_to_display[0].skippable) {
						return;
					}
					aoe.engine.next_text();
					return;
				}
				if (aoe.engine.texts_to_display[0].type === "Choicebox") {
					if (e.keyCode === aoe.settings.keys.up) {
						aoe.engine.texts_to_display[0].up();
					}
					if (e.keyCode === aoe.settings.keys.down) {
						aoe.engine.texts_to_display[0].down();
					}
				}
			}
		}
	}
};

aoe.key_is_pressed = function (key_name) {
	return aoe.keys[aoe.settings.keys[key_name]];
};

// Random utility stuff

aoe.detect_browser = function() {
	
	if (!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )) {
		return "Firefox";
	}
	if (document.all && !window.opera) {
		return "IE";
	}
	if (window.opera) {
		return "Opera";
	}
	if (window.chrome) {
		return "Chrome";
	}
	if (!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera) {
		return "Safari";
	}
	
	return "browser";
	
};

window.addEventListener("load", function () {
	document.querySelector("#click-to-start").addEventListener("click", function () {
		document.querySelector("#click-to-start").style.display = "none";
		aoe.engine.start();
	});
});