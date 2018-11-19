// ===========
// CONSTRUCTOR
// ===========

function Animation(descr) {
    // Apply Properties from caller
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// ==========
// PROPERTIES
// ==========

// Essential
Animation.prototype.mod = 0;            // How often to change frames
Animation.prototype.frameNo = 0;        // Number of frames [0 - x]

// Used for iteration
Animation.prototype.iter = 0;
Animation.prototype.frame = 0;
Animation.prototype.count  = 0;

// Control variables
Animation.prototype.player = 0;         // Play animation on player
Animation.prototype.times  = 0;         // Play animation x times
Animation.prototype.isUp   = false;     // Play animation up
Animation.prototype.isDown = false;     // Play animation down

// Manipulation variables
Animation.prototype.alpha = 1;          // Ctx alpha level - [0 - 1]
Animation.prototype.cx    = 0;          // Cx coordinates of the sprite
Animation.prototype.cy    = 0;          // Cy coordinates of the sprite

Animation.prototype.preset = 0;         // Choose a preset


Animation.prototype.restart = function() {
    
    this.frame = 0; 
    this.iter = 0;

    if (this.preset === 'mapCoin') {
        audioManager.playAndEmit("coin", 0.2, false, 1);
        this.cy = 0;
        this.alpha = 1;
    }
};

// ======
// UPDATE
// ======

Animation.prototype.update = function(du) {

    // ScoreRoom coin
    if (this.preset === 'vanilla') {
        if (Math.floor(this.iter) % this.mod === 0) {
            this.frame++;
        }
        this.iter += du;
        
        // Restart
        if(Math.floor(this.iter) >= this.mod * this.frameNo || this.frame === this.frameNo + 1) {
            this.restart();
        }
    }

    // Map coin
    if (this.preset === 'mapCoin') {
        if (Math.floor(this.iter) % this.mod == 0) {
            this.frame++;
        }
        this.iter += 1;
        if (this.isUp)      this.cy--;
        if (this.isDown)    this.cy++;
        this.alpha -= 0.03;

        // Restart
        if(Math.floor(this.iter) === this.mod * this.frameNo || this.frame === this.frameNo + 1) {
            this.restart();
            this.count++;
            if (this.count === this.times) {
                return -1;
            }
        }
    }

    // Map star - static
    if (this.preset === 'mapStar') {
        this.iter += 1;
        if (this.isUp)      this.cy -= 0.5;
        if (this.isDown)    this.cy += 0.5;
        this.alpha -= 0.005;

        // Restart
        if(Math.floor(this.iter) === this.mod * this.frameNo) {
            this.restart();
            this.count++;
            if (this.count === this.times) {
                return -1;
            }
        }
    }

    // GameRoom die
    if (this.preset === 'die') {
        if (Math.floor(this.iter) % this.mod === 0) {
            this.frame = parseInt(Math.random() * (this.frameNo+1)) + 1;;
        }
        this.iter += du;
        
        // Restart
        if(Math.floor(this.iter) >= this.mod * this.frameNo || this.frame === this.frameNo + 1) {
            this.restart();
        }
    }

    // EventRoom arrow
    if (this.preset === 'eventArrow') {
        if (Math.floor(this.iter) % this.mod == 0) {
            this.cy += 0.15;
        }
        this.iter++;
        // Restart
        if(Math.floor(this.iter) >= this.mod * this.frameNo || this.frame === this.frameNo + 1) {
            this.restart();
            this.cy = 0;
        };
    }
};