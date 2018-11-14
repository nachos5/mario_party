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

    // Victory blocks variables
    this.width  = 1 + mapWidth;
    this.height = mapHeight/4;

    this.victoryTop   =  1 + mapBot - mapHeight/4;
    this.victoryRight = mapRight;
    this.victoryBot   = mapBot - this.height / 3;
    this.victoryLeft  = mapLeft;

    this.blockW = this.width/14;
    this.blockH = this.height/3;

    this.scale = 1;

    // Popup Window
    this.popup = new PopUp(true);

    this.popup.popUpTop   = mapTop   + mapHeight * 0.15;
    this.popup.popUpRight = mapRight - mapLeft * 0.55;
    this.popup.popUpBot   = mapBot   - mapHeight * 0.58;
    this.popup.popUpLeft  = mapLeft  + mapLeft * 0.55;

    this.popup.backWidth  = mapWidth/19;
    this.popup.backHeight = mapHeight/18.2;

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
    this.popup.render(ctx);

    g_sprites.marioPodium.drawTopLeftFixed(ctx, this.victoryLeft, this.victoryTop, 0, this.scale, this.scale, this.width, this.height);
    
    // Places
    g_numberSprites.num1.drawClipCentredAtFixed(ctx, this.victoryLeft + this.blockW * 6.5, this.victoryTop + this.blockH * 0.5, 0, this.blockW * 0.6, this.blockH * 0.6);

    g_alphSprites.S.drawClipCentredAtFixed(ctx, this.victoryLeft + this.blockW * 7.25, this.victoryTop + this.blockH * 0.6, 0, this.blockW * 0.3, this.blockH * 0.3);
    g_alphSprites.T.drawClipCentredAtFixed(ctx, this.victoryLeft + this.blockW * 7.5, this.victoryTop + this.blockH * 0.6, 0, this.blockW * 0.3, this.blockH * 0.3);

    g_numberSprites.num2.drawClipCentredAtFixed(ctx, this.victoryLeft + this.blockW * 4.5, this.victoryTop + this.blockH * 1.5, 0, this.blockW * 0.6, this.blockH * 0.6);
    g_numberSprites.num3.drawClipCentredAtFixed(ctx, this.victoryLeft + this.blockW * 8.5, this.victoryTop + this.blockH * 1.5, 0, this.blockW * 0.6, this.blockH * 0.6);
};