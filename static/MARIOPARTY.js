// ===========
// MARIO PARTY
// ===========

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// Master global
let g_startGame = false;    // Game start when ready button is pressed for all players

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

function updateSimulation(du) {
    processDiagnostics();
    stateManager.update(du);
    spatialManager.update(du);
    entityManager.update(du);
    mapManager.update(du);
    eventManager.update(du);

    if (!g_startGame) { menuManager.update(du) }
}

// ================
// GAME DIAGNOSTICS
// ================

let g_renderSpatialDebug = false;
let g_useGrid = false;
let g_useAnimation = true;

// Render hit boxes
// Render a grid
// Render animations

let KEY_SPATIAL = keyCode('X');
let KEY_GRID = keyCode('F');
let KEY_ANIMATION = keyCode('I');

// ===================
// PROCESS DIAGNOSTICS
// ===================

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;  // Hit box
    if (eatKey(KEY_GRID)) g_useGrid = !g_useGrid;                           // Grid
    if (eatKey(KEY_ANIMATION)) g_useAnimation = !g_useAnimation;            // Animation
}


// =================
// RENDER SIMULATION
// =================

function renderSimulation(ctx) {

    mapManager.render(ctx);
    stateManager.render(ctx);
    entityManager.render(ctx);
    eventManager.render(ctx);

    if (!g_startGame) { menuManager.render(ctx) }
    // Tester
    //g_sprites.selectLuigi.drawClipped(ctx, 500, g_canvas.height)
    //g_sprites.selectMario.drawClipped(ctx, g_canvas.width, g_canvas.height)
    if (g_startGame && eventManager.popup != null) {
      eventManager.popup.render(ctx)
    }

    if (g_renderSpatialDebug) spatialManager.render(ctx);

}

// =======================
// REQUEST PRELOADS IMAGES
// =======================

function requestPreloads_images() {

    let requiredImages = {
        // Background
        background1     : "static/assets/Mario-Background.jpg",
        brickBlock      : "static/assets/Brick_Block.png",
        backGreenPipe   : "static/assets/NSMBU-Green_Pipe.png",
        backBluePipe    : "static/assets/NSMBU-Blue_Pipe.png",
        backRedPipe     : "static/assets/NSMBU-Red_Pipe.png",
        backYellowPipe  : "static/assets/NSMBU-Yellow_Pipe.png",

        // Popup
        buyStarText     : "static/assets/popBuyStar.png",

        // Menu
        marioPartyLogo  : "static/assets/Mario_Party_logo.png",
        background2     : "static/assets/superMarioBackground.jpg",
        framePipeTop    : "static/assets/superMarioWorldPipeTop.png",
        framePipeMid    : "static/assets/superMarioWorldPipeMid.png",
        characters      : "static/assets/marioCharacters.png",

        // Button
        cyanReady       : "static/assets/cyanReady.png",
        greenReady      : "static/assets/greenReady.png",
        greenYes        : "static/assets/greenYesButton.png",
        greenNo         : "static/assets/greenNoButton.png",
        cyanYes         : "static/assets/cyanYesButton.png",
        cyanNo          : "static/assets/cyanNoButton.png",

        // Map
        tiles2          : "static/assets/marioPartyTiles.png",
        tiles           : "static/assets/spaces3.png",
        greenPipe       : "static/assets/WarpPipeGreen.png",
        redPipe         : "static/assets/RedWarpPipeRed.png",

        // Objects
        die0             : "static/assets/diceBlock0.png",
        die1             : "static/assets/diceBlock1.png",
        die2             : "static/assets/diceBlock2.png",
        die3             : "static/assets/diceBlock3.png",
        die4             : "static/assets/diceBlock4.png",
        die5             : "static/assets/diceBlock5.png",
        die6             : "static/assets/diceBlock6.png",
        die7             : "static/assets/diceBlock7.png",
        die8             : "static/assets/diceBlock8.png",
        die9             : "static/assets/diceBlock9.png",
        die10            : "static/assets/diceBlock10.png",

        eventBlock       : "static/assets/marioBlock.png",
        coinAni          : "static/assets/marioCoinAnimation.png",
        star             : "static/assets/marioStarHiRes.png",
        arrow            : "static/assets/marioArrow.png",

        numbers          : "static/assets/marioNumbers.png",
        alph             : "static/assets/FontPixels.png",
    };

    imagesPreload(requiredImages, g_images, requestPreloads_audio);
}

