// Adventures of Engine Ob prototype

// Generic object

const Ob = function (vals) {

	for (p in vals) {
		if (vals.hasOwnProperty(p)) {
			this[p] = vals[p];
		}
	}
	
	this.additional_images = [];
	this.flags = {};

};

Ob.prototype.type = "Ob";
Ob.prototype.grid_x = 0;
Ob.prototype.grid_y = 0;
Ob.prototype.grid_w = 0;
Ob.prototype.grid_h = 0;	
Ob.prototype.display_x = 0;
Ob.prototype.display_y = 0;
Ob.prototype.display_w = 0;
Ob.prototype.display_h = 0;	
Ob.prototype.display_offset_x = 0;
Ob.prototype.display_offset_y = 0;
Ob.prototype.screen_ref = false;
Ob.prototype.img = false;
Ob.prototype.animation = false;
Ob.prototype.renders = true;
Ob.prototype.does_anything = false;
Ob.prototype.takes_up_space = true;
Ob.prototype.frame_last_cycled = 0;
Ob.prototype.current_frame = 0;
Ob.prototype.interaction_key = false;

Ob.prototype.move_to = function (grid_x, grid_y, screen_ref) {
	const current_screen = aoe.engine.screens[this.screen_ref];
	const move_to_screen = aoe.engine.screens[screen_ref];
	let x, y;
	
	if (this.takes_up_space && current_screen) {
		for (y = 0; y < this.grid_h; y += 1) {
			for (x = 0; x < this.grid_w; x += 1) {
				let square = current_screen.grid[(this.grid_x + x) + "-" + (this.grid_y + y)];
				square.is_empty = true;
				square.contents = false;
			}
		}
	}
	
	this.grid_x = grid_x;
	this.grid_y = grid_y;
	
	this.display_x = this.grid_to_display_x();
	this.display_y = this.grid_to_display_y();
	
	this.screen_ref = screen_ref;
	
	if (this.takes_up_space) {	
		for (y = 0; y < this.grid_h; y += 1) {
			for (x = 0; x < this.grid_w; x += 1) {
				let square = move_to_screen.grid[(this.grid_x + x) + "-" + (this.grid_y + y)];
				square.is_empty = false;
				square.contents = this;
			}
		}
	}
};

Ob.prototype.remove_from_grid = function () {
	const current_screen = aoe.engine.screens[this.screen_ref];
	let x, y;
	
	if (current_screen) {
		for (y = 0; y < this.grid_h; y += 1) {
			for (x = 0; x < this.grid_w; x += 1) {
				let square = current_screen.grid[(this.grid_x + x) + "-" + (this.grid_y + y)];
				square.is_empty = true;
				square.contents = false;
			}
		}		
	}
};

Ob.prototype.add_to_grid = function () {
	const current_screen = aoe.engine.screens[this.screen_ref];
	let x, y;
	
	for (y = 0; y < this.grid_h; y += 1) {
		for (x = 0; x < this.grid_w; x += 1) {
			let square = current_screen.grid[(this.grid_x + x) + "-" + (this.grid_y + y)];
			square.is_empty = false;
			square.contents = this;
		}
	}	
};

Ob.prototype.remove_from_game = function () {
	const current_screen = aoe.engine.screens[this.screen_ref];
	if (this.takes_up_space && current_screen) {
		for (y = 0; y < this.grid_h; y += 1) {
			for (x = 0; x < this.grid_w; x += 1) {
				let square = current_screen.grid[(this.grid_x + x) + "-" + (this.grid_y + y)];
				square.is_empty = true;
				square.contents = false;
			}
		}
	}
	this.screen_ref = false;
};

Ob.prototype.can_move_to = function (grid_x, grid_y, screen_ref) {
	const current_screen = aoe.engine.screens[screen_ref];
	return current_screen.grid[grid_x + "-" + grid_y] && current_screen.grid[grid_x + "-" + grid_y].is_empty;
};

Ob.prototype.can_move = function (direction) {
	if (direction === "u" || direction === "up") {
		return this.can_move_to(this.grid_x, this.grid_y - 1, this.screen_ref);
	} else if (direction === "r" || direction === "right") {
		return this.can_move_to(this.grid_x + 1, this.grid_y, this.screen_ref);		
	} else if (direction === "d" || direction === "down") {
		return this.can_move_to(this.grid_x, this.grid_y + 1, this.screen_ref);		
	} else if (direction === "l" || direction === "left") {
		return this.can_move_to(this.grid_x - 1, this.grid_y, this.screen_ref);		
	} else {
		return this.can_move("up") || this.can_move("right") || this.can_move("down") || this.can_move("left");
	}
};

