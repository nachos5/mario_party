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
    g_mouseClick = false,
    g_skip = false;

function handleMouseDown() {
  g_mouseClick = true;
}

function handleMouseUp() {
  g_mouseClick = false;
}

// return current state of mouseclick and then set it to false
function eatClick() {
    let click = g_mouseClick;
    g_mouseClick = false;
    return click;
}

function handleMouse(evt) {
  g_skip = false;

  g_mouseX = evt.clientX - g_canvas.offsetLeft;
  g_mouseY = evt.clientY - g_canvas.offsetTop;

  // If no button is being pressed, then bail
  let button = evt.buttons === undefined ? evt.which : evt.buttons;
  if (!button) return;

  if (eatClick()) {
    let hitEntity = spatialManager.findEntityInRange(g_mouseX, g_mouseY, 1);
    
    // Call object that was clicked on
    if (hitEntity) {
      let fun = hitEntity.resolveCollision;
      if (fun) fun.call(hitEntity);
    }
  }
}

window.addEventListener("mousedown", handleMouseDown);
window.addEventListener("mouseup", handleMouseUp);
window.addEventListener("mousemove", handleMouse);
window.addEventListener("mousedown", handleMouse);
