// ===========
// CONSTRUCTOR
// ===========

function Animation(preset) {
    // Essential Animation variables
    this.mod    = 0;
    this.framNo = 0;

    this.iter   = 0;
    this.frames = 0;

    // Play animation x times
    this.count  = 0;
    this.times  = 0;
    
    // Manipulation variables
    this.alpha = 0;
    this.cx    = 0;
    this.cy    = 0;


    this.preset = 0;
    this.setPreset(preset);
}

//
//
//
//audioManager.playAndEmit("coin", 0.2, false, 1);

Animation.prototype.setPreset = function(preset) {
    this.preset = preset;

    // Vanilla - continous and stationary
};


//
//
//

Animation.prototype.update = function(du) {

    if (this.preset === 'vanilla') {
        if (Math.floor(this.iter) % this.mod === 0) {
            this.frame += 1;
        }
        this.iter += du;
        
        // Restart
        if(this.iter === this.mod * this.framNo) {
            this.frame = 0;
            this.iter = 0;
        };
    }
};