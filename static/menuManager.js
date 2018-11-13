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
        this.menuRight = this.mapRight - this.mapLeft * 0.1;
        this.menuBot   = this.mapBot   - this.mapHeight/4;
        this.menuLeft  = this.mapLeft  + this.mapLeft * 0.1;

        this.width = this.mapWidth/16;
        this.height = this.mapHeight/16;

        this.midXOffset = -1 + this.width;
        this.midYOffset = -1 + this.height;
    },

    update: function() {

    },

    render: function(ctx) {

        // Top side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.5) + 1, this.menuTop - (this.height * 0.75), -Math.PI/2, this.width, this.height, 1);
        
        let t = 1;
        while(this.menuLeft + (this.width * 0.5) + this.midXOffset * (t+1) < this.menuRight) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.5) + this.midXOffset * t, this.menuTop - (this.height * 0.75), Math.PI/2, this.width, this.height);
            t++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.5) + (this.midXOffset * t), this.menuTop - (this.height * 0.75), Math.PI/2, this.width, this.height);


        // Bot side
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.5) + 1, this.menuBot + (this.height * 0.6), -Math.PI/2, this.width, this.height, 1);

        let b = 1;
        while(this.menuLeft + (this.width * 0.5) + this.midXOffset * (b+1) < this.menuRight) {
            g_sprites.framePipeMid.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.5) + this.midXOffset * b, this.menuBot + (this.height * 0.6), Math.PI/2, this.width, this.height);
            b++;
        }
        g_sprites.framePipeTop.drawCentredAtFixed(ctx, this.menuLeft + (this.width * 0.5) + (this.midXOffset * b), this.menuBot + (this.height * 0.6), Math.PI/2, this.width, this.height);


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
    }
};