// ===========
// CONSTRUCTOR
// ===========

function Player(descr) {

    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }

    // New TableTopPlayer
    this.tt_player = new TableTopPlayer({
        id       : this.player_id,   // Id of the player
        sprite   : g_playerSprites[this.spriteID].sp,
    });

    //entityManager._ttplayers.push(this.tt_player); // store in entity manager

    // New EventPlayer
    this.eventPlayer = new EventPlayer({
        id       : this.player_id,   // Id of the player
        sprite   : g_playerSprites[this.spriteID].sp,
    });
};

// ==========
// PROPERTIES
// ==========

Player.prototype.stars = 0;
Player.prototype.myTurn = false;

Player.prototype.spriteID = 0;

Player.prototype.isSelectedSprite = false;

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

    this.tt_player.spriteID = this.spriteID;
    this.eventPlayer.spriteID = this.spriteID;

    // we only emit our player to the server!
    if (this.my_player) {
      // emit players position to the server
      networkManager.emit("update_player", this);

      this.tt_player.update(du);
      this.eventPlayer.update(du);
    }
};

// ======
// RENDER
// ======

Player.prototype.render = function (ctx) {
    this.tt_player.render(ctx);     // TableTopPlayer
    this.eventPlayer.render(ctx);   // EventPlayer
};
