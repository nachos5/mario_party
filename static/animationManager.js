// =================
// ANIMATION MANAGER
// =================

let animationManager = {
    // Control variables
    mod: 6,     // Constant don't change

    // Continous animations
    coin: 0,
    die: 0,

    // Map animations
    isMapAnimation: false,
    mapAnimations: [],

    // Temp animations
    isTempAnimation: false,
    tempAnimations: [],

    // =============
    // INITALIZATION
    // =============

    init: function() {
        this.coin = new Animation({
            frameNo : 5,
            mod     : this.mod,
            preset  : 'vanilla'
        });

        this.die = new Animation({
            frameNo : 9,
            mod     : this.mod,
            preset  : 'die'
        });

    },

    // ======================
    // GENERATE MAP ANIAMTION
    // ======================

    generateMapAnimation: function(preset, t, p = entityManager._curr_tt_player) {
        // - coins
        if (preset === 'coinUp') {
            this.mapAnimations.push(new Animation({
                frameNo : 5,
                mod     : this.mod,
                times   : t,
                preset  : 'mapCoin',
                isUp    : true,
                player  : p,
            }));
        }
        // + coins
        if (preset === 'coinDown') {
            this.mapAnimations.push(new Animation({
                frameNo : 5,
                mod     : this.mod,
                times   : t,
                preset  : 'mapCoin',
                isDown  : true,
                player  : p,
            }));
        }

        // - star
        if (preset === 'starUp') {
            this.mapAnimations.push(new Animation({
                frameNo : 10,
                mod     : this.mod,
                times   : t,
                preset  : 'mapStar',
                isUp    : true,
                player  : p,
            }));
        }
        // + star
        if (preset === 'starDown') {
            this.mapAnimations.push(new Animation({
                frameNo : 10,
                mod     : this.mod,
                times   : t,
                preset  : 'mapStar',
                isDown  : true,
                player  : p,
            }));
        }
        // + die
        if (preset === 'dieUp') {
            this.mapAnimations.push(new Animation({
                frameNo : 10,
                mod     : this.mod,
                times   : t,
                preset  : 'mapDie',
                player  : p,
            }));
        }
    },

    // =======================
    // GENERATE TEMP ANIMATION
    // =======================

    generateTempAnimation: function(preset) {
        if (preset === 'eventArrow') {
            this.tempAnimations.push(new Animation({
                frameNo : 11,
                mod     : this.mod,
                preset  : 'eventArrow'
            }));
        }
    },

    // ======
    // UPDATE
    // ======

    update: function(du) {
        this.coin.update(du);
        this.die.update(du);

        for(let i = 0; i < this.mapAnimations.length; i++) {
            let status = this.mapAnimations[i].update(du);
            if (status === -1) {
                this.mapAnimations.splice(i, 1);
            }
        }

        if (this.mapAnimations.length === 0) this.isMapAnimation = false;
        else {
            mapManager.eventIsRunning = false; // Event is done
            this.isMapAnimation = true;
        }

        for(let i = 0; i < this.tempAnimations.length; i++) {
            let status = this.tempAnimations[i].update(du);
            if (status === -1) {
                this.tempAnimations.splice(i, 1);
            }
        }

        if (this.tempAnimations.length === 0) this.isTempAnimation = false;
        else {
            mapManager.eventIsRunning = false; // Event is done
            this.isTempAnimation = true;
        }
    },

};
