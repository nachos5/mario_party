// ===========
// CONSTRUCTOR
// ===========

function Victory() {
    // Calculation variables
    let mapTop   = mapManager.mapTop;
    let mapRight = mapManager.mapRight;
    let mapBot   = mapManager.mapBot;
    let mapLeft  = mapManager.mapLeft;

    let mapWidth  = mapManager.mapWidth;
    let mapHeight = mapManager.mapHeight;

    // ================
    // PODIUM VARIABLES
    // ================

    this.top   = mapBot - mapHeight * 0.25;
    this.right = mapRight;
    this.bot   = mapBot;
    this.left  = mapLeft;

    this.width  = mapWidth;
    this.height = this.bot - this.top;

    this.podium = g_sprites.marioPodium;

    this.podiumScaleX = mapWidth / this.podium.width;
    this.podiumScaleY = this.height / this.podium.height;

    this.podiumWidth  = this.podiumScaleX * this.podium.width;
    this.podiumHeight = this.podiumScaleY * this.podium.height;

    this.cx = mapLeft  + mapWidth/2;
    this.cy = this.bot - this.podiumHeight/2;

    this.blockWidth  = this.podiumWidth  / 14;
    this.blockHeight = this.podiumHeight / 3;

    // ===============
    // OTHER VARIABLES
    // ===============

    this.numberScaleX = (this.blockWidth  * 0.4) / g_numberSprites.num0.clipWidth;
    this.numberScaleY = (this.blockHeight * 0.4) / g_numberSprites.num0.clipHeight;

    this.numberWidth  = this.numberScaleX * g_numberSprites.num0.clipWidth;
    this.numberHeight = this.numberScaleY * g_numberSprites.num0.clipHeight;

    // Offset values are based on mapHeight and mapWidth
    this.victoryPopUp = new PopUp({
        offsetTop   : 0.1,
        offsetRight : 0.02,
        offsetBot   : 0.5,
        offsetLeft  : 0.02,
    });

    this.victoryPopUp.setPreset('victory');

    //this.popup.sprite = g_sprites.die0;
}

// ==========
// PROPERTIES
// ==========



// ======
// UPDATE
// ======

Victory.prototype.update = function(du) {
    return -1;
};

// ======
// RENDER
// ======

Victory.prototype.render = function(ctx) {
    this.victoryPopUp.render(ctx);

    if (g_useSpriteBox) this.renderSpriteBox(ctx);
};

// ==============
// DYNAMIC RENDER
// ==============

Victory.prototype.dynamicRender = function(ctx) {
    this.victoryPopUp.dynamicRender(ctx);
};

// =============
// STATIC RENDER
// =============

Victory.prototype.staticRender = function(ctx) {
    this.victoryPopUp.staticRender(ctx);

    this.podium.drawCentredAt(ctx, this.cx, this.cy, 0, this.podiumScaleX, this.podiumScaleY);
    
    // Places
    g_numberSprites.num1.drawClipCentredAt(ctx, this.left + this.blockWidth * 6.5, this.bot - this.blockHeight * 2.5, 0, this.numberScaleX, this.numberScaleY);
    g_numberSprites.num2.drawClipCentredAt(ctx, this.left + this.blockWidth * 4.5, this.bot - this.blockHeight * 1.5, 0, this.numberScaleX, this.numberScaleY);
    g_numberSprites.num3.drawClipCentredAt(ctx, this.left + this.blockWidth * 8.5, this.bot - this.blockHeight * 1.5, 0, this.numberScaleX, this.numberScaleY);
};

Victory.prototype.renderSpriteBox = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.left, this.top);    // Top-left corner

    // Top line
    ctx.lineTo(this.right, this.top);
    ctx.stroke();

    // Right line
    ctx.lineTo(this.right, this.bot);
    ctx.stroke();

    // Bot line
    ctx.lineTo(this.left, this.bot);
    ctx.stroke();

    // Left line
    ctx.lineTo(this.left, this.top);
    ctx.stroke();

    ctx.closePath();
};