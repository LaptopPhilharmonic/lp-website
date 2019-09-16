// Adventures of Engine text box object. All of these need a render function.

Textbox = function (lines, x, y, title) {
	this.lines = lines;
	
	this.w = aoe.settings.text_box_width;
	
	if (x + this.w > aoe.settings.display_width) {
		this.x = aoe.settings.display_width - this.w;
	} else if (x < 0) {
		this.x = 0;
	} else {
		this.x = x;
	}
	
	this.h = (this.lines.length * aoe.settings.tile_height) + (aoe.settings.tile_height / 2);
	
	if (y + this.h > aoe.settings.display_height) {
		this.y = aoe.settings.display_height - this.y;
	} else if (y < 0) {
		this.y = 0;
	} else {
		this.y = y;
	}
	
	this.title = title;
};

Textbox.prototype.type = "Textbox";

Textbox.prototype.render = function () {
	const D = aoe.display;
	const screen = aoe.engine.screen;
	let l = 0;
	
	D.fillStyle = "#FFFFFF";
	D.fillRect(this.x, this.y, this.w, this.h);
	D.fillStyle = "#383838";
	for (l = 0; l < this.lines.length; l += 1) {
		D.fillText(this.lines[l], this.x + (aoe.settings.tile_width / 2), this.y + ((l + 1) * aoe.settings.tile_height));
	}
};

Speachbox = function (person, lines, x, y) {
	this.person = person;
	this.lines = lines;
	
	this.w = aoe.settings.text_box_width;
	
	if (x + this.w > aoe.settings.display_width) {
		this.x = aoe.settings.display_width - this.w;
	} else if (x < 0) {
		this.x = 0;
	} else {
		this.x = x;
	}
	
	this.h = (Math.max(this.lines.length + 1, 3) * aoe.settings.tile_height) + (aoe.settings.tile_height / 2);
	
	if (y + this.h > aoe.settings.display_height) {
		this.y = aoe.settings.display_height - this.y;
	} else if (y < 0) {
		this.y = 0;
	} else {
		this.y = y;
	}
};

Speachbox.prototype.type = "Speachbox";

Speachbox.prototype.render = function () {
	const D = aoe.display;
	const screen = aoe.engine.screen;
	let l = 0;	
	
	D.fillStyle = "rgba(0, 0, 0, 0.25)";
	D.fillRect(this.x - 2, this.y + 2, this.w, this.h);
	D.fillStyle = "#FFFFFF";
	D.fillRect(this.x, this.y, this.w, this.h);
	D.drawImage(this.person.images.portrait, this.x + (aoe.settings.tile_width / 2) - 1, this.y + (aoe.settings.tile_height / 2) - 1);
	D.fillStyle = "#5105ca";
	D.fillText(this.person.display_name + ":", this.x + (2 * aoe.settings.tile_width), this.y + (aoe.settings.tile_height))
	D.fillStyle = "#383838";
	for (l = 0; l < this.lines.length; l += 1) {
		D.fillText(this.lines[l], this.x + (2 * aoe.settings.tile_width), this.y + ((l + 2) * aoe.settings.tile_height));
	}
};

Speachbox.prototype.and_then = function (fn) {
	this.and_then_function = fn;
};

Choicebox = function (choices, x, y, preselected_choice) {
	this.choices = choices;
	
	this.w = aoe.settings.text_box_width;

	if (x + this.w > aoe.settings.display_width) {
		this.x = aoe.settings.display_width - this.w;
	} else if (x < 0) {
		this.x = 0;
	} else {
		this.x = x;
	}
	
	this.h = (Math.max(this.choices.length, 3) * aoe.settings.tile_height) + (aoe.settings.tile_height / 2);
	
	if (y + this.h > aoe.settings.display_height) {
		this.y = aoe.settings.display_height - this.y;
	} else if (y < 0) {
		this.y = 0;
	} else {
		this.y = y;
	}

	this.selected = preselected_choice ? preselected_choice : 0
	
	return this;
};

Choicebox.prototype.type = "Choicebox";

Choicebox.prototype.down = function () {
	this.selected += 1;
	if (this.selected >= this.choices.length) {
		this.selected = 0;
	}
};

Choicebox.prototype.up = function () {
	this.selected -= 1;
	if (this.selected < 0) {
		this.selected = this.choices.length - 1;
	}
};

Choicebox.prototype.choose = function () {
	this.result = this.choices[this.selected].result;
	if (typeof this.result !== "undefined") {
		this.and_then_function(this.result);
	}
};

Choicebox.prototype.and_then = function (fn) {
	this.and_then_function = fn;
};

