// ===========
// MARIO PARTY
// ===========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

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

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    processDiagnostics();
    stateManager.update(du);
    entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
// New Boolean
let g_useGrid = false;
let g_useAnimation = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

// New Keys
let KEY_GRID = keyCode('F');
let KEY_ANIMATION = keyCode('I');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    // Grid
    if (eatKey(KEY_GRID)) g_useGrid = !g_useGrid;

    if (eatKey(KEY_ANIMATION)) g_useAnimation = !g_useAnimation;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    mapManager.render(ctx);
    stateManager.render(ctx);
    entityManager.render(ctx);

    // Tester
    //g_sprites.mario.drawClipped(ctx, 500, 500)

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads_images() {

    var requiredImages = {
        ship            : "static/assets/boardgamePack_v2/PNG/Pieces (Purple)/piecePurple_border15.png",

        // Background
        background1     : "static/assets/Mario-Background.jpg",
        brickBlock      : "static/assets/Brick_Block.png",
        backGreenPipe   : "static/assets/NSMBU-Green_Pipe.png",
        backBluePipe    : "static/assets/NSMBU-Blue_Pipe.png",
        backRedPipe     : "static/assets/NSMBU-Red_Pipe.png",
        backYellowPipe  : "static/assets/NSMBU-Yellow_Pipe.png",

        // Map
        tiles2          : "static/assets/marioPartyTiles.png",
        tiles           : "static/assets/spaces3.png",
        greenPipe       : "static/assets/WarpPipeGreen.png",
        redPipe         : "static/assets/RedWarpPipeRed.png",

        // Players
        blackPlayer     : "static/assets/boardgamePack_v2/PNG/Pieces (Black)/pieceBlack_border02.png",
        bluePlayer      : "static/assets/boardgamePack_v2/PNG/Pieces (Blue)/pieceBlue_border03.png",
        greenPlayer     : "static/assets/boardgamePack_v2/PNG/Pieces (Green)/pieceGreen_border02.png",
        purplePlayer    : "static/assets/boardgamePack_v2/PNG/Pieces (Purple)/piecePurple_border02.png",
        redPlayer       : "static/assets/boardgamePack_v2/PNG/Pieces (Red)/pieceRed_border02.png",
        whitePlayer     : "static/assets/boardgamePack_v2/PNG/Pieces (White)/pieceWhite_border02.png",
        yellowPlayer    : "static/assets/boardgamePack_v2/PNG/Pieces (Yellow)/pieceYellow_border01.png",

        // Objects
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
        coin             : "static/assets/marioCoin.png",
        coinAni          : "static/assets/marioCoinAnimation.png",
        star             : "static/assets/marioStarHiRes.png",
        numbers          : "static/assets/marioNumbers.png",
        place            : "static/assets/marioNumbers2.png",
        alph             : "static/assets/FontPixels.png",
    };

    imagesPreload(requiredImages, g_images, requestPreloads_audio);
}

function requestPreloads_audio() {
  audioManager.preloadAll(waitForServerResponse);
}

function waitForServerResponse() {
  // we wait until the server sends us required information about our player
  while (networkManager.player_info.socket_id == -1 &&
         networkManager.player_info.player_id == -1) {};

  preloadDone();
}

var g_sprites = {};

