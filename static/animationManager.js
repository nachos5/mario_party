// =================
// ANIMATION MANAGER
// =================

let animationManager = {
    scoreRoomCoin: 0,
    star: 0,
    die: 0,
    mod: 0,


    init: function() {
        this.scoreRoomCoin = new Animation({
            framNo : 5,
            mod    : 6,
            preset : 'vanilla'
        });
    },

    coin: function() {
    },

    restart: function() {

    },

    update: function(du) {
        this.scoreRoomCoin.update(du);
    },

};