// ======================
// REQUEST PRELOADS AUDIO
// ======================

function requestPreloads_audio() {
  audioManager.preloadAll(waitForServerResponse);
}

// ========================
// WAIT FOR SERVER RESPONSE
// ========================

function waitForServerResponse() {
  let breakIter = 0;
  // we wait until the server sends us required information about our player
  while ((networkManager.player_info.uuid == -1 &&
          networkManager.player_info.player_id == -1) &&
          !networkManager.error) {
            if (breakIter > 1000) break;
            breakIter++;
          };

  preloadDone();
}

// ============
// PRELOAD DONE
// ============

function preloadDone() {
    // Menu
    g_sprites.framePipeTop      = new Sprite(g_images.framePipeTop);
    g_sprites.framePipeMid      = new Sprite(g_images.framePipeMid);
    g_sprites.marioPartyLogo    = new Sprite(g_images.marioPartyLogo);
    g_sprites.background2       = new Sprite(g_images.background2);

    // Popup
    g_sprites.buyStarText       = new Sprite(g_images.buyStarText);

    // Character Select
    // Row 1
    g_sprites.selectMario        = new Sprite(g_images.characters,  200, 350, 0, 2, 200, 275);
    g_sprites.selectPinkPeach    = new Sprite(g_images.characters,  600, 350, 0, 2, 200, 275);
    g_sprites.selectYoshi        = new Sprite(g_images.characters, 1000, 350, 0, 2, 200, 275);
    g_sprites.selectWario        = new Sprite(g_images.characters, 1400, 350, 0, 2, 200, 275);
    g_sprites.selectPaleToad     = new Sprite(g_images.characters, 1800, 350, 0, 2, 200, 275);
    // Row 2
    g_sprites.selectLuigi        = new Sprite(g_images.characters,  200, 930, 0, 2, 200, 275);
    g_sprites.selectYellowPeach  = new Sprite(g_images.characters,  600, 930, 0, 2, 200, 275);
    // Skipped one sprite
    g_sprites.selectWaluigi      = new Sprite(g_images.characters, 1400, 930, 0, 2, 200, 275);
    g_sprites.selectPinkToad     = new Sprite(g_images.characters, 1800, 930, 0, 2, 200, 275);
    g_sprites.selectBowserjr     = new Sprite(g_images.characters, 2200, 930, 0, 2, 200, 275);
    // Skipped one sprite
    g_sprites.selectBoo          = new Sprite(g_images.characters, 2970, 930, 0, 2, 200, 275);

    // Button
    g_sprites.cyanReady         = new Sprite(g_images.cyanReady);
    g_sprites.greenReady        = new Sprite(g_images.greenReady);
    g_sprites.greenYes          = new Sprite(g_images.greenYes);
    g_sprites.greenNo           = new Sprite(g_images.greenNo);
    g_sprites.cyanYes           = new Sprite(g_images.cyanYes);
    g_sprites.cyanNo            = new Sprite(g_images.cyanNo);

    // Background
    g_sprites.background1       = new Sprite(g_images.background1);
    g_sprites.brickBlock        = new Sprite(g_images.brickBlock);

    g_sprites.backGreenPipe     = new Sprite(g_images.backGreenPipe);
    g_sprites.backBluePipe      = new Sprite(g_images.backBluePipe);
    g_sprites.backRedPipe       = new Sprite(g_images.backRedPipe);
    g_sprites.backYellowPipe    = new Sprite(g_images.backYellowPipe);

    // Map
    g_sprites.tiles             = new Sprite(g_images.tiles);
    g_sprites.greenPipe         = new Sprite(g_images.greenPipe);
    g_sprites.redPipe           = new Sprite(g_images.redPipe);

    // Tiles2
    // Column 1
    g_sprites.mario             = new Sprite(g_images.tiles2, 655, 55,  0, 2, 30, 30);//
    g_sprites.luigi             = new Sprite(g_images.tiles2, 655, 120, 0, 2, 30, 30);//
    g_sprites.pinkPeach         = new Sprite(g_images.tiles2, 655, 185, 0, 2, 30, 30);//
    g_sprites.yoshi             = new Sprite(g_images.tiles2, 655, 255, 0, 2, 30, 30);//
    g_sprites.wario             = new Sprite(g_images.tiles2, 655, 320, 0, 2, 30, 30);//
    g_sprites.yellowPeach       = new Sprite(g_images.tiles2, 655, 385, 0, 2, 30, 30);//
    // Column 2
    g_sprites.waluigi           = new Sprite(g_images.tiles2, 720, 55,  0, 2, 30, 30);//
    g_sprites.paleToad          = new Sprite(g_images.tiles2, 720, 120, 0, 2, 30, 30);//
    g_sprites.boo               = new Sprite(g_images.tiles2, 720, 185, 0, 2, 30, 30);
    g_sprites.bowserjr          = new Sprite(g_images.tiles2, 723, 250, 0, 2, 30, 30);
    g_sprites.pinkToad          = new Sprite(g_images.tiles2, 720, 320, 0, 2, 30, 30);//

    // Objects
    // Dice
    g_sprites.die0              = new Sprite(g_images.die0);
    g_sprites.die1              = new Sprite(g_images.die1);
    g_sprites.die2              = new Sprite(g_images.die2);
    g_sprites.die3              = new Sprite(g_images.die3);
    g_sprites.die4              = new Sprite(g_images.die4);
    g_sprites.die5              = new Sprite(g_images.die5);
    g_sprites.die6              = new Sprite(g_images.die6);
    g_sprites.die7              = new Sprite(g_images.die7);
    g_sprites.die8              = new Sprite(g_images.die8);
    g_sprites.die9              = new Sprite(g_images.die9);
    g_sprites.die10             = new Sprite(g_images.die10);

    // =====
    // ITEMS
    // =====
    g_sprites.star              = new Sprite(g_images.star);

    // Coin Animated
    let coin = [];
    coin.push(new Sprite(g_images.coinAni, 55,   100, 0, 2, 50, 50));  // Frame 1
    coin.push(new Sprite(g_images.coinAni, 175,  100, 0, 2, 50, 50));  // Frame 2
    coin.push(new Sprite(g_images.coinAni, 295,  100, 0, 2, 50, 50));  // Frame 3
    coin.push(new Sprite(g_images.coinAni, 415,  100, 0, 2, 50, 50));  // Frame 4
    coin.push(new Sprite(g_images.coinAni, 535,  100, 0, 2, 50, 50));  // Frame 5
    coin.push(new Sprite(g_images.coinAni, 655,  100, 0, 2, 50, 50));  // Frame 6

    g_aniSprites.coin = coin;

    // GameRoom and ScoreRoom
    g_sprites.eventBlock      = new Sprite(g_images.eventBlock);
    g_sprites.arrow           = new Sprite(g_images.arrow);

    // Numbers
    g_numberSprites.num0      = new Sprite(g_images.numbers, 50,  195, 0, 2, 50, 55);  // 0
    g_numberSprites.num1      = new Sprite(g_images.numbers, 140, 195, 0, 2, 38, 55);  // 1
    g_numberSprites.num2      = new Sprite(g_images.numbers, 225, 195, 0, 2, 45, 55);  // 2
    g_numberSprites.num3      = new Sprite(g_images.numbers, 315, 195, 0, 2, 45, 55);  // 3
    g_numberSprites.num4      = new Sprite(g_images.numbers, 405, 195, 0, 2, 45, 55);  // 4
    g_numberSprites.num5      = new Sprite(g_images.numbers, 500, 195, 0, 2, 50, 55);  // 5
    g_numberSprites.num6      = new Sprite(g_images.numbers, 595, 195, 0, 2, 45, 55);  // 6
    g_numberSprites.num7      = new Sprite(g_images.numbers, 685, 195, 0, 2, 45, 55);  // 7
    g_numberSprites.num8      = new Sprite(g_images.numbers, 780, 195, 0, 2, 45, 55);  // 8
    g_numberSprites.num9      = new Sprite(g_images.numbers, 875, 195, 0, 2, 45, 55);  // 9

    // Alphabet
    g_alphSprites.A           = new Sprite(g_images.alph, 35,   37, 0, 2, 25, 40);  // A
    g_alphSprites.B           = new Sprite(g_images.alph, 85,   37, 0, 2, 25, 40);  // B
    g_alphSprites.C           = new Sprite(g_images.alph, 135,  37, 0, 2, 25, 40);  // C
    g_alphSprites.D           = new Sprite(g_images.alph, 185,  37, 0, 2, 25, 40);  // D
    g_alphSprites.E           = new Sprite(g_images.alph, 235,  37, 0, 2, 25, 40);  // E
    g_alphSprites.F           = new Sprite(g_images.alph, 286,  37, 0, 2, 25, 40);  // F
    g_alphSprites.G           = new Sprite(g_images.alph, 337,  37, 0, 2, 25, 40);  // G
    g_alphSprites.H           = new Sprite(g_images.alph, 388,  37, 0, 2, 25, 40);  // H
    g_alphSprites.I           = new Sprite(g_images.alph, 440,  37, 0, 2, 25, 40);  // I

    g_alphSprites.J           = new Sprite(g_images.alph, 35,  125, 0, 2, 25, 40);  // J
    g_alphSprites.K           = new Sprite(g_images.alph, 85,  125, 0, 2, 25, 40);  // K
    g_alphSprites.L           = new Sprite(g_images.alph, 135, 125, 0, 2, 25, 40);  // L
    g_alphSprites.M           = new Sprite(g_images.alph, 185, 125, 0, 2, 25, 40);  // M
    g_alphSprites.N           = new Sprite(g_images.alph, 235, 125, 0, 2, 25, 40);  // N
    g_alphSprites.O           = new Sprite(g_images.alph, 286, 125, 0, 2, 25, 40);  // O
    g_alphSprites.P           = new Sprite(g_images.alph, 337, 125, 0, 2, 25, 40);  // P
    g_alphSprites.Q           = new Sprite(g_images.alph, 388, 125, 0, 2, 25, 40);  // Q
    g_alphSprites.R           = new Sprite(g_images.alph, 440, 125, 0, 2, 25, 40);  // R
    g_alphSprites.Qmark       = new Sprite(g_images.alph, 492, 125, 0, 2, 25, 40);  // ?

    g_alphSprites.S           = new Sprite(g_images.alph, 35,  211, 0, 2, 25, 40);  // S
    g_alphSprites.T           = new Sprite(g_images.alph, 85,  211, 0, 2, 25, 40);  // T
    g_alphSprites.U           = new Sprite(g_images.alph, 135, 211, 0, 2, 25, 40);  // U
    g_alphSprites.V           = new Sprite(g_images.alph, 185, 211, 0, 2, 25, 40);  // V
    g_alphSprites.W           = new Sprite(g_images.alph, 237, 211, 0, 2, 25, 40);  // W
    g_alphSprites.X           = new Sprite(g_images.alph, 287, 211, 0, 2, 25, 40);  // X
    g_alphSprites.Y           = new Sprite(g_images.alph, 339, 211, 0, 2, 25, 40);  // Y
    g_alphSprites.Z           = new Sprite(g_images.alph, 389, 211, 0, 2, 25, 40);  // Z
    g_alphSprites.Dot         = new Sprite(g_images.alph, 441, 211, 0, 2, 25, 40);  // .

    loadSpriteLibaries();

    mapManager.init();
    entityManager.init();

    /* if we have no existing players we go straight to this function, else we
       go to it when we have loaded in the existing players (from the network manager) */
    if (!networkManager.player_info.existing_players) {
      preloadDoneNext();
    }
    else {
      networkManager.next = preloadDoneNext;
    }

}

