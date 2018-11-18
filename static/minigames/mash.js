// mash spacebar

const mash = {

  minSpeed: 5,
  speed: 5, // more mashing -> more speed

  // keys are placement seatings, values are player ids
  placements: {
    1: null,
  },

  init: function() {
    this.players = minigameManager.getPlayers();
    this.my_player = minigameManager.my_player;
    this.no_players = Object.keys(this.players).length;

    this.finishLine = {
      sprite: g_sprites.finishLine,
      cx: minigameManager.popup.innerLeft + minigameManager.popup.innerWidth/2,
      cy: minigameManager.popup.innerTop + minigameManager.popup.innerHeight/8,
    };

    this.unregister();
    this.register();
    this.lanes();
  },

  unregister: function() {
    this.my_player.KEY_JUMP = null;
    this.my_player.KEY_LEFT = null;
    this.my_player.KEY_RIGHT = null;
  },

  register: function() {
    this.KEY_MASH = ' '.charCodeAt(0);
    this.my_player.mash = true;
  },

  preset: function() {

  },

  lanes: function() {
    // width of each lane
    const lane_width = minigameManager.popup.innerWidth / this.no_players;
    // center of the first lane
    let start_pos = minigameManager.popup.innerLeft + lane_width/2;
    // move players to lanes
    let index = 1;
    for (let key in this.players) {
      const obj = this.players.find(obj => obj.id === index)
      obj.cx = start_pos;
      // next lane
      start_pos += lane_width;
      index++;
    };
  },

  // we check in the update loop whether someone has reached the finish line
  checkForWin: function() {
    for (let key in this.players) {
      if (this.players[key].cy <= this.finishLine.cy)
        this.cleanup();
    }
  },

  // we check cy values to determine seatings
  sortByPlacement: function() {
    this.players.sort(function(x, y) {
      return x.cy - y.cy;
    });

    let index = 1;
    for (let key in this.players) {
      this.placements[index] = this.players[key].id;
      index++;
    };
  },

  // we call this at the end of the minigame
  cleanup: function() {
    this.sortByPlacement();

    this.KEY_MASH = null;
    this.my_player.mash = false;
    this.my_player.KEY_JUMP = ' '.charCodeAt(0);
    this.my_player.KEY_LEFT = 'A'.charCodeAt(0);
    this.my_player.KEY_RIGHT = 'D'.charCodeAt(0);

    minigameManager.endMinigame();
  },

  updateIter: 0, // used for resetting speed
  update: function(du) {
    if (eatKey(this.KEY_MASH)) {
      this.my_player.cy -= this.speed;
      this.speed += 0.55; // gain speed for each mash
      this.updateIter = 0;
    } else {
      // we lose speed
      this.updateIter++;
      // if we wait for too long we go back to the original speed
      if (this.updateIter === 100)
        this.speed = this.minSpeed;
    }

    this.checkForWin();
  },

  render: function(ctx) {
    const fl = this.finishLine;
    fl.sprite.drawCentredAtFixed(ctx, fl.cx, fl.cy, 0, minigameManager.popup.innerWidth, fl.sprite.height/1.5);
  }

}
