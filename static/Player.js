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
    this.myTurn = false;
    this.isReady = false;
    this.spriteID = 0;


    // ==== New TableTopPlayer ==== //
    this.tt_player = new TableTopPlayer({
        id       : this.player_id,   // Id of the player
        sprite   : g_playerSprites[this.spriteID].sp,
    });

    // ==== New EventPlayer ==== //
    this.eventPlayer = new EventPlayer({
        id       : this.player_id,   // Id of the player
        sprite   : g_playerSprites[this.spriteID].sp,
    });
};

// =======
// REFRESH
// =======

Player.prototype.refresh = function() {
    this.eventPlayer.sprite = g_playerSprites[this.spriteID].sp;
    this.tt_player.sprite = g_playerSprites[this.spriteID].sp;
    this.isSelectedSprite = true;
};

// ======
// UPDATE
// ======

Player.prototype.update = function (du) {

    // we only emit our player to the server!
    if (this.my_player) {
      // emit players position to the server
      networkManager.emit("update_player", this);

      this.tt_player.update(du);
      if (g_startGame) this.eventPlayer.update(du);
    }
};

// ======
// RENDER
// ======

Player.prototype.render = function (ctx) {
    this.tt_player.render(ctx);     // TableTopPlayer
    this.eventPlayer.render(ctx);   // EventPlayer
};
