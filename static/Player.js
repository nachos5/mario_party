// ===========
// CONSTRUCTOR
// ===========

function Player(descr) {

    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.spriteID = this.player_id;

    // New TableTopPlayer
    this.tt_player = new TableTopPlayer({
        id       : this.player_id,   // Id of the player
        spriteID : this.player_id,
    });

    //entityManager._ttplayers.push(this.tt_player); // store in entity manager

    // New EventPlayer
    this.eventPlayer = new EventPlayer({
        id       : this.player_id,   // Id of the player
        spriteID : this.player_id,
    });
};

// ==========
// PROPERTIES
// ==========

Player.prototype.stars = 0;
Player.prototype.myTurn = false;

// ======
// UPDATE
// ======

Player.prototype.update = function (du) {
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