Ob.prototype.is_above = function (other) {
	return other.grid_y > this.grid_y;
};

Ob.prototype.is_to_the_right_of = function (other) {
	return other.grid_x < this.grid_x;
};

Ob.prototype.is_below = function (other) {
	return other.grid_y < this.grid_y;
};

Ob.prototype.is_to_the_left_of = function (other) {
	return other.grid_x > this.grid_x;
};

Ob.prototype.grid_to_display_x = function () {
	return (this.grid_x * aoe.settings.tile_width) + this.display_offset_x;
};

Ob.prototype.grid_to_display_y = function () {
	return ((this.grid_y) * aoe.settings.tile_height) - ((this.display_h - (this.grid_h * aoe.settings.tile_height))) + this.display_offset_y;
};

Ob.prototype.add_additional_image = function (img_key, x, y) {
	const ox = x ? x : 0;
	const oy = y ? y : 0;
	const new_image = {img: aoe.images[img_key], offset_x: ox, offset_y: oy};
	this.additional_images.push(new_image);
	return new_image;
};

// Desk

const Desk = function(orientation, vals) {
	Ob.call(vals);
	
	for (p in vals) {
		if (vals.hasOwnProperty(p)) {
			this[p] = vals[p];
		}
	}
	
	this.img = aoe.images["desk_" + orientation];

	if (orientation === "h") {
		this.grid_w = 2;
		this.grid_h = 1;
	} else if (orientation === "v") {
		this.grid_w = 1;
		this.grid_h = 2;
	}
	
	this.display_w = this.grid_w * aoe.settings.tile_width;
	this.display_h = (this.grid_h + 1) * aoe.settings.tile_height;
	
	this.move_to(this.grid_x, this.grid_y, this.screen_ref)
};

Desk.prototype = Object.create(Ob.prototype);
Desk.prototype.constructor = Desk;

Desk.prototype.type = "Desk";
Desk.prototype.interaction_key = "desk";

// Chair

const Chair = function (facing, colour, vals) {
	Ob.call(vals);
	
	for (p in vals) {
		if (vals.hasOwnProperty(p)) {
			this[p] = vals[p];
		}
	}
	
	this.img = aoe.images["chair_" + facing + "_" + colour];
	
	this.display_w = aoe.settings.tile_width;
	this.display_h = 2 * aoe.settings.tile_height;
	
	if (facing === "r") {
		this.display_offset_x = - 9;
		this.display_offset_y = - 9;
	} else if (facing === "l") {
		this.display_offset_x = 9;
		this.display_offset_y = - 9;		
	} else if (facing === "d") {
		this.display_offset_y = -1;
	} else if (facing === "u") {
		this.display_offset_y = 1;
	}
	
	this.move_to(this.grid_x, this.grid_y, this.screen_ref)
};

Chair.prototype = Object.create(Ob.prototype);
Chair.prototype.constructor = Chair;

Chair.prototype.type = "Chair";

Chair.prototype.does_anything = false;
Chair.prototype.takes_up_space = false;
Chair.prototype.grid_w = 1;
Chair.prototype.grid_h = 1;


// Decoration (things that are just pictures basically)

const Decoration = function (vals) {
	Ob.call(vals);
	for (p in vals) {
		if (vals.hasOwnProperty(p)) {
			this[p] = vals[p];
		}
	}
};

Decoration.prototype = Object.create(Ob.prototype);
Decoration.prototype.constructor = Decoration;

Decoration.prototype.does_anything = false;
Decoration.prototype.takes_up_space = false;

// Impassable block with no associated images

const Wall = function (grid_x, grid_y, grid_w, grid_h, screen_ref, vals) {
	Ob.call(vals);
	for (p in vals) {
		if (vals.hasOwnProperty(p)) {
			this[p] = vals[p];
		}
	}
	this.grid_x = grid_x;
	this.grid_y = grid_y;
	this.grid_w = grid_w;
	this.grid_h = grid_h;
	this.screen_ref = screen_ref;
	this.move_to(this.grid_x, this.grid_y, this.screen_ref)
};

Wall.prototype = Object.create(Ob.prototype);
Wall.prototype.constructor = Wall;
Wall.prototype.type = "Wall";

Wall.prototype.renders = false;
Wall.prototype.does_anything = false;

// Door

