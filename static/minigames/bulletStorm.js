// Dodge bullet bill
let bulletStorm = {};

bulletStorm.init = function() {
  this.game = {
    rules_string: "MINIGAME RULES/MASH SPACEBAR TO REACH/THE FINISH LINE",
    //'DODGE BULLET BILL/LAST ONE ALIVE WINS',
    rules_running: false,
    rules_iter: 0,
    win_running: false,
    win_iter: 0,

    timers: [],
    timer10: 0,
    bulletBills: [],
    level: 0,

    placement: {
      1: null,
    },

    init: function() {
      this.players = minigameManager.getPlayers();
      this.my_player = minigameManager.my_player;
      this.no_players = Object.keys(this.players).length;

      this.timer10 = new Timer(10);
      this.timer10.startTimer();

      this.level = 0;

      this.timers = [
        new Timer(5),
        new Timer(4),
        new Timer(3),
        new Timer(2),
        new Timer(1),
      ]
      console.log(this.timers)

      this.timers.forEach(function(item){
	      item.startTimer();
      });

      if (this.my_player.player_id == 1) {
        networkManager.emit('generate_bullets');
        this.generateBulletBill();
        this.generateBulletBill();
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
        this.rules_running = false;
        spatialManager.unregister(minigameManager.rules_popup.button);
        minigameManager.rules_popup = null;
        minigameManager.minigame_ready = false;
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

    generateBulletBill: function() {
      this.bulletBills.push(new BulletBill());
    },

    nextLevel: function() {
      if (this.timers.length - 1 === this.level) return;
      this.level++;
    },

    update: function(du) {

      // Next level
      if (this.timer10.isTimeUp) {
        this.timer10.startTimer();
        this.nextLevel();
      }

      // Spawn bullet bill
      if (this.timers[this.level].isTimeUp) {
        this.generateBulletBill();
        this.timers[this.level].startTimer();
      }

      this.bulletBills.forEach((item, index) => {
        let status = item.update(du);
        if (status === -1) {
          spatialManager.unregister(this.bulletBills[index]);
          this.bulletBills.splice(index, 1);
        }
      });

      this.checkForWin();
    },

    render: function(ctx) {

      this.bulletBills.forEach(function(item){
	      item.render(ctx);
      });

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
