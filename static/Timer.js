// ===========
// CONSTRUCTOR
// ===========

function Timer(sec) {
    this.sec      = sec;
    this.clock    = 0;
    this.isTimeUp = false;

    this.rememberReset();
}

// ==============
// REMEMBER RESET
// ==============

Timer.prototype.rememberReset = function() {
    this.resetSec    = this.sec;
    this.resetClock  = this.clock;
};

// =====
// RESET
// =====

Timer.prototype.reset = function() {
    this.sec   = this.resetSec;
    this.clock = this.resetClock;
};

// ===========
// START TIMER
// ===========

Timer.prototype.startTimer = function() {
    this.isTimeUp = false;
    this.clock =
        setInterval( () => {
            this.sec--;
            if (this.sec <= 0) {
                this.stopTimer();
            }
        }, 1000);
};

// ==========
// STOP TIMER
// ==========

Timer.prototype.stopTimer = function() {
    clearInterval(this.clock);
    this.isTimeUp = true;
    this.reset();
};