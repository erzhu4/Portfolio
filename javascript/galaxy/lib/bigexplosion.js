(function () {
  if (typeof Galaxy === "undefined") {
    window.Galaxy = {};
  }


	var BigExplosion = Galaxy.BigExplosion = function (pos, game) {
		this.game = game;
		this.pos = pos;
		this.sprite = new Image();
		this.sprite.src = "./images/bigexplosion.gif";
		this.dem = 80;
	};

	BigExplosion.prototype.move = function () {
		if (this.dem > 640) {
			this.sprite.src = "";
		} else {
			this.dem += 70;
			this.pos[0] -= 35;
			this.pos[1] -= 35;
		}
	};

	BigExplosion.prototype.draw = function (ctx) {
		ctx.drawImage(this.sprite, this.pos[0], this.pos[1], this.dem, this.dem);
	};

	BigExplosion.prototype.isCollidedWith = function (obj) {
		return false;
	};


 })();
