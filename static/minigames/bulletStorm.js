// Dodge bullet bill
let bulletStorm = {};

bulletStorm.init = function() {
  this.game = {
    rules_string: 'DODGE BULLET BILL/LAST ONE ALIVE WINS/     &',
    rules_running: false,
    rules_iter: 0,
    win_iter: 0,
    win_running: false,
    have_winner: false,

    // Game related
    timers: [],
    timer10: 0,
    timer20: 0,
    bulletBills: [],
    level: 0,

    placements: {},

    init: function() {
      this.players = minigameManager.getPlayers();
      this.my_player = minigameManager.my_player;
      this.no_players = Object.keys(this.players).length;
      this.placement_index = this.no_players;

      this.timer10 = new Timer(10);
      this.timer10.startTimer();
      this.timer20 = new Timer(20);
      this.timer20.startTimer();

      this.level = 0;

      this.timers = [
        new Timer(5),
        new Timer(4),
        new Timer(3),
        new Timer(2),
        new Timer(1),
      ]

      // Initalize timers
      this.timers.forEach(function(item){
	      item.startTimer();
      });

      if (this.my_player.player_id == 1) {
        networkManager.emit('generate_bullets');
        this.generateBulletBill(5);
      }

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
      // Put last player into dice room
      if (this.players[0].room !== 0 ) this.players[0].changeRoom(0);

      // Unregister all bullet bills from the spatial manager
      this.bulletBills.forEach((item) => {
        spatialManager.unregister(item);
      });

      // Restart player placement in mingames to default
      /*this.players.forEach(item => {
        item.place = -1;
      });*/

      minigameManager.endMinigame();
    },

    generateBulletBill: function(amount) {
      let random = networkManager.random;
      let random2 = networkManager.random2;

      for(let i = 0; i < random.length && i < amount; i++) {
        this.bulletBills.push(new BulletBill({
          random  : random[i],
          random2 : random2[i],
        }));
      }
    },

    nextLevel: function() {
      if (this.timers.length - 1 === this.level) return;
      this.level++;
    },

    update: function(du) {

      // --- Last one alive? --- //
      if (!this.have_winner && !this.rules_running) {

        // Next level
        if (this.timer10.isTimeUp) {
          this.timer10.startTimer();
          this.nextLevel();
        }

        // Spawn bullet bill
        if (this.timers[this.level].isTimeUp) {
          if (this.level === 4 && this.timer20.isTimeUp) {
            this.generateBulletBill(10);
          }
          else this.generateBulletBill(5);
          if (this.level === 4) this.timer20.startTimer();
          this.timers[this.level].startTimer();
        }

        // Update bullet bills and check for death
        this.bulletBills.forEach((item, index) => {
          let status = item.update(du);
          if (status === -1) {
            spatialManager.unregister(item);
            this.bulletBills.splice(index, 1);
          }
        });

        this.checkForWin();
      }
    },

    render: function(ctx) {

      // --- Last one alive? --- //
      if (!this.have_winner && !this.rules_running) {
        this.bulletBills.forEach(function(item){
          item.render(ctx);
        });
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
