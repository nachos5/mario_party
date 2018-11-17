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

init: function() {
  // Offset values are based on mapHeight and mapWidth
  this.popup = new PopUp({
    offsetTop   : 0,
    offsetRight : 0,
    offsetBot   : 0,
    offsetLeft  : 0,
  });
  this.popup.setPreset('minigame');
  this.imageData();
  
  for(let i = 0; i < entityManager._players.length; i++) {
    entityManager._players[i].eventPlayer.initMinigameRoom();
    entityManager._players[i].eventPlayer.changeRoom(2);
  }

  console.log("mini gameda")
console.log(entityManager._players[0].eventPlayer)
},

// initializes a minigame by name
initializeMinigame: function(name) {
    this.currentMinigame = this.minigames[name];
    this.currentPreset = this.currentMinigame.preset;
    
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

currentPreset: function() {
  console.log("ég er preset")
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

  this.popup.render(ctx);
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
