// ============
// MENU MANAGER
// ============

let menuManager = {

    menuSprite: 0,  // Image data

    // ==========
    // INITILAIZE
    // ==========

    init: function() {
        
        // Construct a menu
        // Offset values are based on mapHeight and mapWidth
        this.menuPopUp = new PopUp({
            offsetTop   : 0.2,
            offsetRight : 0.02,
            offsetBot   : 0.2,
            offsetLeft  : 0.02,
        });

        // Set preset to menu
        this.menuPopUp.setPreset('menu');

        // Select default sprite
        for (let i = 0; i < entityManager._players.length; i++) {
            let id = entityManager._players[i].spriteID;
            this.menuPopUp.charSelection[id].isSelected = true;
        }

        this.imageData();

        // Options
        const KEYCODE_ESC = 27;
        this.KEY_OPTIONS = KEYCODE_ESC;
    },

    // ==========
    // IMAGE DATA
    // ==========

    imageData: function() {
        // Static image data
        this.staticRender(g_ctx);
        // Dynamic image data
        this.dynamicRender(g_ctx);
        this.menuSprite = g_ctx.getImageData(this.menuPopUp.left, this.menuPopUp.top, this.menuPopUp.width, this.menuPopUp.height);
    },

    // =================
    // UPDATE IMAGE DATA
    // =================

    updateImageData: function() {
        // Static image data
        this.staticRender(g_ctx);
        // Dynamic image data
        this.dynamicRender(g_ctx);
        this.menuSprite = g_ctx.getImageData(this.menuPopUp.left, this.menuPopUp.top, this.menuPopUp.width, this.menuPopUp.height);
    },

    // =======
    // REFRESH
    // =======

    refresh: function() {
        // Set alpha to 1
        for (let i = 0; i < this.menuPopUp.charSelection.length; i++) {
            if (!this.menuPopUp.charSelection[i].isLocked) {
                this.menuPopUp.charSelection[i].isSelected = false;
            }
        }
        
        // Update menu
        this.updateImageData();
    },

    // ========
    // CLEAN UP
    // ========

    cleanup: function() {
      for (let i = 0; i < this.menuPopUp.charSelection.length; i++) {
          spatialManager.unregister(this.menuPopUp.charSelection[i]);
      }
      spatialManager.unregister(this.menuPopUp.button);
    },

    // ======
    // UPDATE
    // ======

    update: function(du) {
        if (!g_startGame) this.menuPopUp.update(du);
        if (eatKey(this.KEY_OPTIONS) && g_startGame) {
            stateManager.newOptions();
        }
    },

    // ======
    // RENDER
    // ======

    render: function(ctx) {
        // Render static object
        ctx.putImageData(this.menuSprite, this.menuPopUp.left, this.menuPopUp.top);
        this.menuPopUp.render(ctx);
    },

    // ==============
    // DYNAMIC RENDER
    // ==============

    dynamicRender: function(ctx) {
        this.menuPopUp.dynamicRender(ctx);
    },

    // =============
    // STATIC RENDER
    // =============

    staticRender: function(ctx) {
        this.menuPopUp.staticRender(ctx);
    },
};
