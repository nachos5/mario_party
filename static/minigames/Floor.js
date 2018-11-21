// ===========
// CONSTRUCTOR
// ===========

function Floor(descr) {

    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }

    this.blockBlue = g_sprites.blockBlue;
    this.blockRed  = g_sprites.blockRed;

    this.blockScaleX = minigameManager.popup.innerWidth/16  / this.blockBlue.width;
    this.blockScaleY = this.blockScaleX;

    this.blockWidth  = this.blockScaleX * this.blockBlue.width;
    this.blockHeight = this.blockScaleY * this.blockBlue.height;

    // Convenience variables
    this.innerTop   = minigameManager.popup.innerTop;
    this.innerRight = minigameManager.popup.innerRight;
    this.innerBot   = minigameManager.popup.innerBot;
    this.innerLeft  = minigameManager.popup.innerLeft

    this.centerTop  = this.innerTop  + this.blockWidth/2;
    this.centerLeft = this.innerLeft + this.blockHeight/2;

    this.lines = [
        [0, 1, 2, 3],
        [0, 1, 2, 3],
        [0, 1, 2, 3],
        [0, 1, 2, 3],
    ];

    // List of blocks
    // blockBlue = 01;
    // blockRed  = 02;

    this.myFloor = [
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 0
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 1
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 2
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 3
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 4
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 5
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 6
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 7
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 8
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 9
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 10
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 11
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 12
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 13
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 14
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 15
    ];//  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,  14,  15

    this.nextFloor = [
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 0
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 1
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 2
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 3
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 4
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 5
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 6
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 7
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 8
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 9
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 10
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 11
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 12
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 13
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 14
        [01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01,  01],  // 15
    ];//  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,  14,  15

    this.updateNextFloor();
}

// ==========
// PROPERTIES
// ==========

Floor.prototype.sizeX = 16;
Floor.prototype.sizeY = 16;
Floor.prototype.currentPos = 0;
Floor.prototype.my_player = 0;
Floor.prototype.alpha = 1;
Floor.prototype.isLavaTransition = false;

// ===========
// RENDER GRID
// ===========

Floor.prototype.renderGrid = function(ctx) {
    // Values to shuffle
    let nextTop = this.innerTop;
    let nextLeft = this.innerLeft;

    // Horizontal line
    for(let i = 0; i < this.myFloor.length + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(this.innerLeft, nextTop);
        ctx.lineTo(this.innerRight, nextTop);
        ctx.stroke();
        ctx.closePath();

        nextTop += this.blockHeight;
    }
    // Vertical line
    for(let i = 0; i < this.myFloor.length + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nextLeft, this.innerTop);
        ctx.lineTo(nextLeft, this.innerBot);
        ctx.stroke();
        ctx.closePath();

        nextLeft += this.blockWidth;
    }
};

// =============
// FIND POSITION
// ============= 

Floor.prototype.findPosition = function(player) {
    let cx = player.cx - this.innerLeft;
    let cy = player.cy - this.innerTop;
    
    let tileX = Math.floor(cx / this.blockWidth);
    let tileY = Math.floor(cy / this.blockHeight);

    // Tile that the player center is on
    let tile = this.myFloor[tileY][tileX];

    if (tile === 2) return -1;
    else return 0;
};

// =================
// UPDATE NEXT FLOOR
// =================

Floor.prototype.updateNextFloor = function() {

    let random  = parseInt(networkManager.random[0]  * 4);
    let random2 = parseInt(networkManager.random2[0] * 4);

    let x = 0;
    let y = 0;

    // If blocks are already red, pick another one
    if (this.lines[random2][random] === null) {
        for(let i = 0; i < this.lines.length; i++) {
            for(let j = 0; j < this.lines[i].length; j++) {
                if (this.lines[i][j] !== null) {
                    random2  = i;
                    random = j;
                    break;
                }
            }
        }
    }

    // Label blocks
    this.lines[random2][random] = null;

    // Random x tile
    switch(random) {
        case 0:
            x += 0;
            break;
        case 1:
            x += this.blockWidth * 4;
            break;
        case 2:
            x += this.blockWidth * 8;
            break;
        case 3:
            x += this.blockWidth * 12;
            break;
    }

    // Random y tile
    switch(random2) {
        case 0:
            y += 0;
            break;
        case 1:
            y += this.blockHeight * 4;
            break;
        case 2:
            y += this.blockHeight * 8;
            break;
        case 3:
            y += this.blockHeight * 12;
            break;
    }

    let tileY = Math.floor(y / this.blockHeight);
    let tileX = Math.floor(x / this.blockWidth);

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            this.nextFloor[tileY + i][tileX + j] = 2;
        }
    }
};

// ========
// SET LAVA
// ========

Floor.prototype.setLava = function() {
    let blueBlockNo = 0;

    for(let i = 0; i < this.nextFloor.length; i++) {    // Height
        for(let j = 0; j < this.nextFloor[i].length; j++) { // Width
            this.myFloor[i][j] = this.nextFloor[i][j];
            if (this.myFloor[i][j] === 1) blueBlockNo++;
        }
    }
    
    this.updateNextFloor();
};

// ======
// UPDATE
// ======

Floor.prototype.update = function(du) {

    this.alpha -= 0.005;
    if (this.alpha <= 0) {
        this.alpha = 1;
        this.setLava();
    }

    // Find player position on the grid
    return this.findPosition(this.my_player);
};

// ======
// RENDER
// ======

Floor.prototype.render = function(ctx) {
    for(let i = 0; i < this.myFloor.length; i++) {    // Height
        for(let j = 0; j < this.myFloor[i].length; j++) { // Width
            // Blue block
            if(this.myFloor[i][j] === 1) {
                if (this.nextFloor[i][j] === 2) {
                    if (this.alpha < 0) this.alpha = 0;     // Safety check
                    // Draw red block under blue block
                    this.blockRed.drawCentredAt(ctx, this.centerLeft + (this.blockWidth * j), this.centerTop + (this.blockHeight * i), 0, this.blockScaleX, this.blockScaleY);
                        
                    // Blue block transparent
                    ctx.globalAlpha = this.alpha;
                    this.blockBlue.drawCentredAt(ctx, this.centerLeft + (this.blockWidth * j), this.centerTop + (this.blockHeight * i), 0, this.blockScaleX, this.blockScaleY);
                    ctx.globalAlpha = 1;    // Restore alpha level
                }
                else {
                    this.blockBlue.drawCentredAt(ctx, this.centerLeft + (this.blockWidth * j), this.centerTop + (this.blockHeight * i), 0, this.blockScaleX, this.blockScaleY);
                }
            }
            // Red block
            if(this.myFloor[i][j] === 2) {
                this.blockRed.drawCentredAt(ctx, this.centerLeft + (this.blockWidth * j), this.centerTop + (this.blockHeight * i), 0, this.blockScaleX, this.blockScaleY);
            }
        }
    }

    if (g_useGrid) this.renderGrid(ctx);
};
