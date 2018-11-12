// ===========
// CONSTRUCTOR
// ===========

function Block(descr) {
    // Setup Entity object
    this.setup(descr);
    
    this.icon = this.random();

    spatialManager.register(this);
}

// ==========
// PROPERTIES
// ==========

Block.prototype = new Entity();

Block.prototype.results  = null;
Block.prototype.players  = null;
Block.prototype.items    = null;
Block.prototype.iconIter = 0;

Block.prototype.getRadius = function () {
    return this.width * 0.75;
};

Block.prototype.resolveCollision = function () {
    if (this.id === 2 && this.results === null) {
        this.results = parseInt(Math.random() * 3) + 1;
    }
    else if(this.results === null){
        this.results = 1;
    }
};

// ======
// UPDATE
// ======

Block.prototype.update = function(du) {

    if (g_useAnimation) {
        
        if (this.id == 2) {

            // Arrow animation
            if(this.results !== null) {
                if (this.arrowIter % 6 == 0) {  // Increment arrow every 10th frame
                    this.arrowPos += 0.15;
                }
                this.arrowIter++;
                // Restart
                if(this.arrowIter === 66) {
                    this.arrowPos = 0;
                    this.arrowIter = 0;
                };
            }
        }
    }

    if (this.results === null && this.iconIter % 4 == 0) { 
        this.icon = this.random();
        this.iconIter = 0;
    }

    this.iconIter++;

    // Let EventBlocks know that the results are in
    if(this.results !== null) {
        return  -1;
    }
};

// ======
// RENDER
// ======

Block.prototype.render = function(ctx) {

    // Item Block Arrows
    if (this.id === 2) {
        // Arrows
        if(this.results === 1 || this.results ===2) {
            this.arrow.drawCentredAtFixed(ctx, this.cx, this.cy - (this.brickHeight * this.arrowPos), 0, this.itemWidth, this.itemHeight);
        }
        if(this.results === 3 || this.results ===2) {
            this.arrow.drawCentredAtFixed(ctx, this.cx, this.cy + (this.brickHeight * this.arrowPos), Math.PI, this.itemWidth, this.itemHeight);
        }
    }

    // Base Block
    this.block.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.width, this.height);

    // Player Block 1
    if (this.id === 1){
        this.players[this.icon].drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
    }
    // Item Block 
    if (this.id === 2) {
        if(this.items[this.icon].id === 1) {
            this.items[this.icon].sp.drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
        }
        else {
            this.items[this.icon].sp.drawCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
        }
    }
    // Player Block 2
    if (this.id === 3){
        this.players[this.icon].drawClipCentredAtFixed(ctx, this.cx, this.cy, 0, this.itemWidth, this.itemHeight);
    }
};