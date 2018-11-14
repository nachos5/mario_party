// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0,
    g_mouseClick = {spatial: false, event: false},
    g_skip = false;

function handleMouseDown() {
  for (let key in g_mouseClick)
    g_mouseClick[key] = true;
}

function handleMouseUp() {
  for (let key in g_mouseClick)
    g_mouseClick[key] = false;
}

// return current state of mouseclick and then set it to false
function eatClick(key) {
    let click = g_mouseClick[key];
    g_mouseClick[key] = false;
    return click;
}

function handleMouse(evt) {
  g_skip = false;

  g_mouseX = evt.clientX - g_canvas.offsetLeft;
  g_mouseY = evt.clientY - g_canvas.offsetTop;

  // If no button is being pressed, then bail
  let button = evt.buttons === undefined ? evt.which : evt.buttons;
  if (!button) return;
}

window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mouseup", handleMouseUp);
window.addEventListener("mousemove", handleMouse);
