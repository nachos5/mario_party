// ============
// EVENT PLAYER
// ============

// ===========
// CONSTRUCTOR
// ===========

function EventPlayer(id) {
    this.id = id;
    this.sprite = null;

    this.cx = null;
    this.cy = null;

    this.rotation = 0;

    this.width = null;
    this.height = null;
};

// ==========
// PROPERTIES
// ==========

EventPlayer.prototype = new Entity();

EventPlayer.prototype.KEY_UP     = 'W'.charCodeAt(0);
EventPlayer.prototype.KEY_DOWN   = 'S'.charCodeAt(0);
EventPlayer.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
EventPlayer.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// ======
// UPDATE
// ======

EventPlayer.prototype.update = function (du) {
    if (keys[this.KEY_UP]) {
        this.cy -= 5;
    }
    if (keys[this.KEY_DOWN]) {
        this.cy += 5;
    }
    if (keys[this.KEY_LEFT]) {
        this.cx -= 5;
    }
    if (keys[this.KEY_RIGHT]) {
        this.cx += 5;
    }
};

EventPlayer.prototype.rememberResets = function () {
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// =====
// RESET
// =====

EventPlayer.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
};

// ======
// RENDER
// ======

EventPlayer.prototype.render = function (ctx) {
    this.sprite.drawClipCentredAtFixed(ctx, this.cx, this.cy, this.rotation, this.width, this.height);
};