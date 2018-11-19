// ===========
// CONSTRUCTOR
// ===========

function Victory(players) {
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

    this.first      = {cx : this.left + this.blockWidth * 6.5, cy : this.bot - this.blockHeight * 3}; 
    this.second     = {cx : this.left + this.blockWidth * 4.5, cy : this.bot - this.blockHeight * 2};
    this.third      = {cx : this.left + this.blockWidth * 8.5, cy : this.bot - this.blockHeight * 2};
    this.otherLeft  = {cx : this.left + this.blockWidth, cy : this.bot - this.blockHeight};
    this.otherRight = {cx : this.right + this.blockWidth, cy : this.bot - this.blockHeight};

    // ===============
    // OTHER VARIABLES
    // ===============

    this.numberScaleX = (this.blockWidth  * 0.4) / g_numberSprites.num0.clipWidth;
    this.numberScaleY = (this.blockHeight * 0.4) / g_numberSprites.num0.clipHeight;

    this.numberWidth  = this.numberScaleX * g_numberSprites.num0.clipWidth;
    this.numberHeight = this.numberScaleY * g_numberSprites.num0.clipHeight;

    // Text to display
    let textCoins    = 'PLAYER # ENDED UP WITH THE/MOST COINS AND GAINS *';
    let textMinigame = 'PLAYER # DID BEST IN MINIGAMES/AND GAINS *';
    let texttest     = 'GULL ER NOOB KANN EKKI/NETWORKING 10 *';

    this.victoryText = [textCoins, textMinigame, texttest];
    this.victoryPopUp = [];
    this.i = 0;

    this.generatePopUps();

    // Podium
    let placement = [
        this.first,
        this.second,
        this.third,
        this.otherLeft,
        this.otherRight
    ]

    for(let i = 0; i < players.length; i++) {
        players[i].victory(placement[i].cx, placement[i].cy - players[i].tt_player.getRadius());

        if (i > 2) {
            players[i].victory(placement[3].cx + this.blockWidth * (i-3), placement[3].cy - players[i].tt_player.getRadius());
        }
        if (i > 6) {
            players[i].victory(placement[4].cx - this.blockWidth * (i-7), placement[4].cy - players[i].tt_player.getRadius());
        }
    }
}

// ================
// GENERATE POP UPS
// ================

Victory.prototype.generatePopUps = function() {
    for(let i = 0; i < this.victoryText.length; i++) {
        this.victoryPopUp.push(new PopUp({
            offsetTop   : 0.1,
            offsetRight : 0.02,
            offsetBot   : 0.5,
            offsetLeft  : 0.02,
            word        : this.victoryText[i],
            pSpriteID   : entityManager._players[0].spriteID,
            textLines   : 3,
        }));
    }
};

// ===========
// NEXT POP UP
// ===========

Victory.prototype.nextPopUp = function() {
    this.i++;
    if (this.i === this.victoryPopUp.length) {
        this.i--;
        return -1;
    }
};

// ======
// UPDATE
// ======

Victory.prototype.update = function(du) {
};

// ======
// RENDER
// ======

Victory.prototype.render = function(ctx) {
    this.victoryPopUp[this.i].render(ctx);

    if (g_useSpriteBox) this.renderSpriteBox(ctx);
};

// ==============
// DYNAMIC RENDER
// ==============

Victory.prototype.dynamicRender = function(ctx) {
    this.victoryPopUp[this.i].dynamicRender(ctx);
};

// =============
// STATIC RENDER
// =============

Victory.prototype.staticRender = function(ctx) {
    this.victoryPopUp[this.i].staticRender(ctx);

    this.podium.drawCentredAt(ctx, this.cx, this.cy, 0, this.podiumScaleX, this.podiumScaleY);
    
    // Places
    g_numberSprites.num1.drawClipCentredAt(ctx, this.first.cx,  this.first.cy  + this.blockHeight * 0.5, 0, this.numberScaleX, this.numberScaleY);
    g_numberSprites.num2.drawClipCentredAt(ctx, this.second.cx, this.second.cy + this.blockHeight * 0.5, 0, this.numberScaleX, this.numberScaleY);
    g_numberSprites.num3.drawClipCentredAt(ctx, this.third.cx,  this.third.cy  + this.blockHeight * 0.5, 0, this.numberScaleX, this.numberScaleY);
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