// Adventures of Engine screen prototype

Screen = function (reference_key, background_image, grid_width, grid_height, floor_start_x, floor_start_y, starting_obs) {
	const S = aoe.settings;
	
	this.reference_key = reference_key;
	
	this.background_image = background_image;
	this.grid_width = grid_width;
	this.grid_height = grid_height;
	
	this.floor_start_x = floor_start_x;
	this.floor_start_y = floor_start_y;
	
	this.grid = {};
	this.extra_images = [];
	
	for (y = 0; y < grid_height; y += 1) {
		for (x = 0; x < grid_width; x += 1) {
			this.grid[x + "-" + y] = {
				"x": x,
				"y": y,
				"is_empty": true,
				"contents": false,
			}
		}
	}
};

Screen.prototype.add_extra_image = function (img_key, x, y) {
	this.extra_images.push({
		"img_key": img_key,
		"img": aoe.images[img_key],
		"x": x,
		"y": y,
	});
};

Screen.prototype.remove_extra_images_with_key = function (img_key) {
	this.extra_images = this.extra_images.filter((extra) => extra.img_key !== img_key);
};