const Door = function (grid_x, grid_y, screen_ref, destination_x, destination_y, destination_screen_ref, vals) {
	Ob.call(vals);
	for (p in vals) {
		if (vals.hasOwnProperty(p)) {
			this[p] = vals[p];
		}
	}	
	this.grid_x = grid_x;
	this.grid_y = grid_y;
	this.screen_ref = screen_ref;
	this.destination_x = destination_x;
	this.destination_y = destination_y;
	this.destination_screen_ref = destination_screen_ref;
	
	this.move_to(this.grid_x, this.grid_y, this.screen_ref);
}

Door.prototype = Object.create(Ob.prototype);
Door.prototype.constructor = Door;
Door.prototype.type = "Door";

Door.prototype.renders = false;
Door.prototype.does_anything = false;
Door.prototype.interaction_key = "door";
Door.prototype.grid_w = 1;
Door.prototype.grid_h = 1;

// Mr F Docking Station

const Mr_F_Docking_Station = function (grid_x, grid_y, screen_ref, vals) {
	Ob.call(vals);
	this.grid_x = grid_x;
	this.grid_y = grid_y;
	this.screen_ref = screen_ref;
	this.img = aoe.images["mr_f_docking_station"];
	this.animation = aoe.animations["mr_f_docking_station"];
	
	this.display_w = aoe.settings.tile_width;
	this.display_h = aoe.settings.tile_height * 2;
	
	this.display_x = this.grid_to_display_x();
	this.display_y = this.grid_to_display_y();	
};

Mr_F_Docking_Station.prototype = Object.create(Ob.prototype);
Mr_F_Docking_Station.prototype.constructor = Mr_F_Docking_Station;
Mr_F_Docking_Station.prototype.type = "Mr_F_Docking_Station";

Mr_F_Docking_Station.prototype.renders = false;
Mr_F_Docking_Station.prototype.grid_w = 1;
Mr_F_Docking_Station.prototype.grid_h = 1;
Mr_F_Docking_Station.prototype.interaction_key = "mr_f_docking_station";

Mr_F_Docking_Station.prototype.show = function () {
	this.renders = true;
	this.add_to_grid();
};

Mr_F_Docking_Station.prototype.hide = function () {
	this.renders = false;
	this.remove_from_grid();
}

// PPPPP  EEEEE  RRRRR  SSSSS  OOOOO  N   N
// P   p  E      R   R  S      O   O  NN  N
// PPPPP  EEEEE  RRRRR  SSSSS  O   O  N N N
// P      E      RRR        S  O   O  N  NN
// P      EEEEE  R  RR  SSSSS  OOOOO  N   N

const Person = function (name, vals) {
	let thePerson = this;
	Ob.call(vals);

	for (p in vals) {
		if (vals.hasOwnProperty(p)) {
			this[p] = vals[p];
		}
	}

	const add_img = function(img_ending) {
		thePerson.images[img_ending] = aoe.images[name + "_" + img_ending];
	}

	this.images = {};
	add_img("u");
	add_img("r");
	add_img("d");
	add_img("l");
	add_img("u_walking");
	add_img("r_walking");
	add_img("d_walking");
	add_img("l_walking");
	add_img("r_blinking");
	add_img("d_blinking");
	add_img("l_blinking");
	add_img("portrait");

	this.does_anything = true;
	this.facing = this.facing ? this.facing : "d";
	this.accepting_input = this.is_player_controlled;
	this.last_input_time = 0;
	this.last_frame_time = 0;
	this.last_blink_time = 0;
	this.name = name;
	this.interaction_key = "person_" + this.name;
	this.action_queue = [];
	this.ignore_idle = false;
	
	if (!this.display_name) {
		this.display_name = this.name.charAt(0).toUpperCase() + this.name.substr(1).toLowerCase();
	}

	this.move_to(this.grid_x, this.grid_y, this.screen_ref);
};

Person.prototype = Object.create(Ob.prototype);
Person.prototype.constructor = Person;

Person.prototype.type = "Person";

Person.prototype.walk_speed = 400;
Person.prototype.blink_speed = 5000;

