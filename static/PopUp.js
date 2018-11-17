// ===========
// CONSTRUCTOR
// ===========

function PopUp(descr) {

    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }

    // Calculation variables
    let mapTop = mapManager.mapTop;
    let mapRight = mapManager.mapRight;
    let mapBot = mapManager.mapBot;
    let mapLeft = mapManager.mapLeft;

    let mapWidth = mapManager.mapWidth;
    let mapHeight = mapManager.mapHeight;

    // Defining variable for the scale of everything
    const baseWidth  = mapWidth/16  * 0.6;      // 2/3 tileWidth
    const baseHeight = mapHeight/16 * 0.6;      // 2/3 tileHeight

    // ===============
    // POPUP VARIABLES
    // ===============

    this.top   = mapTop   + mapHeight * this.offsetTop;
    this.right = mapRight - mapWidth  * this.offsetRight;
    this.bot   = mapBot   - mapHeight * this.offsetBot;
    this.left  = mapLeft  + mapWidth  * this.offsetLeft;

    this.width  = this.right - this.left;
    this.height = this.bot   - this.top;

    // ================
    // RENDER VARIABLES
    // ================

    this.centerTop   = this.top   + baseHeight/2;
    this.centerRight = this.right - baseWidth/2;
    this.centerBot   = this.bot   - baseHeight/2;
    this.centerLeft  = this.left  + baseWidth/2;

    this.cx = this.left + this.width/2;
    this.cy = this.top  + this.height/2;

    // ==========
    // BACKGROUND
    // ==========

    this.backgroundSprite = g_sprites.background2;

    this.backgroundScaleX = this.width  / this.backgroundSprite.width;
    this.backgroundScaleY = this.height / this.backgroundSprite.height;

    // ==========
    // PIPE FRAME
    // ==========

    this.pipeScaleX = baseWidth  / g_sprites.framePipeTop.width;
    this.pipeScaleY = baseHeight / g_sprites.framePipeTop.height;

    this.pipeWidth  = g_sprites.framePipeTop.width * this.pipeScaleX;
    this.pipeHeight = g_sprites.framePipeTop.height * this.pipeScaleY;

    // Calculation variables
    let fillWidth  = this.width  - this.pipeHeight*2;
    let fillHeight = this.height - this.pipeHeight*2;

    // Number of mid pipes for width
    this.pipeWNo = fillWidth / this.pipeHeight;
    this.pipeWNo++;
    // Number of mid pipes for height
    this.pipeHNo = fillHeight / this.pipeHeight;
    this.pipeHNo--;

    // =====================
    // POPUP INNER VARIABLES
    // =====================

    this.innerTop   = this.top   + this.pipeHeight;
    this.innerRight = this.right - this.pipeWidth;
    this.innerBot   = this.bot   - this.pipeHeight;
    this.innerLeft  = this.left  + this.pipeWidth;

    this.innerWidth  = this.width  - this.pipeWidth  * 2;
    this.innerHeight = this.height - this.pipeHeight * 2;
};

// ==========
// PROPERTIES
// ==========

PopUp.prototype.isReady = false;

// ==========
// SET PRESET
// ==========

