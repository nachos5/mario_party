// minigames require at least an init function, a preset function, an update function and a render function

// DISPLAY INFO HOW TO PLAY

const minigameManager = {

// object with all minigames
minigames: {
  mash: mash,
  bulletStorm: bulletStorm,
},

// object that keeps track of already played minigames, resets when all have been played
already_played: [],

// boolean value that says whether a minigame is running or not
minigame_is_running: false,

// keep track of the current minigame
currentMinigame: null,

popup: null,
rules_popup: null,
winning_popup: null,
placements: {},
minigame_ready: false,

// stores current popup preset
currentPresetFunction: null,

initMinigame: function(name) {
  // Offset values are based on mapHeight and mapWidth
  this.popup = new PopUp({
    offsetTop   : 0,
    offsetRight : 0,
    offsetBot   : 0,
    offsetLeft  : 0,
  });

  this.popup.setPreset('minigame');

  if (name == undefined) this.currentMinigame = this.getRandomMinigame();
  else                   this.currentMinigame = this.minigames[name];
  this.currentMinigame.init();
  this.currentMinigame = this.currentMinigame.game;
  this.currentPresetFunction = this.currentMinigame.preset;
  this.popup.setPreset('minigame');
  this.imageData();

  for(let i = 0; i < entityManager._players.length; i++) {
    entityManager._players[i].eventPlayer.initMinigameRoom();
    entityManager._players[i].eventPlayer.changeRoom(2);
  }

  this.currentMinigame.init();
  this.minigame_is_running = true;

},

endMinigame: function() {
  this.popup = null;
  this.currentMinigame = null;
  this.currentPresetFunction = null;
  this.minigame_is_running = false;

  for(let i = 0; i < entityManager._players.length; i++) {
    entityManager._players[i].eventPlayer.changeRoom(0);
  }

  // start the next round!
  stateManager.nextRound();
},

rewards: function() {
  this.placements = this.currentMinigame.placements;
  this.winningPopup();

  const players = entityManager._players;
  let coins = 20;
  let index = 1;
  for (let key in this.placements) {
    const player = players.find(obj => obj.player_id === this.placements[index]);
    if (index === 1) player.minigames_won++;
    player.coins += coins;
    console.log(player);
    //networkManager.emit("update_player", player);
    coins -= 5;
    if (coins < 0) coins = 0;
    index++;
  };
  stateManager.updateImageData('scoreRoom');
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


newRulesPopup: function(string, lines) {
  this.rules_popup = new PopUp({
    offsetTop   : 0.2,
    offsetRight : 0.04,
    offsetBot   : 0.2,
    offsetLeft  : 0.04,
    word        : string,
    textLines   : lines,
  });
  this.rules_popup.setPreset('minigame_ready');
},

winningPopup: function() {
  const players = entityManager._players;
  let index = 1;
  let player_ids_order = [];
  for (let key in this.placements) {
    const player = players.find(obj => obj.player_id === this.placements[index]);
    player_ids_order.push(player.player_id);
    index++;
  };
  let lines = 3;
  let coins = 20;
  let string = "REWARDS/"
  for (let i=0; i<player_ids_order.length; i++) {
    const player = players.find(obj => obj.player_id === player_ids_order[i]);
    const name = g_playerSprites[player.spriteID].name.toUpperCase();
    string += name + " GETS " + coins + " COINS/";
    coins -= 5;
    if (coins < 0) coins = 0;
    lines++;
  }

  this.winning_popup = new PopUp({
    offsetTop   : 0.2,
    offsetRight : 0.02,
    offsetBot   : 0.2,
    offsetLeft  : 0.02,
    word        : string,
    textLines   : lines,
  });
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
  if (this.rules_popup != null)
    this.rules_popupSprite = g_ctx.getImageData(this.rules_popup.left, this.rules_popup.top, this.rules_popup.width, this.rules_popup.height);
  if (this.winning_popup != null)
    this.winning_popupSprite = g_ctx.getImageData(this.winning_popup.left, this.winning_popup.top, this.winning_popup.width, this.winning_popup.height);
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
  if (this.rules_popup != null)
    this.rules_popupSprite = g_ctx.getImageData(this.rules_popup.left, this.rules_popup.top, this.rules_popup.width, this.rules_popup.height);
  if (this.winning_popup != null)
    this.winning_popupSprite = g_ctx.getImageData(this.winning_popup.left, this.winning_popup.top, this.winning_popup.width, this.winning_popup.height);
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
    // render minigame popup
    ctx.putImageData(this.popupSprite, this.popup.left, this.popup.top);
    this.popup.render(ctx);
      // render the rules popup inside the current minigame
      if (this.rules_popup != null) {
        ctx.putImageData(this.rules_popupSprite, this.rules_popup.left, this.rules_popup.top);
        this.rules_popup.render(ctx);
      }
      // render the winning popup inside the current minigame
      if (this.winning_popup != null) {
        try {
          ctx.putImageData(this.winning_popupSprite, this.winning_popup.left, this.winning_popup.top);
        } catch(e) {
          this.winning_popupSprite = g_ctx.getImageData(this.winning_popup.left, this.winning_popup.top, this.winning_popup.width, this.winning_popup.height);
          ctx.putImageData(this.winning_popupSprite, this.winning_popup.left, this.winning_popup.top);
        }
        this.winning_popup.render(ctx);
      }
    // render current minigame
    if (this.currentMinigame != null) {
      this.currentMinigame.render(ctx);
    }
  }
},

// ==============
// DYNAMIC RENDER
// ==============

dynamicRender: function(ctx) {
  this.popup.dynamicRender(ctx);
  if (this.rules_popup != null)
    this.rules_popup.dynamicRender(ctx);
  if (this.winning_popup != null)
    this.winning_popup.dynamicRender(ctx);
},

// =============
// STATIC RENDER
// =============

staticRender: function(ctx) {
  this.popup.staticRender(ctx);
  if (this.rules_popup != null)
    this.rules_popup.staticRender(ctx);
  if (this.winning_popup != null)
    this.winning_popup.staticRender(ctx);
},

}
