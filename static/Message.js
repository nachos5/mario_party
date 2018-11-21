// ===========
// CONSTRUCTOR
// ===========

function Message(descr) {
    
    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.msg = new PopUp({
      offsetTop   : this.offsetTop,
      offsetRight : this.offsetRight,
      offsetBot   : this.offsetBot,
      offsetLeft  : this.offsetLeft,
      word        : this.string,
      textLines   : this.lines,
      p1SpriteID  : this.p1SpriteID,
    });

    this.timer = new Timer(this.time);
    this.timer.startTimer();

    if (this.extra) {
        let room = stateManager.game_room;

        this.extraCx = room.diceRoomLeft + room.diceRoomWidth/6;
        this.extraCy = room.diceRoomTop + room.diceRoomHeight/2;

        this.extraScaleX = (room.brickWidth  * 2) / this.extra.width;
        this.extraScaleY = (room.brickHeight * 2) / this.extra.height;

        this.extraRotation = Math.PI/4;
    }
}

// ======
// UPDATE
// ======

Message.prototype.update = function() {
    if (this.timer.isTimeUp) {
        return -1;
    }
};

// ======
// RENDER
// ======

Message.prototype.render = function(ctx) {
    this.msg.render(ctx);
    if (this.extra) {
        this.extra.drawCentredAt(ctx, this.extraCx, this.extraCy, this.extraRotation, this.extraScaleX, this.extraScaleY);
    }
};

// ==============
// DYNAMIC RENDER
// ==============

Message.prototype.dynamicRender = function(ctx) {
    this.msg.dynamicRender(ctx);
};

// =============
// STATIC RENDER
// =============

Message.prototype.staticRender = function(ctx) {
    this.msg.staticRender(ctx);
};