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

    this.timer5 = new Timer(5);
    this.timer5.startTimer();
}

// ======
// UPDATE
// ======

Message.prototype.update = function() {
    if (this.timer5.isTimeUp) {
        return -1;
    }
};

// ======
// RENDER
// ======

Message.prototype.render = function() {
    this.msg.render(ctx);
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