PopUp.prototype.setPreset = function(preset) {
    this.preset = preset;

    if (this.preset === 'menu') {

        // Variables that are created
        this.charSelection = [];
        this.logo = g_sprites.marioPartyLogo;
        this.button = null;

        // ====
        // LOGO
        // ====

        this.logoScaleX = this.width/2  / this.logo.width;
        this.logoScaleY = this.height/5 / this.logo.height;

        this.logoWidth  = this.logoScaleX * this.logo.width;
        this.logoHeight = this.logoScaleY * this.logo.height;

        this.logoCx = this.cx;
        this.logoCy = this.cy - this.logoHeight * 1.5;

        // ==========
        // CHARACTERS
        // ==========

        let charScaleX = this.width/10 / g_charSelectionSprites[0].sp.width;
        let charScaleY = this.height/4 / g_charSelectionSprites[0].sp.height;

        let charWidth  = g_charSelectionSprites[0].sp.width  * charScaleX;
        let charHeight = g_charSelectionSprites[0].sp.height * charScaleY;

        let charPadding = charWidth * 0.25;

        let charCx = this.left + this.pipeWidth  + charWidth/2 + charPadding;
        let charCy = this.bot  - this.pipeHeight - charHeight/2 - charPadding;

        // ======
        // BUTTON
        // ======

        let buttonScaleX = this.width/5  / g_sprites.greenReady.width;
        let buttonScaleY = this.height/4 / g_sprites.greenReady.height;

        let buttonWidth  = g_sprites.greenReady.width  * buttonScaleX;
        let buttonHeight = g_sprites.greenReady.height * buttonScaleY;

        let buttonCx = this.right - this.pipeWidth  - buttonWidth/2;
        let buttonCy = this.bot   - this.pipeHeight - buttonWidth/2;

        // Button
        this.button = new Button({
            cx: buttonCx,
            cy: buttonCy,

            width: buttonWidth,
            height: buttonHeight,

            scaleX: buttonScaleX,
            scaleY: buttonScaleY,

            onSprite: g_sprites.greenReady,
            offSprite: g_sprites.cyanReady,

            owner: 'menu',
        });

        // Lower row of characters
        for (let i = 0; i < 5; i++) {

            this.charSelection.push(new CharacterSelection({
                id : g_charSelectionSprites[i].id,
                sprite : g_charSelectionSprites[i].sp,

                cx: charCx + charWidth * i + charPadding * i,
                cy: charCy,

                width : charWidth,
                height: charHeight,

                scaleX: charScaleX,
                scaleY: charScaleY,

                owner: 'menu',
            }));
        };

        // Upper row of characters
        for (let i = 5; i < g_charSelectionSprites.length; i++) {

            this.charSelection.push(new CharacterSelection({
                id : g_charSelectionSprites[i].id,
                sprite : g_charSelectionSprites[i].sp,

                cx: charCx + charWidth * (i-5) + charPadding * (i-5),
                cy: charCy - charHeight - charPadding,

                width : charWidth,
                height: charHeight,

                scaleX: charScaleX,
                scaleY: charScaleY,

                owner: 'menu',
            }));
        };
    }
    if (preset === 'buyStar') {

        // Variables that are created
        this.textSprite = 0;
        this.buttonYes = null;
        this.buttonNo = null;
        this.coinFrame = 0;
        this.coinIter = 0;

        // ===========
        // TEXT SPRITE
        // ===========

        this.textSprite = g_sprites.buyStarText;

        this.textScaleX = (this.innerWidth  * 0.75) / this.textSprite.width;
        this.textScaleY = (this.innerHeight * 0.5) / this.textSprite.height;

        this.textWidth  = this.textScaleX * this.textSprite.width;
        this.textHeight = this.textScaleY * this.textSprite.height;

        // =========
        // STAR COST
        // =========

        let starCost = eventManager.star_cost;
        this.starDigit1 = Math.floor(starCost / 10);
        this.starDigit2 = starCost % 10;

        this.starScaleX = (this.innerWidth  * 0.08)/ g_numberSprites.num0.clipWidth;
        this.starScaleY = (this.innerHeight * 0.08) / g_numberSprites.num0.clipHeight;

        this.starWidth  = this.starScaleX * g_numberSprites.num0.clipWidth;
        this.starHeight = this.starScaleY * g_numberSprites.num0.clipHeight;

        // ======
        // BUTTON
        // ======

        let buttonScaleX = this.width/5  / g_sprites.greenYes.width;
        let buttonScaleY = this.height/4 / g_sprites.greenYes.height;

        let buttonWidth  = g_sprites.greenYes.width  * buttonScaleX;
        let buttonHeight = g_sprites.greenYes.height * buttonScaleY;

        // Yes button
        this.buttonYes = new Button({
            id:         'yes',

            cx:         this.innerRight - buttonWidth/2,
            cy:         this.innerBot - buttonHeight/2,

            width:      buttonWidth,
            height:     buttonHeight,

            scaleX: buttonScaleX,
            scaleY: buttonScaleY,

            onSprite:   g_sprites.greenYes,
            offSprite:  g_sprites.cyanYes,

            owner:      'buyStar'
        });

        // No button
        this.buttonNo = new Button({
            id:         'no',

            cx:         this.innerLeft + buttonWidth/2,
            cy:         this.innerBot - buttonHeight/2,

            width:      buttonWidth,
            height:     buttonHeight,

            scaleX: buttonScaleX,
            scaleY: buttonScaleY,

            onSprite:   g_sprites.greenNo,
            offSprite:  g_sprites.cyanNo,
            owner:      'buyStar'
        });
    }
    if (this.preset === 'victory') {
        // Variables that are created
        this.textSprite = 0;

        // ===========
        // TEXT SPRITE
        // ===========

        this.textSprite = g_sprites.buyStarText;

        this.textScaleX = (this.innerWidth  * 0.75) / this.textSprite.width;
        this.textScaleY = (this.innerHeight * 0.5) / this.textSprite.height;

        this.textWidth  = this.textScaleX * this.textSprite.width;
        this.textHeight = this.textScaleY * this.textSprite.height;
    }
};

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

        if (this.preset === 'buyStar') {
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
    }

    if (this.preset === 'menu') {
        let begin = this.button.update(du);

        // If button is clicked unregister all hitboxes
        if (begin === -1) {
            for (let i = 0; i < this.charSelection.length; i++) {
                spatialManager.unregister(this.charSelection[i]);
            }
            spatialManager.unregister(this.button);
        }
    }
    if (this.preset === 'buyStar') {
        let yes = this.buttonYes.update(du);
        let no  = this.buttonNo.update(du);

        // If a button is clicked unregister hitboxes
        if (yes === -1 || no === -1) {
            spatialManager.unregister(this.buttonYes);
            spatialManager.unregister(this.buttonNo);
        }
    }
};