Choicebox.prototype.render = function () {
	if (this.choices.length > 1) {
		const D = aoe.display;
		const screen = aoe.engine.screen;
		let l = 0;		
		let text_to_show = "";
		
		D.fillStyle = "rgba(0, 0, 0, 0.25)";
		D.fillRect(this.x - 2, this.y + 2, this.w, this.h);		
		D.fillStyle = "#FFFFFF";
		D.fillRect(this.x, this.y, this.w, this.h);

		for (l = 0; l < this.choices.length; l += 1) {
			if (this.selected === l) {
				D.fillStyle = "#5105ca";
				text_to_show = "> " + this.choices[l].line;
			} else {
				D.fillStyle = "#383838";
				text_to_show = this.choices[l].line;
			}
			D.fillText(text_to_show, this.x + (aoe.settings.tile_width / 2), this.y + ((l + 1) * aoe.settings.tile_height));
		}
	} else {
		this.choose();
		aoe.engine.next_text();		
	}
};

Imagebox = function (image, x, y) {
	this.img = image;
	this.x = x ? x : 0;
	this.y = y ? y : 0;
};

Imagebox.prototype.type = "Imagebox";

Imagebox.prototype.render = function () {
	const D = aoe.display;
	const screen = aoe.engine.screen;
	
	D.drawImage(this.img, this.x, this.y)
};

Imagebox.prototype.and_then = function (fn) {
	this.and_then_function = fn;
};

ScrollingText = function (lines, background_image_key, speed, text_colour) {
	this.lines = lines;
	this.background_image = aoe.images[background_image_key];
	this.speed = speed ? speed : 100;
	this.text_color = text_color ? text_color : "#000000";
	this.scroll_position = 0;
	this.last_scrolled_time = Date.now();
	this.estimated_height = lines.length * parseInt(aoe.settings.font_size.replace("px", ""));
	this.finish_position = this.estimated_height - aoe.settings.display_height;
};

ScrollingText.prototype.type = "ScrollingText";

ScrollingText.prototype.and_then = function (fn) {
	this.and_then_function = fn;
};

ScrollingImage = function (img_key, duration) {
	this.img = aoe.images[img_key];
	this.duration = duration;
	this.scroll_distance = this.img.naturalHeight - aoe.settings.display_height;
	this.current_position = 0;
	this.first_render = true;
	this.is_complete = false;
};

ScrollingImage.prototype.type = "ScrollingImage";

ScrollingImage.prototype.and_then = function (fn) {
	this.and_then_function = fn;
};

ScrollingImage.prototype.render = function () {
	const D = aoe.display;

	if (!this.is_complete) {
		if (this.first_render) {
			this.first_render = false;
			this.first_render_time = Date.now();
			D.drawImage(this.img, 0, 0);
			return;
		} else {
			let percent_complete = (Date.now() - this.first_render_time) / this.duration;
			if (percent_complete < 1) {
				D.drawImage(this.img, 0, Math.floor(this.scroll_distance * percent_complete * -1))
			} else {
				this.is_complete = true;
				D.drawImage(this.img, 0, this.scroll_distance * -1)
			}
		}
	} else {
		D.drawImage(this.img, 0, this.scroll_distance * -1)
	}
};

FullScreenAnimation = function (img_key, animation_key, skippable) {
	this.img = aoe.images[img_key];
	this.animation = aoe.animations[animation_key];
	this.skippable = skippable ? skippable : false;
	this.current_frame = -1;
	this.is_complete = false;
	this.frame_last_cycled = 0;
	this.and_then_function_fired = false;
};

FullScreenAnimation.prototype.type = "FullScreenAnimation";

FullScreenAnimation.prototype.and_then = function (fn) {
	this.and_then_function = fn;
};

FullScreenAnimation.prototype.render = function () {
	const D = aoe.display;
	
	if (Date.now() - this.frame_last_cycled > this.animation.frame_millis) {
		this.frame_last_cycled = Date.now();
		this.current_frame += 1;
		if (this.current_frame >= this.animation.frames) {
			if (this.is_complete && this.and_then_function && typeof this.and_then_function === "function" && !this.and_then_function_fired) {
				this.and_then_function_fired = true;
				this.and_then_function();
				aoe.engine.next_text();
			}
			if (this.animation.loops) {
				this.current_frame = 0
			} else {
				this.current_frame = this.animation.frames - 1;
				this.is_complete = true;
			}
		}
	}
	
	let frame_width = this.img.width / this.animation.frames;
	let frame_height = this.img.height;
	
	D.drawImage(this.img, this.current_frame * frame_width, 0, frame_width, frame_height, 0, 0, aoe.settings.display_width, aoe.settings.display_height);
	
};