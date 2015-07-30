(function () {
  if (typeof Galaxy === "undefined") {
    window.Galaxy = {};
  }

  var Game = Galaxy.Game = function () {
    this.Galaxy = [];
    this.bullets = [];
    this.ships = [];
    this.explosions = [];
    this.numEnemies = 10;
    this.addEnemies();
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 400;
  Game.DIM_Y = 600;
  Game.FPS = 32;

  Game.prototype.add = function (object) {
    if (object instanceof Galaxy.Enemy) {
      this.Galaxy.push(object);
    } else if (object instanceof Galaxy.Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Galaxy.Ship) {
      this.ships.push(object);
    } else {
      throw "um";
    }
  };

  Game.prototype.addEnemies = function () {
    for (var i = 0; i < this.numEnemies; i++) {
      this.add(new Galaxy.Enemy({ game: this }));
    }
  };

  Game.prototype.addShip = function () {
    var ship = new Galaxy.Ship({
      pos: [Galaxy.Game.DIM_X/2, -550],
      game: this
    });

    this.ships.push(ship);
    return ship;
  };

  Game.prototype.addExplosion = function (pos) {
  	if (this.explosions.length > 8){
  		this.explosions.shift(1);
  	}
  	this.explosions.push(new Galaxy.Explosion(pos, this))
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.ships, this.Galaxy, this.bullets, this.explosions);
  };

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allObjects().forEach(function (obj1) {
      game.allObjects().forEach(function (obj2) {
        if (obj1 == obj2) {
          return;
        }
        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function () {
    if(this.ships[0]){
      if (this.ships[0].pos[0] > Galaxy.Game.DIM_X - 20) {
        this.ships[0].vel = [0,0];
        this.ships[0].pos[0] -= 1;
      }
      if (this.ships[0].pos[0] < 20) {
        this.ships[0].vel = [0,0];
        this.ships[0].pos[0] += 1;
      }
      this.allObjects().forEach(function (object) {
        object.move();
      });
    }
  };



  Game.prototype.remove = function (object) {
    if (object instanceof Galaxy.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Galaxy.Enemy) {
      var idx = this.Galaxy.indexOf(object);
      this.Galaxy[idx] = new Galaxy.Enemy({ game: this });
    } else if (object instanceof Galaxy.Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "um";
    }
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.wrap = function (pos) {
    return [
      wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
    ];

    function wrap(coord, max) {
      if (coord < 0) {
        return max - (coord % max);
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  };
})();
