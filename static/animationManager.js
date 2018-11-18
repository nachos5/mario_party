// =================
// ANIMATION MANAGER
// =================

let animationManager = {
    // Control variables
    mod: 6,
    
    // Animations
    coin: 0,
    die: 0,
    
    // Map animations
    isMapAnimation: false,
    mapAnimations: [],

    // todo
    star: 0,
    
    


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

    generateMapAnimation: function(preset, t, p = entityManager._curr_tt_player) {
        // - 3 coins
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
        // + 3 coins
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
        console.log("generate animat")
    },
    

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
    },

};