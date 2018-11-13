// ===========
// CONSTRUCTOR
// ===========

function PopUp(descr) {
    // Calculation variables
    let mapTop   = mapManager.mapTop;
    let mapRight = mapManager.mapRight;
    let mapBot   = mapManager.mapBot;
    let mapLeft  = mapManager.mapLeft;

    let mapWidth  = mapManager.mapWidth;
    let mapHeight = mapManager.mapHeight;

    // Popup box variables
    this.popUpTop   = mapTop   + mapHeight/3;
    this.popUpRight = mapRight - mapLeft * 0.4;
    this.popUpBot   = mapBot   - mapHeight/3;
    this.popUpLeft  = mapLeft  + mapLeft * 0.4;

    this.width  = mapWidth/16;
    this.height = mapHeight/16;

    this.midXOffset = -1 + this.width;
    this.midYOffset = -1 + this.height;
    
    let starCost = eventManager.star_cost;
    this.digit1 = Math.floor(starCost / 10);
    this.digit2 = starCost % 10;

    // Animation
    this.coinIter = 0;
    this.coinFrame = 0;


    // Yes button
    this.buttonYes = new Button({
        cx:         this.popUpRight - 1.5 * (this.width * 2.5/2),
        cy:         this.popUpBot   - 1.5 * this.height,
        width:      this.width * 2.5,
        height:     this.height * 2,
        onSprite:   g_sprites.greenYes,
        offSprite:  g_sprites.cyanYes,
    });

    // No button
    this.buttonNo = new Button({
        cx:         this.popUpLeft + 1.5 * (this.width * 2.5/2),
        cy:         this.popUpBot   - 1.5 * this.height,
        width:      this.width * 2.5,
        height:     this.height * 2,
        onSprite:   g_sprites.greenNo,
        offSprite:  g_sprites.cyanNo,
    });

}

// ==========
// PROPERTIES
// ==========

PopUp.prototype = new Entity();

PopUp.prototype.isReady = false;

// ==========
// GET RADIUS
// ==========

PopUp.prototype.getRadius = function () {
    return this.width * 0.4;
};

// =================
// RESOLVE COLLISION
// =================

PopUp.prototype.resolveCollision = function () {

};

// ======
// UPDATE
// ======

PopUp.prototype.update = function(du) {

    if (g_useAnimation) {
        // Coin animation
        // Swap frames every 10th frame
        if (this.coinIter % 6 == 0) {
            this.coinFrame += 1;
        }
        this.coinIter++;
        // Restart
        if(this.coinIter === 30) {
            this.coinFrame = 0;
            this.coinIter = 0;
        };
    }    
};

// ======
// RENDER
// ======

PopUp.prototype.render = function(ctx) {

        // Background
        g_sprites.background2.drawTopLeftFixed(ctx, this.popUpLeft, this.popUpTop - (this.height * 0.75), 0,1,1, this.width*11, this.height*6.3);
        g_sprites.buyStarText.drawTopLeftFixed(ctx, this.popUpLeft + this.width, this.popUpTop, 0,1,1, this.width*8, this.height*2);

        // Star cost
        g_numberSprites['num'+[this.digit1]].drawClipTopLeftFixed(ctx, this.popUpLeft + this.width * 3.5, this.popUpTop + this.height * 0.95, 0, this.width, this.height, 1,1);
        g_numberSprites['num'+[this.digit2]].drawClipTopLeftFixed(ctx, this.popUpLeft + this.width * 4.4, this.popUpTop + this.height * 0.95, 0, this.width, this.height, 1,1);

        g_aniSprites.coin[this.coinFrame].drawClipTopLeftFixed(ctx, this.popUpLeft + this.width * 5.5, this.popUpTop + this.height * 1.05, 0, this.width * 0.8, this.height * 0.8, 1,1);

        // Framing
        // Top side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpLeft + (this.width * 0.15) + 1, this.popUpTop - (this.height * 0.75), -Math.PI/2, this.width, this.height, 1);
        
        let t = 1;
        while(this.popUpLeft + (this.width * 0.15) + this.midXOffset * (t+1) < this.popUpRight) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.popUpLeft + (this.width * 0.15) + this.midXOffset * t, this.popUpTop - (this.height * 0.75), Math.PI/2, this.width, this.height);
            t++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpLeft + (this.width * 0.15) + (this.midXOffset * t), this.popUpTop - (this.height * 0.75), Math.PI/2, this.width, this.height);


        // Bot side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpLeft + (this.width * 0.15) + 1, this.popUpBot + (this.height * 0.3), -Math.PI/2, this.width, this.height, 1);

        let b = 1;
        while(this.popUpLeft + (this.width * 0.15) + this.midXOffset * (b+1) < this.popUpRight) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.popUpLeft + (this.width * 0.15) + this.midXOffset * b, this.popUpBot + (this.height * 0.3), Math.PI/2, this.width, this.height);
            b++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpLeft + (this.width * 0.15) + (this.midXOffset * b), this.popUpBot + (this.height * 0.3), Math.PI/2, this.width, this.height);


        // Right side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpRight, this.popUpTop, 0, this.width, this.height);
        
        let r = 1;
        while(this.popUpTop + this.midYOffset * (r+1) < this.popUpBot) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.popUpRight, this.popUpTop + this.midYOffset * r, 0, this.width, this.height);
            r++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpRight, this.popUpTop + (this.midYOffset * r) - 1, 0, this.width, this.height, 2);


        // Left side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpLeft, this.popUpTop, 0, this.width, this.height);
        
        let l = 1;
        while(this.popUpTop + this.midYOffset * (l+1) < this.popUpBot) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.popUpLeft, this.popUpTop + this.midYOffset * l, 0, this.width, this.height);
            l++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.popUpLeft, this.popUpTop + (this.midYOffset * l) - 1, 0, this.width, this.height, 2);

        // Buttons
        this.buttonYes.render(ctx);
        this.buttonNo.render(ctx);
};