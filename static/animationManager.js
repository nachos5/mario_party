// =================
// ANIMATION MANAGER
// =================

let animationManager = {
    // Control variables
    mod: 50,

    // Animations
    coin: 0,
    die: 0,
    //tempAnimations = [],

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
/*
    generateAnimation: function(preset) {
        if (preset === 'mapCoin') {
            this.tempAnimations.push(new Animation({
                frameNo : 5,
                mod     : this.mod,
                preset  : 'mapCoin'
            }));
        }
    },*/


    update: function(du) {
        this.coin.update(du);
        this.die.update(du);
/*
        for(let i = 0; i < this.tempAnimations.length; i++) {
            let status = this.tempAnimations[i].update(du);
            if (status === -1) {
                this.tempAnimations.splice(i, 1);
            }
        }*/
    },

};