function preloadDone() {
    g_sprites.ship              = new Sprite(g_images.ship);

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
    g_sprites.mario             = new Sprite(g_images.tiles2, 655, 55, 0, 2, 30, 30);
    g_sprites.luigi             = new Sprite(g_images.tiles2, 655, 120, 0, 2, 30, 30);
    g_sprites.pinkPeach         = new Sprite(g_images.tiles2, 655, 185, 0, 2, 30, 30);
    g_sprites.yoshi             = new Sprite(g_images.tiles2, 655, 255, 0, 2, 30, 30);
    g_sprites.wario             = new Sprite(g_images.tiles2, 655, 320, 0, 2, 30, 30);
    g_sprites.yellowPeach       = new Sprite(g_images.tiles2, 655, 385, 0, 2, 30, 30);
    // Column 2
    g_sprites.waluigi           = new Sprite(g_images.tiles2, 720, 55, 0, 2, 30, 30);
    g_sprites.paleToad          = new Sprite(g_images.tiles2, 720, 120, 0, 2, 30, 30);
    g_sprites.boo               = new Sprite(g_images.tiles2, 720, 185, 0, 2, 30, 30);
    g_sprites.bowserjr          = new Sprite(g_images.tiles2, 723, 250, 0, 2, 30, 30);
    g_sprites.pinkToad          = new Sprite(g_images.tiles2, 720, 320, 0, 2, 30, 30);


    // Players
    g_sprites.blackPlayer       = new Sprite(g_images.blackPlayer);
    g_sprites.bluePlayer        = new Sprite(g_images.bluePlayer);
    g_sprites.greenPlayer       = new Sprite(g_images.greenPlayer);
    g_sprites.purplePlayer      = new Sprite(g_images.purplePlayer);
    g_sprites.redPlayer         = new Sprite(g_images.redPlayer);
    g_sprites.whitePlayer       = new Sprite(g_images.whitePlayer);
    g_sprites.yellowPlayer      = new Sprite(g_images.yellowPlayer);

    // Objects
    // Dice
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

    // Coin Animated
    g_sprites.coinAni1          = new Sprite(g_images.coinAni, 55,   100, 0, 2, 50, 50);  // Frame 1
    g_sprites.coinAni2          = new Sprite(g_images.coinAni, 175,  100, 0, 2, 50, 50);  // Frame 2
    g_sprites.coinAni3          = new Sprite(g_images.coinAni, 295,  100, 0, 2, 50, 50);  // Frame 3
    g_sprites.coinAni4          = new Sprite(g_images.coinAni, 415,  100, 0, 2, 50, 50);  // Frame 4
    g_sprites.coinAni5          = new Sprite(g_images.coinAni, 535,  100, 0, 2, 50, 50);  // Frame 5
    g_sprites.coinAni6          = new Sprite(g_images.coinAni, 655,  100, 0, 2, 50, 50);  // Frame 6

    g_sprites.coin              = new Sprite(g_images.coin);
    g_sprites.star              = new Sprite(g_images.star);
    g_sprites.eventBlock        = new Sprite(g_images.eventBlock);

    // Numbers
    g_sprites.number0           = new Sprite(g_images.numbers, 50,  195, 0, 2, 50, 55);  // 0
    g_sprites.number1           = new Sprite(g_images.numbers, 140, 195, 0, 2, 38, 55);  // 1
    g_sprites.number2           = new Sprite(g_images.numbers, 225, 195, 0, 2, 45, 55);  // 2
    g_sprites.number3           = new Sprite(g_images.numbers, 315, 195, 0, 2, 45, 55);  // 3
    g_sprites.number4           = new Sprite(g_images.numbers, 405, 195, 0, 2, 45, 55);  // 4
    g_sprites.number5           = new Sprite(g_images.numbers, 500, 195, 0, 2, 50, 55);  // 5
    g_sprites.number6           = new Sprite(g_images.numbers, 595, 195, 0, 2, 45, 55);  // 6
    g_sprites.number7           = new Sprite(g_images.numbers, 685, 195, 0, 2, 45, 55);  // 7
    g_sprites.number8           = new Sprite(g_images.numbers, 780, 195, 0, 2, 45, 55);  // 8
    g_sprites.number9           = new Sprite(g_images.numbers, 875, 195, 0, 2, 45, 55);  // 9

    // Alphabet
    g_sprites.alphA           = new Sprite(g_images.alph, 35,   37, 0, 2, 25, 40);  // A
    g_sprites.alphB           = new Sprite(g_images.alph, 85,   37, 0, 2, 25, 40);  // B
    g_sprites.alphC           = new Sprite(g_images.alph, 135,  37, 0, 2, 25, 40);  // C
    g_sprites.alphD           = new Sprite(g_images.alph, 185,  37, 0, 2, 25, 40);  // D
    g_sprites.alphE           = new Sprite(g_images.alph, 235,  37, 0, 2, 25, 40);  // E
    g_sprites.alphF           = new Sprite(g_images.alph, 286,  37, 0, 2, 25, 40);  // F
    g_sprites.alphG           = new Sprite(g_images.alph, 337,  37, 0, 2, 25, 40);  // G
    g_sprites.alphH           = new Sprite(g_images.alph, 388,  37, 0, 2, 25, 40);  // H
    g_sprites.alphI           = new Sprite(g_images.alph, 440,  37, 0, 2, 25, 40);  // I

    g_sprites.alphJ           = new Sprite(g_images.alph, 35,  125, 0, 2, 25, 40);  // J
    g_sprites.alphK           = new Sprite(g_images.alph, 85,  125, 0, 2, 25, 40);  // K
    g_sprites.alphL           = new Sprite(g_images.alph, 135, 125, 0, 2, 25, 40);  // L
    g_sprites.alphM           = new Sprite(g_images.alph, 185, 125, 0, 2, 25, 40);  // M
    g_sprites.alphN           = new Sprite(g_images.alph, 235, 125, 0, 2, 25, 40);  // N
    g_sprites.alphO           = new Sprite(g_images.alph, 286, 125, 0, 2, 25, 40);  // O
    g_sprites.alphP           = new Sprite(g_images.alph, 337, 125, 0, 2, 25, 40);  // P
    g_sprites.alphQ           = new Sprite(g_images.alph, 388, 125, 0, 2, 25, 40);  // Q
    g_sprites.alphR           = new Sprite(g_images.alph, 440, 125, 0, 2, 25, 40);  // R
    g_sprites.alphQmark       = new Sprite(g_images.alph, 492, 125, 0, 2, 25, 40);  // ?

    g_sprites.alphS           = new Sprite(g_images.alph, 35,  211, 0, 2, 25, 40);  // S
    g_sprites.alphT           = new Sprite(g_images.alph, 85,  211, 0, 2, 25, 40);  // T
    g_sprites.alphU           = new Sprite(g_images.alph, 135, 211, 0, 2, 25, 40);  // U
    g_sprites.alphV           = new Sprite(g_images.alph, 185, 211, 0, 2, 25, 40);  // V
    g_sprites.alphW           = new Sprite(g_images.alph, 237, 211, 0, 2, 25, 40);  // W
    g_sprites.alphX           = new Sprite(g_images.alph, 287, 211, 0, 2, 25, 40);  // X
    g_sprites.alphY           = new Sprite(g_images.alph, 339, 211, 0, 2, 25, 40);  // Y
    g_sprites.alphZ           = new Sprite(g_images.alph, 389, 211, 0, 2, 25, 40);  // Z
    g_sprites.alphDot         = new Sprite(g_images.alph, 441, 211, 0, 2, 25, 40);  // .

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

function preloadDoneNext() {
  stateManager.init();
  entityManager.sharedObjects();
  // play background music
  //audioManager.playAudio(audioManager.bufferArr["cantina"], 0, true);
  main.init();
}

requestPreloads_images();