// ======
// RENDER
// ======

PopUp.prototype.render = function(ctx) {
    if (g_useSpriteBox) this.renderSpriteBox(ctx);

    if (this.preset === 'buyStar') {
        g_aniSprites.coin[this.coinFrame].drawClipCentredAt(ctx, this.innerLeft + this.textWidth * 0.45 + this.starWidth * 3.5, this.innerTop + this.textHeight * 0.75, 0, this.starScaleX, this.starScaleY);
    }
    if (this.preset === 'menu') {
        // Characters
        for(let i = 0; i < this.charSelection.length; i++) {
            this.charSelection[i].render(ctx);
        }
    }
}

// ==============
// DYNAMIC RENDER
// ==============

PopUp.prototype.dynamicRender = function(ctx) {
    // Presets
    if (this.preset === 'minigame') {
      minigameManager.currentPreset(ctx);
    }

    if (this.preset === 'menu') {
        // Logo
        this.logo.drawCentredAt(ctx, this.logoCx, this.logoCy, 0, this.logoScaleX, this.logoScaleY);
        // Button
        this.button.render(ctx);
        // Characters
        for(let i = 0; i < this.charSelection.length; i++) {
            this.charSelection[i].dynamicRender(ctx);
        }
    }
    if (this.preset === 'buyStar') {
        // Text
        this.textSprite.drawCentredAt(ctx, this.innerLeft + this.textWidth/2, this.innerTop + this.textHeight/2, 0, this.textScaleX, this.textScaleY);
        // Starcost
        // Star cost
        g_numberSprites['num'+[this.starDigit1]].drawClipCentredAt(ctx, this.innerLeft + this.textWidth * 0.45, this.innerTop + this.textHeight * 0.75, 0, this.starScaleX, this.starScaleY);
        g_numberSprites['num'+[this.starDigit2]].drawClipCentredAt(ctx, this.innerLeft + this.textWidth * 0.45 + this.starWidth * 1.5, this.innerTop + this.textHeight * 0.75, 0, this.starScaleX, this.starScaleY);
        // Buttons
        this.buttonYes.render(ctx);
        this.buttonNo.render(ctx);
    }
    if (this.preset === 'victory') {
        this.textSprite.drawCentredAt(ctx, this.innerLeft + this.textWidth/2, this.innerTop + this.textHeight/2, 0, this.textScaleX, this.textScaleY);
    }
};

