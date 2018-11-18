// mash spacebar

const mash = {

  placement: {
    1: null,
  },

  init: function() {
    this.players = minigameManager.getPlayers();
    this.my_player = minigameManager.my_player;

    this.unregister();
    this.register();
  },

  unregister: function() {
    this.my_player.KEY_JUMP = null;
    this.my_player.KEY_LEFT = null;
    this.my_player.KEY_RIGHT = null;
    this.my_player.backup = this.my_player.accel;
    this.my_player.accel = null;
  },

  register: function() {
    this.KEY_MASH = ' '.charCodeAt(0);
  },

  preset: function() {

  },

  // we call this at the end of the minigame
  cleanup: function() {
    this.my_player.KEY_JUMP = ' '.charCodeAt(0);
    this.my_player.KEY_LEFT = 'A'.charCodeAt(0);
    this.my_player.KEY_RIGHT = 'D'.charCodeAt(0);
    this.my_player.accel = this.my_player.backup;
  },

  update: function(du) {
    if (eatKey(this.KEY_MASH)) {
      this.my_player.cy -= 5;
    }
  },

  render: function(ctx) {

  }

}
