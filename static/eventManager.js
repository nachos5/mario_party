// =================================================== //
/* this manager includes all the events by tile number
   example: to call event 36 you do: eventManager[36](); */
// =================================================== //

/* IF WE HAVE NON-INSTANT EVENTS IT'S IMPORTANT TO SET mapManager.eventIsRunning
   TO FALSE WHEN THEY ARE DONE */

   /*
   00 - no space (background), 01 - blue tile (gain coins), 02 - red tile (lose coins)
   36 - arrow up, 37 - arrow right, 38 - arrow down, 39 - arrow left
   60 - green pipe, 61 - red pipe
   03 - question mark, 04 - green star
   31 - Toad, 07 - Bowser
   13 - another turn
   08 - star
   */

// our event manager object
let eventManager = {
  eventIter: 0,
  // events that require no animation
  instant_events: [03, 04, 07, 13, 31, 36, 37, 38, 39],
  // we use this to check if our event happens mid movement
  mid_movement_events: [08, 36, 37, 38, 39, 60, 61, "buyStar"],
  // we use this to check if our event happens after the movement
  after_movement_events: [01, 02],
  // bool that says if we want to render or not
  allow_rendering: false,
  // current function inside the render function
  curr_render_function: null,

  // Added
  isBlocksEvent: false,
  star_cost: 10,
  buy_star: false, // is true while star stuff is running
  can_buy_star: false, // true if the player can buy the star
  isEvent: false,
  anotherTurn: false,

  coinAmount: 3,    // How many coins gained or lost

  starPopUpSprite: 0,   // Image data

  init: function() {
    // Unregister hitboxes because of pre initialization
    //spatialManager.unregister(this.starPopup.buttonYes);
    //spatialManager.unregister(this.starPopup.buttonNo);
  },

  generateStarPopUp: function() {
  // Offset values are based on mapHeight and mapWidth
    this.starPopup = new PopUp({
      offsetTop   : 0.2,
      offsetRight : 0.02,
      offsetBot   : 0.2,
      offsetLeft  : 0.02,
      word        : 'DO YOU WANT TO BUY/ THE STAR FOR',
    });
    this.starPopup.setPreset('buyStar');

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
    this.starPopUpSprite = g_ctx.getImageData(this.starPopup.left, this.starPopup.top, this.starPopup.width, this.starPopup.height);
  },

  // =================
  // UPDATE IMAGE DATA
  // =================

  updateImageData: function() {
    // Static image data
    this.staticRender(g_ctx);
    // Dynamic image data
    this.dynamicRender(g_ctx);
    this.starPopUpSprite = g_ctx.getImageData(this.starPopup.left, this.starPopup.top, this.starPopup.width, this.starPopup.height);
  },

  getCurrPlayer: function() {
    return stateManager.curr_player;
  },

  eventIsInstant: function(id) {
    return this.instant_events.includes(id);
  },

  eventIsMidMovement: function(id) {
    return this.mid_movement_events.includes(id);
  },

  // ========= GAMEROOM EVENTS ========== //
  // ROLL EVENT
  rollEvent: function() {

  },

  // BLOCKS EVENT
  blocksEvent: function() {
      this.isEvent = true;
      this.isBlocksEvent = true;
      // Change state of pipes, off -> opening
      if(stateManager.game_room.isAnimating === 0) {
        stateManager.game_room.isAnimating = 1;
      }
      // When pipes are opened, opening -> done
      if(stateManager.game_room.isAnimating === 2) {
        if (entityManager._eventBlocks.length === 0) {
          entityManager.generateEventBlocks();
          stateManager.curr_player.eventPlayer.changeRoom(1);
        }
      }
  },

  closeBlocksEvent: function() {
    // Event is done, start closing
    this.isEvent = false;
    this.isBlocksEvent = false;
    stateManager.curr_player.eventPlayer.changeRoom(0);
    stateManager.callNextTurn();
  },

  // ==== EVENT SPACES ==== //
  
  // Green questionmark - random event
  03: function() {

    let events = [01, 02, 04, 07, 13, 31];
    let random = Math.floor(Math.random() * events.length);

    // Call a random event
    this[events[random]]();
  },

  // Green star - initialize blocks event
  04: function() {
    this.blocksEvent();
  },

  // Bowser, everbody loses coins
  07: function() {
    const players = entityManager._players;

    for(let i = 0; i < players.length; i++) {
      stateManager.updateCollectable(players[i], 'coin', -this.coinAmount*2);
      animationManager.generateMapAnimation('coinUp', this.coinAmount*2, players[i].tt_player);
    }
  },

  // Swap 
  13: function() {
    console.log("i'am toad")
  },


  // ==== COLLECTABLES ==== //

  // blue tile - gain 3 coins, or potentially gain a star! //
  01: function(parameters) {
    const player = this.getCurrPlayer();
    stateManager.updateCollectable(player, 'coin', this.coinAmount);
    animationManager.generateMapAnimation('coinDown', this.coinAmount);
  },

  // red tile - lose 3 coins //
  02: function(parameters) {
    const player = this.getCurrPlayer();
    stateManager.updateCollectable(player, 'coin', -this.coinAmount);
    animationManager.generateMapAnimation('coinUp', this.coinAmount);
  },


  // PLAYER GOES PAST A STAR //
  buyStar: function(parameters) {
    // initial parameters
    if (parameters) {
      const pl = this.getCurrPlayer();
      this.buy_star = true;
      if (pl.coins >= this.star_cost) {
        this.can_buy_star = true;
        this.eventIter = 0;
      }
      else {
        this.can_buy_star = false;
        this.eventIter = -100;
      }
      this.generateStarPopUp();
      this.curr_render_function = this.starRender;
      this.allow_rendering = true;

      // Register button hitboxes
      //spatialManager.register(this.starPopup.buttonYes);
      //spatialManager.register(this.starPopup.buttonNo);
    }
    const player = this.getCurrPlayer();
    // handle click on yes button
    if (this.eventIter == 1) {
      this.allow_rendering = false;
      this.curr_render_function = null;
      // player gains a star
      this.eventIter += 1;
    }
    // handle click on no button
    else if (this.eventIter == -1) {
      this.allow_rendering = false;
      this.curr_render_function = null;
      mapManager.moveStar();
      this.buy_star = false;
      this.updateStarRenderOnce = true;
      mapManager.eventIsRunning = false;
    }

    //  ==== if we are here then the player bought the star and we display animations ==== //
    else if (this.eventIter > 1) {
      const star = entityManager.getStar();
      if (this.eventIter == 150) {
        // play sound!
        audioManager.playAndEmit("star", 0.3 , false, 0.8);
      }
      if (this.eventIter === 200) {
        // reset star stuff
        star.width = star.originalWidth;
        star.height = star.originalHeight;
        // end the event and gain a star
        player.stars++;
        mapManager.moveStar();
        this.buy_star = false;
        this.updateStarRenderOnce = true;
        mapManager.eventIsRunning = false;
      }
      // animation stuff
      star.rotation += Math.PI * (this.eventIter * 0.0005 * window.du); // rotate faster
      // enlargen the star
      star.width += this.eventIter * 0.002 * window.du;
      star.height += this.eventIter * 0.002 * window.du;
      this.eventIter++;
    }
  },

  updateStarRenderOnce: true,
  // RENDERING THE STAR POPUP AND HANDLES CLICKS ON YES + NO BUTTONS //
  starRender: function(ctx) {
    // Render static object
    ctx.putImageData(this.starPopUpSprite, this.starPopup.left, this.starPopup.top);
    this.starPopup.render(ctx);

    // yes button
    let yes = this.starPopup.buttonYes;
    const yes_cx = yes.cx - yes.width/2;
    const yes_cy = yes.cy - yes.height/2;

    // current player can't buy the star
    if (!this.can_buy_star) {
      if (this.updateStarRenderOnce) { // we run this only once
        this.starPopup.buttonYes.onSprite = g_sprites.greyYes;
        this.starPopup.buttonYes.offSprite = g_sprites.greyYes;
        this.updateImageData();
      }
      this.updateStarRenderOnce = false;
    }
    else {
      if (g_mouseX > yes_cx && g_mouseY > yes_cy &&
          g_mouseX < yes_cx + yes.width && g_mouseY < yes_cy + yes.height) {
            if (eatClick("event")) {
              this.eventIter = 1;
            }
          }
      }

    // no button
    let no = this.starPopup.buttonNo;
    const no_cx = no.cx - no.width/2;
    const no_cy = no.cy - no.height/2;

    if (g_mouseX > no_cx && g_mouseY > no_cy &&
        g_mouseX < no_cx + yes.width && g_mouseY < no_cy + no.height) {
          if (eatClick("event")) {
            this.eventIter = -1;
          }
        }

  },



  // ========= ARROW EVENTS ========== //
  /* the player ignores the prev position tile so we can use that to our advantage
     by setting the prev position to the tile that the arrow is not pointing at */
  // arrow up
  36: function() {
    mapManager.arrows["up"] = true;
    mapManager.diceThrow++; // free movement
  },
  // arrow right
  37: function() {
    mapManager.arrows["right"] = true;
    mapManager.diceThrow++; // free movement
  },
  // arrow down
  38: function() {
    mapManager.arrows["down"] = true;
    mapManager.diceThrow++; // free movement
  },
  // arrow left
  39: function() {
    mapManager.arrows["left"] = true;
    mapManager.diceThrow++; // free movement
  },


  // ========= PIPE EVENTS ========== //
  //     pipes give free movement!
  // destination pipe is chosen at random!

  // green pipe, we use the eventIter to control the flow
   60: function(parameters=false, tileNo=60) {
    const player = this.getCurrPlayer().tt_player;
    const myPos = mapManager.getPosition(player);
    if (parameters) {
      this.eventIter = 100;
    }
    // fade out
    if (this.eventIter > 0) {
      if (this.eventIter == 80 ) audioManager.playAndEmit("pipe", 0.1 , false, 1);
      player.alpha -= 0.01;
      if (player.alpha < 0) player.alpha = 0;
      this.eventIter--;
      return;
    }
    // set position to the other pipe (runs only once)
    if (this.eventIter == 0) {
      const tilePos = mapManager.getTilePositions(tileNo); // get all pipes
      // filter out the pipe we are on currently
      const notMyTiles = tilePos.filter(obj => obj.row != myPos.row && obj.column != myPos.column);
      // get 1 random pipe
      const rand = parseInt(Math.random() * notMyTiles.length);
      const notMyTile = notMyTiles[rand];
      // set the player position to the chosen pipe
      mapManager.setPosition(player, notMyTile);
      mapManager.setPrevPosition(player, notMyTile);
      // set eventiter as negative so we only run the last part (fade in)
      this.eventIter = -200;
      return;
    }
    // fade in
    if (this.eventIter < 0) {
      if (this.eventIter == -180) audioManager.playAndEmit("pipe", 0.2, false, 1 );
      player.alpha += 0.01;
      if (player.alpha > 1) player.alpha = 1;
      this.eventIter++;
    }
    // the event is done
    if (this.eventIter == -100) {
      // pipes give free movement so we go to the next tile
      mapManager.diceThrow++;
      mapManager.eventIsRunning = false; // event is done
    }
  },

  // red pipe, same code for both pipes so we just "redirect"
  61: function(parameters=false) {
    this[60](parameters, 61);
  },


  // ==== TURN EVENTS ==== //
  // Toad - another turn
  31: function() {
    this.anotherTurn = true;
  },


  // ==== UPDATE ==== //
  update: function(du) {
    //this.starPopup.update(du);
    if (this.allow_rendering) {
      this.starPopup.update(du);
    }
  },

  // ==== RENDERING ==== //
  render: function(ctx) {
    if (this.allow_rendering) {
      this.curr_render_function(ctx);
    }
  },

  // ==============
  // DYNAMIC RENDER
  // ==============

  dynamicRender: function(ctx) {
    this.starPopup.dynamicRender(ctx);
  },

  // =============
  // STATIC RENDER
  // =============

  staticRender: function(ctx) {
    this.starPopup.staticRender(ctx);
  },

};
