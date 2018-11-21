// ===========
// CONSTRUCTOR
// ===========

function Player(descr) {

    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }

    // ==========
    // PROPERTIES
    // ==========

    this.stars = 0;
    this.coins = 0;
    this.minigames_won = 0;
    this.myTurn = false;
    this.isReady = false;


    // ==== New TableTopPlayer ==== //
    this.tt_player = new TableTopPlayer({
        id       : this.player_id,   // Id of the player
        sprite   : g_playerSprites[this.spriteID].sp,
        name     : g_playerSprites[this.spriteID].name,
    });

    // ==== New EventPlayer ==== //
    this.eventPlayer = new EventPlayer({
        id       : this.player_id,   // Id of the player
        sprite   : g_playerSprites[this.spriteID].sp,
    });
};

// =======
// VICTORY
// =======

Player.prototype.victory = function(cx, cy) {
    this.tt_player.victory(cx, cy);
};

// =======
// REFRESH
// =======

Player.prototype.refresh = function() {
    this.eventPlayer.sprite = g_playerSprites[this.spriteID].sp;
    this.tt_player.sprite = g_playerSprites[this.spriteID].sp;
    this.tt_player.name = g_playerSprites[this.spriteID].name;
};

// ======
// UPDATE
// ======

Player.prototype.updateIter = 0;
Player.prototype.update = function (du) {
    // stuff we don't want to update every single frame
    if (this.updateIter === 50) {
      this.refresh();
      this.updateIter = -1;
    }
    this.updateIter++;

    // we only emit our player to the server!
    if (this.my_player) {
      // emit players position to the server
      networkManager.emit("update_player", this);
      if (g_startGame && !g_gameOver) this.eventPlayer.update(du);
    }

    this.tt_player.update(du);
};

// ======
// RENDER
// ======

Player.prototype.render = function (ctx) {
    if (!minigameManager.minigame_is_running) {
      this.tt_player.render(ctx);     // TableTopPlayer
    }
    this.eventPlayer.render(ctx);   // EventPlayer
};