Person.prototype.do_things = function () {
	const now = Date.now();
	const time_passed = now - this.last_frame_time;
		
	if (this.action_queue.length > 0 && !this.doing_action) {
		this.next_action();
	}
		
	if (this.is_walking) {
		this.img = this.images[this.facing + "_walking"];
		if (now - this.last_input_time < this.walk_speed) {
			if (this.facing === "u" || this.facing === "d") {
				let distance_travelled = Math.round(aoe.settings.tile_height * ((this.last_input_time - now) / this.walk_speed));
				if (this.facing === "u") {
					this.display_y = this.grid_to_display_y() + distance_travelled + aoe.settings.tile_height - 1;
				} else if (this.facing === "d") {
					this.display_y = this.grid_to_display_y() - distance_travelled - aoe.settings.tile_height + 1;
				}
			} else if (this.facing === "l" || this.facing === "r") {
				let distance_travelled = Math.round(aoe.settings.tile_width * ((this.last_input_time - now) / this.walk_speed));
				if (this.facing === "l") {
					this.display_x = this.grid_to_display_x() + distance_travelled + aoe.settings.tile_width - 1;
				} else if (this.facing === "r") {
					this.display_x = this.grid_to_display_x() - distance_travelled - aoe.settings.tile_width + 1;
				}			
			}
		} else {
			this.is_walking = false;
			this.accepting_input = true;
			this.img = this.images[this.facing];
			this.animation = false;
		}
	} else {
		if (now - this.last_blink_time > this.blink_speed && this.facing !== "u" && !this.doing_action && !this.ignore_idle) {
			this.current_frame = 0;
			this.img = this.images[this.facing + "_blinking"];
			this.animation = aoe.animations.person_blinking;
			this.last_blink_time = now;
		}
	}
	
	if (this.is_player_controlled && this.accepting_input && this.action_queue.length === 0) {
		this.handle_input();
	}
	
	if (this.action_will_complete && this.action_will_complete < now) {
		this.doing_action = false;
		this.action_will_complete = false;
		if (this.on_action_complete) {
			this.on_action_complete();
			this.on_action_complete = false;
		}
	}
	
	if (this.name === "mr_f" && !this.is_player_controlled) {
		if (this.screen_ref === CHRIS.screen_ref) {
			if (!this.last_faced_chris) {
				this.last_faced_chris = Date.now();
			}
			if (Date.now() - this.last_faced_chris > (this.watch_chris_speed ? this.watch_chris_speed : 7500)) {
				this.face_other_person(CHRIS);
				this.last_faced_chris = Date.now();
			}
		}
	}
	
	this.last_frame_time = now;
};

Person.prototype.queue_action = function (action_function, repeats) {
	let r = 0;
	if (!repeats) { repeats = 1; }
	for (r = 0; r < repeats; r += 1) {
		this.action_queue.push(action_function);
	}
};

Person.prototype.next_action = function () {
	this.doing_action = true;
	this.action_queue[0]();
	this.action_queue.shift();
};

Person.prototype.handle_input = function () {
	const screen_ref = aoe.engine.screen.reference_key;
	const that = this;
	
	const walk_check = function (direction) {
		that.face(direction);
		if (that.can_move(direction)) {
			that.walk(direction);
		} else {
			that.animation = false;
		}
	}
	
	if (aoe.engine.texts_to_display.length === 0) {
		if (aoe.key_is_pressed("up")) {
			walk_check("up");
		} else if (aoe.key_is_pressed("right")) {
			walk_check("right");	
		} else if (aoe.key_is_pressed("down")) {
			walk_check("down");
		} else if (aoe.key_is_pressed("left")) {
			walk_check("left");
		} 
		if (aoe.key_is_pressed("action")) {
			let x, y;
			
			if (this.facing === "u") {x = this.grid_x; y = this.grid_y - 1;}
			if (this.facing === "r") {x = this.grid_x + 1; y = this.grid_y;}
			if (this.facing === "d") {x = this.grid_x; y = this.grid_y + 1;}
			if (this.facing === "l") {x = this.grid_x - 1; y = this.grid_y;}
			
			let possible_other = aoe.engine.ob_at(x, y);
			if (possible_other) {
				this.interact_with(possible_other);
			}
			
		}
	}
};

Person.prototype.walk = function(direction) {
	this.accepting_input = false;
	this.is_walking = true;
	this.last_input_time = Date.now();
	
	if (direction === "up" || direction === "u") {
		this.move_to(this.grid_x, this.grid_y - 1, this.screen_ref);
		this.display_y = this.grid_to_display_y() + aoe.settings.tile_height;		
		this.facing = "u";
	} else if (direction === "right" || direction === "r") {
		this.move_to(this.grid_x + 1, this.grid_y, this.screen_ref);
		this.display_x = this.grid_to_display_x() - aoe.settings.tile_width;		
		this.facing = "r";
	} else if (direction === "down" || direction === "d") {
		this.move_to(this.grid_x, this.grid_y + 1, this.screen_ref);
		this.display_y = this.grid_to_display_y() - aoe.settings.tile_height;
		this.facing = "d";
	} else if (direction === "left" || direction === "l") {
		this.move_to(this.grid_x - 1, this.grid_y, this.screen_ref);
		this.display_x = this.grid_to_display_x() + aoe.settings.tile_width;
		this.facing = "l";
	}
	
	this.img = this.images[this.facing + "_walking"];
	this.animation = aoe.animations.person_walking;
};

