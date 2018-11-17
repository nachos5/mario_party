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

Player.prototype.update = function (du) {
    // we only emit our player to the server!
    if (this.my_player) {
      //this.socket_id = networkManager.player_info.socket_id;
      //this.uuid = networkManager.player_info.uuid;
      // emit players position to the server
      networkManager.emit("update_player", this);

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
