// ===========
// CONSTRUCTOR
// ===========

function Player(descr) {

    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }

    // New TableTopPlayer
    this.tt_player = new TableTopPlayer(this.player_id);
    entityManager._ttplayers.push(this.tt_player); // store in entity manager

    this.sprite = this.tt_player.sprite;
    this.spriteID = this.player_id;

    // New EventPlayer
    this.eventPlayer = new EventPlayer(this.player_id);
    this.eventPlayer.sprite = this.tt_player.sprite;
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

      this.eventPlayer.update(du);
    }
};

// ==========
// GET RADIUS
// ==========

Player.prototype.getRadius = function () {
    return this.sprite.clipWidth * 0.9;
};

// ======
// RENDER
// ======

Player.prototype.render = function (ctx) {
    this.tt_player.render(ctx);     // TableTopPlayer
    this.eventPlayer.render(ctx);   // EventPlayer
};
