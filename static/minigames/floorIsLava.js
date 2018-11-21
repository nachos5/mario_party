// template
let floorIsLava = {};

floorIsLava.init = function() {
  this.game = {
    rules_string: 'FLOOR IS LAVA ',
    rules_running: false,
    rules_iter: 0,
    win_running: false,
    win_iter: 0,

    gameFloor: 0,

    placement: {
      1: null,
    },

    init: function() {
        this.players = minigameManager.getPlayers();
        this.my_player = minigameManager.my_player;
        this.no_players = Object.keys(this.players).length;

        this.gameFloor = new Floor({
            my_player : this.my_player,
        }); 

        this.unregister();
        this.register();
        this.rules(g_ctx, true);
    },

    unregister: function() {
        this.my_player.KEY_JUMP = null;

    },

    register: function() {
        this.my_player.KEY_UP   = 'W'.charCodeAt(0);
        this.my_player.KEY_DOWN = 'S'.charCodeAt(0);
    },

    rules: function(ctx, init=false) {
      if (init) {
        minigameManager.newRulesPopup(this.rules_string, 4);
        this.rules_running = true;
        this.rules_iter = 400;
      }

      this.rules_iter--;
      if (this.rules_iter === 0) {
        this.rules_running = false;
        minigameManager.rules_popup = null;
      }
    },

    preset: function() {

    },

    checkForWin: function() {
      // condition is met => this.win(g_ctx, true);
    },

    win: function(ctx, init=false) {
      if (init) {
        this.sortByPlacement();
        minigameManager.winningPopup();
        this.win_iter = 400;
        this.win_running = true;
      }

      this.win_iter--;
      if (this.win_iter === 0) {
        minigameManager.winning_popup = null;
        this.cleanup();
      }
    },

    sortByPlacement: function() {
      /*this.players.sort(function(x, y) {
        return ...;
      });*/
    },

    // we call this at the end of the minigame
    cleanup: function() {
        // Reassign old controls
        this.my_player.KEY_JUMP = ' '.charCodeAt(0);

        minigameManager.endMinigame();
    },

    update: function(du) {

        if (!this.have_winner && !this.rules_running) {

            let status = this.gameFloor.update(du);
            if (status === -1) console.log("i'am dead")
        }
        this.checkForWin();
    },

    render: function(ctx) {

        if (!this.have_winner && !this.rules_running) {
            this.gameFloor.render(ctx);
        }

      // --- show rules --- //
      if (this.rules_running) {
        this.rules(ctx);
      }

      // --- show winning stuff --- //
      if (this.win_running) {
        this.win(ctx);
      }

    }
  }

}
