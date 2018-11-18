// minigames require at least an init function, a preset function, an update function and a render function

// DISPLAY INFO HOW TO PLAY

const minigameManager = {

// object with all minigames
minigames: {
  mash: mash,
},

// object that keeps track of already played minigames, resets when all have been played
already_played: [],

// boolean value that says whether a minigame is running or not
minigame_is_running: false,

// keep track of the current minigame
currentMinigame: null,

popup: null,

// stores current popup preset
currentPreset: null,

initMinigame: function(name) {
  // Offset values are based on mapHeight and mapWidth
  this.popup = new PopUp({
    offsetTop   : 0,
    offsetRight : 0,
    offsetBot   : 0,
    offsetLeft  : 0,
  });

  if (name == undefined) this.currentMinigame = this.getRandomMinigame();
  else                   this.currentMinigame = this.minigames[name];
  this.currentPreset = this.currentMinigame.preset;
  this.popup.setPreset('minigame');
  this.imageData();

  for(let i = 0; i < entityManager._players.length; i++) {
    entityManager._players[i].eventPlayer.initMinigameRoom();
    //entityManager._players[i].eventPlayer.changeRoom(2);
  }

  this.currentMinigame.init();
  this.minigame_is_running = true;

},

endMinigame: function() {
  const placement = this.currentMinigame.placement;

  this.currentMinigame = null;
  this.currentPreset = null;
  this.minigame_is_running = false;
},

// gets a random unplayed minigame (resets when all have been played)
getRandomMinigame: function() {
  if (Object.keys(this.minigames).length == this.already_played.length) {
    this.already_played = {}; // reset
  }
  let minigames = []; // just for this scope
  for (let m in this.minigames) {
    if (!(m in this.already_played)) {
      minigames.push(m); // find unplayed minigames
    }
  }
  const rand = parseInt(Math.random() * minigames.length);
  return this.minigames[minigames[rand]];
},


// get event players
getPlayers: function() {
  let players = [];
  for (let p in entityManager._players) {
    players.push(entityManager._players[p].eventPlayer);
    if (entityManager._players[p].my_player)
      this.my_player = entityManager._players[p].eventPlayer;
  }
  return players;
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
  if (this.popup != null) {
    this.updateImageData(g_ctx);
    // update current minigame
    if (this.currentMinigame != null)
      this.currentMinigame.update(du);
  }
},

render: function(ctx) {
  if (this.popup != null) {
    ctx.putImageData(this.popupSprite, this.popup.left, this.popup.top);
    // render current minigame
    if (this.currentMinigame != null)
      this.currentMinigame.render(ctx);

    this.popup.render(ctx);
  }
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
