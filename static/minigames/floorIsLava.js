// template
let floorIsLava = {};

floorIsLava.init = function() {
  this.game = {
    name: 'floor is lava',
    rules_string: 'FLOOR IS LAVA ',
    rules_running: false,
    rules_iter: 0,
    win_running: false,
    win_iter: 0,
    i_am_dead: false,

    gameFloor: 0,

    placements: {},

    init: function() {
        this.players = minigameManager.getPlayers();
        this.my_player = minigameManager.my_player;
        this.no_players = Object.keys(this.players).length;
        this.placement_index = this.no_players;

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
      }

      // all players are ready
      if (minigameManager.minigame_ready) {
        audioManager.fadeOutPlayNext('minigame', 0.2);
        this.rules_running = false;
        spatialManager.unregister(minigameManager.rules_popup.button);
        minigameManager.rules_popup = null;
        minigameManager.minigame_ready = false;
      }
    },

    preset: function() {

    },

    checkForWin: function() {
      if (Object.keys(this.placements).length == this.players.length) {
        this.win(g_ctx, true);
        this.have_winner = true;
      };
    },

    win: function(ctx, init=false) {
      if (init) {
        minigameManager.rewards();
        this.win_iter = 400;
        this.win_running = true;
      }

      this.win_iter--;
      if (this.win_iter === 0) {
        minigameManager.winning_popup = null;
        this.cleanup();
      }
    },

    addToPlacements: function(player_id) {
      const player = entityManager._players.find(obj => obj.player_id == player_id).eventPlayer;
      this.placements[this.placement_index] = player.id;
      this.placement_index--;
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
          // if dead
          if (status === -1 && !this.i_am_dead) {
            this.i_am_dead = true;
            audioManager.playAndEmit("burn", 0, false, 0.75);
            networkManager.emit('add_to_placements_lava', this.my_player.id);
            this.addToPlacements(this.my_player.id);
            this.my_player.changeRoom(0);
          }
      this.checkForWin();
      }
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
