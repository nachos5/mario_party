// template
let template = {};

template.init = function {
  this.game = {
    rules_string: "",
    rules_running: false,
    rules_iter: 0,
    win_running: false,
    win_iter: 0,

    placement: {
      1: null,
    },

    init: function() {
      this.players = minigameManager.getPlayers();
      this.my_player = minigameManager.my_player;
      this.no_players = Object.keys(this.players).length;

      this.unregister();
      this.register();
      this.rules(g_ctx, true);
    },

    unregister: function() {

    },

    register: function() {

    },

    rules: function(ctx, init=false) {
      if (init) {
        minigameManager.newRulesPopup();
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
      minigameManager.endMinigame();
    },

    update: function(du) {
      this.checkForWin();
    },

    render: function(ctx) {
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
