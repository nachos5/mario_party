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
    entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
// New Boolean
let g_useGrid = false;

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

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    // Grid
    if (eatKey(KEY_GRID)) g_useGrid = !g_useGrid;
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

    entityManager.render(ctx);
    mapManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads_images() {

    var requiredImages = {
        ship            : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",

        // Background
        background1     : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        backGreenPipe   : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        backBluePipe    : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        backRedPipe     : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        backYellowPipe  : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",

        // Map
        tiles           : "static/assets/boardgamePack_v2/PNG/Pieces (Black)/pieceBlack_border00.png",
        greenPipe       : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        redPipe         : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",

        // Players
        blackPlayer     : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        bluePlayer      : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        greenPlayer     : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        purplePlayer    : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        redPlayer       : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        whitePlayer     : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
        yellowPlayer    : "https://article.images.consumerreports.org/prod/content/dam/CRO%20Images%202017/Magazine-Articles/April/CR-Inline-top-picks-Toyota-Yaris-02-17",
    };

    imagesPreload(requiredImages, g_images, requestPreloads_audio);
}

function requestPreloads_audio() {
  audioManager.preloadAll(preloadDone);
}

var g_sprites = {};

function preloadDone() {

    for(let img in g_images) {
        //g_images[img].crossOrigin = "Anonymous"
        console.log(g_images[img]);
    }

    g_sprites.ship              = new Sprite(g_images.ship);

    // Background
    g_sprites.background1       = new Sprite(g_images.background1);

    g_sprites.backGreenPipe     = new Sprite(g_images.backGreenPipe);
    g_sprites.backBluePipe      = new Sprite(g_images.backBluePipe);
    g_sprites.backRedPipe       = new Sprite(g_images.backRedPipe);
    g_sprites.backYellowPipe    = new Sprite(g_images.backYellowPipe);

    // Map
    g_sprites.tiles             = new Sprite(g_images.tiles);
    g_sprites.greenPipe         = new Sprite(g_images.greenPipe);
    g_sprites.redPipe           = new Sprite(g_images.redPipe);


    // Players
    g_sprites.blackPlayer       = new Sprite(g_images.blackPlayer);
    g_sprites.bluePlayer        = new Sprite(g_images.bluePlayer);
    g_sprites.greenPlayer       = new Sprite(g_images.greenPlayer);
    g_sprites.purplePlayer      = new Sprite(g_images.purplePlayer);
    g_sprites.redPlayer         = new Sprite(g_images.redPlayer);
    g_sprites.whitePlayer       = new Sprite(g_images.whitePlayer);
    g_sprites.yellowPlayer      = new Sprite(g_images.yellowPlayer);

    entityManager.init();
    mapManager.init();

    // play background music
    //audioManager.playAudio(audioManager.bufferArr["cantina"], 0, true);

    main.init();
}

requestPreloads_images();