Person.prototype.walk_action = function(direction, repeats) {
	const that = this;
	this.queue_action( () => {		
		that.action_will_complete = that.walk_speed + Date.now();
		that.walk(direction)
	}, repeats);			
};

Person.prototype.run_action = function (direction, repeats) {
	const that = this;
	this.queue_action( () => {			
		that.walk_speed = 200;
		that.action_will_complete = that.walk_speed + Date.now();		
		that.walk(direction);
		that.on_action_complete = () => {that.walk_speed = 400;};
	}, repeats);		
};

Person.prototype.face_action = function (direction) {
	const that = this;
	this.queue_action( () => {		
		that.action_will_complete = Date.now() + 1;
		that.face(direction);
	});		
};

Person.prototype.pause_action = function (length_of_pause) {
	const that = this;
	this.queue_action( () => {	
		that.action_will_complete = length_of_pause + Date.now();
		if (that.accepting_input) {
			that.accepting_input = false;
			that.on_action_complete = function () {that.accepting_input = true;};
		}
	});		
};

Person.prototype.interact_with_action = function (other) {
	const that = this;
	this.queue_action( () => {
		that.action_will_complete = Date.now() + 1;
		that.interact_with(other);
		that.on_action_complete = function () {aoe.engine.interaction_just_started = false;};
	});	
};

Person.prototype.animate_action = function (img_key, animation_key) {
	const that = this;
	this.queue_action(() => {
		that.img = aoe.images[img_key];
		that.animation = aoe.animations[animation_key];
		that.current_frame = 0;
		that.action_will_complete = Date.now() + (that.animation.frames * that.animation.frame_millis);
	});
};

Person.prototype.any_function_action = function (and_then_function) {
	const that = this;
	this.queue_action( () => {
		that.action_will_complete = Date.now() + 1;
		if (that.accepting_input) {
			that.accepting_input = false;
			that.on_action_complete = function () {
				that.accepting_input = true; 
				and_then_function();
			}
		} else {
			that.on_action_complete = and_then_function;
		}
	});
};

// Stops any animation and faces you appropriately
Person.prototype.face = function (direction) {
	direction = direction.toLowerCase();
	if (direction === "up") { direction = "u"; }
	if (direction === "right") { direction = "r"; }
	if (direction === "down") { direction = "d"; }
	if (direction === "left") { direction = "l"; }
	
	this.facing = direction;
	this.img = this.images[this.facing];
	this.animation = false;
	this.last_blink_time = Date.now();
};

Person.prototype.face_other_person = function (other) {
	const dx = this.grid_x - other.grid_x;
	const dy = this.grid_y - other.grid_y;
	
	if (dx === 0) {
		if (dy < 0) {
			this.face("down");
			return;
		}
		if (dy > 0) {
			this.face("up");
			return;
		}
	}
	if (dy === 0) {
		if (dx < 0) {
			this.face("right");
			return;
		}
		if (dx > 0) {
			this.face("left");
			return;
		}
	}
	if (dx !== 0 && dy !== 0) {
		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx < 0) {
				this.face("right");
				return;
			}
			if (dx > 0) {
				this.face("left");
				return;
			}			
		} else {
			if (dy < 0) {
				this.face("down");
				return;
			}
			if (dy > 0) {
				this.face("up");
				return;
			}			
		}
	}
};

Person.prototype.says = function (lines) {
	const box = new Speachbox(this, lines, this.display_x, this.display_y - (aoe.settings.tile_height * 1.5));
	aoe.engine.texts_to_display.push(box);
	return box;
};

Person.prototype.chooses = function (choices, preselected_choice) {
	if (!preselected_choice) {preselected_choice = 0;}
	const box = new Choicebox(choices, this.display_x, this.display_y - (aoe.settings.tile_height * 1.5), preselected_choice);
	aoe.engine.texts_to_display.push(box);
	return box;
}

Person.prototype.interact_with = function (other) {
	if (other.interaction_key) {
		aoe.engine.interaction_just_started = true;
		aoe.interactions[this.interaction_key][other.interaction_key](this, other);
	}
};