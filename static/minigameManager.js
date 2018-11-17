// minigames require at least an init function, a preset function, an update function and a render function
const minigameManager = {

// object with all minigames
minigames: {
  test: testMinigame,
},

// keep track of the current minigame
currentMinigame: null,

popup: null,

// stores current popup preset
currentPreset: null,

// initializes a minigame by name
initializeMinigame: function(name) {
  // Offset values are based on mapHeight and mapWidth
    this.popup = new PopUp({
      offsetTop   : 0,
      offsetRight : 0,
      offsetBot   : 0,
      offsetLeft  : 0,
    });
    this.currentMinigame = this.minigames[name];
    this.currentPreset = this.currentMinigame.preset;
    this.popup.setPreset('minigame');

    this.imageData();
},

// ==========
// IMAGE DATA
// ==========

imageData: function() {
  // Static image data
  this.staticRender(g_ctx);
  // Dynamic image data
  this.dynamicRender(g_ctx);
  this.popupSprite = g_ctx.getImageData(this.popup.left, this.popup.top, this.popup.width, this.popup.height);
},

// =================
// UPDATE IMAGE DATA
// =================

updateImageData: function() {
  // Static image data
  this.staticRender(g_ctx);
  // Dynamic image data
  this.dynamicRender(g_ctx);
  this.popupSprite = g_ctx.getImageData(this.popup.left, this.popup.top, this.popup.width, this.popup.height);
},

update: function(du) {
  this.updateImageData(g_ctx);
  // update current minigame
  if (this.currentMinigame != null)
    this.currentMinigame.update(du);
},

render: function(ctx) {
  ctx.putImageData(this.popupSprite, this.popup.left, this.popup.top);
  // render current minigame
  if (this.currentMinigame != null)
    this.currentMinigame.render(ctx);
},

// ==============
// DYNAMIC RENDER
// ==============

dynamicRender: function(ctx) {
  this.popup.dynamicRender(ctx);
},

// =============
// STATIC RENDER
// =============

staticRender: function(ctx) {
  this.popup.staticRender(ctx);
},

}