let g_images = {};      // All images

// ==============
// GLOBAL SPRITES
// ==============

let g_sprites       = {};   // Misc sprites

let g_playerSprites = [];   // Player sprites in use
let g_itemSprites   = [];   // Item sprites in use
let g_aniSprites    = [];   // Animation

let g_alphSprites   = {};   // Alphabet + symbols
let g_numberSprites = {};   // Numbers

let g_charSelectionSprites = [];  // Character Selection

// ====================
// LOAD SPRITE LIBARIES
// ====================

function loadSpriteLibaries() {
    // Players
    g_playerSprites.push({sp : g_sprites.mario       , id : 0  });
    g_playerSprites.push({sp : g_sprites.pinkPeach   , id : 1  });
    g_playerSprites.push({sp : g_sprites.yoshi       , id : 2  });
    g_playerSprites.push({sp : g_sprites.wario       , id : 3  });
    g_playerSprites.push({sp : g_sprites.paleToad    , id : 4  });
    g_playerSprites.push({sp : g_sprites.luigi       , id : 5  });
    g_playerSprites.push({sp : g_sprites.yellowPeach , id : 6  });
    g_playerSprites.push({sp : g_sprites.waluigi     , id : 7  });
    g_playerSprites.push({sp : g_sprites.pinkToad    , id : 8  });
    g_playerSprites.push({sp : g_sprites.bowserjr    , id : 9  });
    g_playerSprites.push({sp : g_sprites.boo         , id : 10 });

    // Items
    g_itemSprites.push({sp : g_aniSprites.coin[0], id : 0, type : 'clipped'});
    g_itemSprites.push({sp : g_sprites.star      , id : 1, type : 'normal' });

    // Character Selection
    g_charSelectionSprites.push({sp : g_sprites.selectMario,        id : 0  });
    g_charSelectionSprites.push({sp : g_sprites.selectPinkPeach,    id : 1  });
    g_charSelectionSprites.push({sp : g_sprites.selectYoshi,        id : 2  });
    g_charSelectionSprites.push({sp : g_sprites.selectWario,        id : 3  });
    g_charSelectionSprites.push({sp : g_sprites.selectPaleToad,     id : 4  });
    g_charSelectionSprites.push({sp : g_sprites.selectLuigi,        id : 5  });
    g_charSelectionSprites.push({sp : g_sprites.selectYellowPeach,  id : 6  });
    g_charSelectionSprites.push({sp : g_sprites.selectWaluigi,      id : 7  });
    g_charSelectionSprites.push({sp : g_sprites.selectPinkToad,     id : 8  });
    g_charSelectionSprites.push({sp : g_sprites.selectBowserjr,     id : 9  });
    g_charSelectionSprites.push({sp : g_sprites.selectBoo,          id : 10 });


    console.log(g_playerSprites);
    console.log(g_itemSprites);
    console.log(g_aniSprites);

    console.log(g_alphSprites);
    console.log(g_numberSprites);
}

// =================
// PRELOAD DONE NEXT
// =================

function preloadDoneNext() {
  stateManager.init();
  entityManager.sharedObjects();
  menuManager.init();
  eventManager.init(new PopUp());

  // play background music
  //audioManager.playAudio(audioManager.bufferArr["cantina"], 0, true);
  main.init();
}

requestPreloads_images();