// =============
// STATIC RENDER
// =============

PopUp.prototype.staticRender = function(ctx) {

    // Background
    this.backgroundSprite.drawCentredAt(ctx, this.cx, this.cy, 0, this.backgroundScaleX, this.backgroundScaleY);

    // Framing
    // Top side
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerLeft, this.centerTop, -Math.PI/2, this.pipeScaleX, this.pipeScaleY);

    for(let t = 1; t < this.pipeWNo; t++) {
        g_sprites.framePipeMid.drawCentredAt(ctx, this.centerLeft + this.pipeHeight * t, this.centerTop, -Math.PI/2, this.pipeScaleX, this.pipeScaleX);
    }
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerRight, this.centerTop, Math.PI/2, this.pipeScaleX, this.pipeScaleY, 1);


    // Bot side
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerLeft, this.centerBot, -Math.PI/2, this.pipeScaleX, this.pipeScaleY);

    for(let t = 1; t < this.pipeWNo; t++) {
        g_sprites.framePipeMid.drawCentredAt(ctx, this.centerLeft + this.pipeHeight * t, this.centerBot, -Math.PI/2, this.pipeScaleX, this.pipeScaleX);
    }
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerRight, this.centerBot, Math.PI/2, this.pipeScaleX, this.pipeScaleY, 1);


    // Right side
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerRight, this.centerTop + this.pipeHeight, 0, this.pipeScaleX, this.pipeScaleY);

    for(let t = 1; t < this.pipeHNo; t++) {
        g_sprites.framePipeMid.drawCentredAt(ctx, this.centerRight, this.centerTop + this.pipeHeight * (t+1), 0, this.pipeScaleX, this.pipeScaleX);
    }
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerRight, this.centerBot - this.pipeHeight, Math.PI, this.pipeScaleX, this.pipeScaleY, 1);


    // Left side
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerLeft, this.centerTop + this.pipeHeight, 0, this.pipeScaleX, this.pipeScaleY);

    for(let t = 1; t < this.pipeHNo; t++) {
        g_sprites.framePipeMid.drawCentredAt(ctx, this.centerLeft, this.centerTop + this.pipeHeight * (t+1), 0, this.pipeScaleX, this.pipeScaleX);
    }
    g_sprites.framePipeTop.drawCentredAt(ctx, this.centerLeft, this.centerBot - this.pipeHeight, Math.PI, this.pipeScaleX, this.pipeScaleY, 1);
};

// =================
// RENDER SPRITE BOX
// =================

PopUp.prototype.renderSpriteBox = function(ctx) {
    // Outer box
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

    // Inner box
    ctx.beginPath();
    ctx.moveTo(this.innerLeft, this.innerTop);    // Top-left corner

    // Top line
    ctx.lineTo(this.innerRight, this.innerTop);
    ctx.stroke();

    // Right line
    ctx.lineTo(this.innerRight, this.innerBot);
    ctx.stroke();

    // Bot line
    ctx.lineTo(this.innerLeft, this.innerBot);
    ctx.stroke();

    // Left line
    ctx.lineTo(this.innerLeft, this.innerTop);
    ctx.stroke();

    ctx.closePath();

    if (this.preset === 'menu') {
        ctx.beginPath();
        ctx.moveTo(this.logoCx - this.logoWidth/2, this.logoCy - this.logoHeight/2);    // Top-left corner

        // Top line
        ctx.lineTo(this.logoCx + this.logoWidth/2, this.logoCy - this.logoHeight/2);
        ctx.stroke();

        // Right line
        ctx.lineTo(this.logoCx + this.logoWidth/2, this.logoCy + this.logoHeight/2);
        ctx.stroke();

        // Bot line
        ctx.lineTo(this.logoCx - this.logoWidth/2, this.logoCy + this.logoHeight/2);
        ctx.stroke();

        // Left line
        ctx.lineTo(this.logoCx - this.logoWidth/2, this.logoCy - this.logoHeight/2);
        ctx.stroke();

        ctx.closePath();
    }
}
