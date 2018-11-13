// ============
// MENU MANAGER
// ============

let menuManager = {

    // Map variables
    mapTop: null,
    mapLeft: null,
    mapRight: null,
    
    // Menu variables
    menuTop:   0,
    menuRight: 0,
    menuBot:   0,
    menuLeft:  0,

    width:     0,
    height:    0,

    midXOffset: 0,
    midYOffset: 0,

    // Objects
    button: null,   // Ready Button
    charSelection: [],

    init: function() {
        // Calculation variables
        this.mapTop = mapManager.mapTop;
        this.mapRight = mapManager.mapRight;
        this.mapBot = mapManager.mapBot;
        this.mapLeft = mapManager.mapLeft;

        this.mapWidth = mapManager.mapWidth;
        this.mapHeight = mapManager.mapHeight;

        // Menu box variables
        this.menuTop   = this.mapTop   + this.mapHeight/4;
        this.menuRight = this.mapRight - this.mapLeft * 0.075;
        this.menuBot   = this.mapBot   - this.mapHeight/4;
        this.menuLeft  = this.mapLeft  + this.mapLeft * 0.075;

        this.width = this.mapWidth/16;
        this.height = this.mapHeight/16;

        this.midXOffset = -1 + this.width;
        this.midYOffset = -1 + this.height;

        // Menu objects
        this.button = new Button({
            cx: this.menuRight - 1.5 * (this.width * 2.5/2),
            cy: this.menuBot   - 1.5 * this.height,

            width: this.width * 2.5,
            height: this.height * 2,

            onSprite: g_sprites.greenReady,
            offSprite: g_sprites.cyanReady,
        });

        for (let i = 0; i < g_charSelectionSprites.length-5; i++) {
            this.charSelection.push(new CharacterSelection({
                id : g_charSelectionSprites[(i+5)].id,
                sprite : g_charSelectionSprites[(i+5)].sp,

                cx: this.mapLeft + this.width * 1.5 + (this.width * 2 * i),
                cy: this.menuBot - this.height * 4.5,

                width : this.width * 2,
                height: this.height * 3,
            }));
        }


        for (let i = 0; i < 5; i++) {
            this.charSelection.push(new CharacterSelection({
                id : g_charSelectionSprites[i].id,
                sprite : g_charSelectionSprites[i].sp,

                cx: this.mapLeft + this.width * 1.5 + (this.width * 2 * i),
                cy: this.menuBot - this.height * 1.5,

                width : this.width * 2,
                height: this.height * 3,
            }));
        }
    },

    refresh: function() {
        // Set alpha to 1
        for (let i = 0; i < this.charSelection.length; i++) {
            this.charSelection[i].alpha = 1;
        }
    },

    update: function(du) {
        let begin = this.button.update(du);

        if (begin === -1) {
            for (let i = 0; i < this.charSelection.length; i++) {
                spatialManager.unregister(this.charSelection[i]);
            }
            spatialManager.unregister(this.button);
            g_startGame = true;
        }
    },

    render: function(ctx) {        

        // Background
        g_sprites.background2.drawTopLeftFixed(ctx, this.menuLeft, this.menuTop - (this.height * 0.75), 0,1,1, this.width*15, this.height*9.3);

        // Framing
        // Top side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.15) + 1, this.menuTop - (this.height * 0.75), -Math.PI/2, this.width, this.height, 1);
        
        let t = 1;
        while(this.menuLeft + (this.width * 0.15) + this.midXOffset * (t+1) < this.menuRight) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.15) + this.midXOffset * t, this.menuTop - (this.height * 0.75), Math.PI/2, this.width, this.height);
            t++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.15) + (this.midXOffset * t), this.menuTop - (this.height * 0.75), Math.PI/2, this.width, this.height);


        // Bot side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.15) + 1, this.menuBot + (this.height * 0.55), -Math.PI/2, this.width, this.height, 1);

        let b = 1;
        while(this.menuLeft + (this.width * 0.15) + this.midXOffset * (b+1) < this.menuRight) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.15) + this.midXOffset * b, this.menuBot + (this.height * 0.55), Math.PI/2, this.width, this.height);
            b++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.15) + (this.midXOffset * b), this.menuBot + (this.height * 0.55), Math.PI/2, this.width, this.height);


        // Right side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuRight, this.menuTop, 0, this.width, this.height);
        
        let r = 1;
        while(this.menuTop + this.midYOffset * (r+1) < this.menuBot) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.menuRight, this.menuTop + this.midYOffset * r, 0, this.width, this.height);
            r++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuRight, this.menuTop + (this.midYOffset * r) - 1, 0, this.width, this.height, 2);


        // Left side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft, this.menuTop, 0, this.width, this.height);
        
        let l = 1;
        while(this.menuTop + this.midYOffset * (l+1) < this.menuBot) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.menuLeft, this.menuTop + this.midYOffset * l, 0, this.width, this.height);
            l++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft, this.menuTop + (this.midYOffset * l) - 1, 0, this.width, this.height, 2);


        // Inside the pipes
        // Logo
        g_sprites.marioPartyLogo.drawCentredAtFixed(ctx, this.mapLeft + this.mapWidth/2, this.menuTop - (this.height * 0.75) + this.height * 1.5, 0, this.width*8, this.height*2);

        // Button
        this.button.render(ctx);

        for(let i = 0; i < this.charSelection.length; i++) {
            this.charSelection[i].render(ctx);
        }
    }
};