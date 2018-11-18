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
Animation.prototype.mod = 0;
Animation.prototype.frameNo = 0;

// Used for iteration
Animation.prototype.iter = 0;
Animation.prototype.frame = 0;
Animation.prototype.count  = 0;

// Control variables
Animation.prototype.times  = 0;     // Play animation x times
Animation.prototype.isUp   = 0;     // Play animation up
Animation.prototype.isDown = 0;     // Play animation down

// Manipulation variables
Animation.prototype.alpha = 0;
Animation.prototype.cx    = 0;
Animation.prototype.cy    = 0;

Animation.prototype.preset = 0;


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
        };
    }
/*
    // Map coin
    if (this.iter % this.mod == 0) {
        this.frame++;
    }
    this.iter += du;
    if (this.isDown)    this.cx--;
    if (this.isUp)      this.cy++;
    this.alpha -= 0.03;
    // Restart
    if(this.iter === this.mod * this.frameNo || this.frame === this.frameNo + 1) {
        this.restart();
        this.count++;
        if (this.count === this.times) {
            return -1;
        }
    };*/

    // GameRoom die
    if (this.preset === 'die') {
        if (Math.floor(this.iter) % this.mod === 0) {
            this.frame = parseInt(Math.random() * (this.frameNo+1)) + 1;;
        }
        this.iter += du;
        
        // Restart
        if(Math.floor(this.iter) >= this.mod * this.frameNo || this.frame === this.frameNo + 1) {
            this.restart();
        };
    }
};