// ===================================
// AUDIO MANAGER - USING WEB AUDIO API
// ===================================

// constructor that creates an web audio object
function AudioManager() {
  try {
    this.audioCtx = new (window.AudioContext || window.webkitAutioContext)();
  } catch(e) {
    console.log('Web Audio API is not supported in this browser');
  }
}

// ==========
// PROPERTIES
// ==========

// array to store our buffers
AudioManager.prototype.bufferArr = []
// array to check if all files are preloaded
AudioManager.prototype.preloaded = []
// keeps track of number of audiofiles
AudioManager.prototype.fileCount = 0;

AudioManager.prototype.paused = false;

// ========
// PRE LOAD
// ========

/* a preload function that takes an soundfile url as argument and an index string
   to store in our buffer array. Stores the buffer in our buffer array */
AudioManager.prototype.preLoad = function(url, indexString, i) {
  // increment our audio file counter and push on our preloaded array
  this.fileCount++;
  this.preloaded.push(false);
  // we request the audiofile
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  let ctx = this.audioCtx; // 'this' gets redefined inside onload
  let bufferArr = this.bufferArr; // same reason
  let preloaded = this.preloaded; // same reason
  // decode asynchronously
  request.onload = function() {
    ctx.decodeAudioData(request.response, function(buffer) {
      // we store the buffer in our buffer array at the given index string
      bufferArr[indexString] = buffer;
      preloaded[i] = true;
    }, this.onError);
  }
  request.send();
}

// ========
// ON ERROR
// ========

AudioManager.prototype.onError = function() {
  console.log("Could not decode the audio data");
}

// ==========
// PLAY AUDIO
// ==========

// a function that takes a buffer as argument and plays the audio source
AudioManager.prototype.playAudio = function(bufferString, delayTime, loop=false, gainConst=1) {
  // buffer and buffer duration
  const buffer = audioManager.bufferArr[bufferString];
  const dur = buffer.duration;

  // lets reduce the audio gain so the players ears won't get destroyed (like mine)
  let gainNode = this.audioCtx.createGain();
  const gainVal = 0.1 * gainConst;
  gainNode.gain.setValueAtTime(gainVal, this.audioCtx.currentTime)

  if (!loop) {
    // decay to prevent clicks
    gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + dur)
  }

  // lets also add a little bit of ping-pong delay for better "experience"
  let pingpong = this.pingpongDelay(this.audioCtx, delayTime);
  // buffer source
  let source = this.audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = loop;
  // dry signal
  source.connect(gainNode);
  // wet signal
  source.connect(pingpong.feedback);
  pingpong.output.connect(gainNode);
  // connect it to the destination!
  gainNode.connect(this.audioCtx.destination);
  // play!
  source.start(0);
}

// play an audio file and emit a trigger to the server
AudioManager.prototype.playAndEmit = function(bufferString, delayTime, loop, gainConst=1) {
   // play
  this.playAudio(bufferString, delayTime, loop, gainConst);
  // emit
  networkManager.emit("audio", {bufferString: bufferString, delayTime: delayTime, loop: loop, gainConst: gainConst});
}

// ===============
// PING PONG DELAY
// ===============

AudioManager.prototype.pingpongDelay = function(ctx, delayTime) {
  let leftDelay = ctx.createDelay();
  let rightDelay = ctx.createDelay();
  leftDelay.delayTime.value = delayTime;
  rightDelay.delayTime.value = delayTime;
  // any sound that comes out of leftDelay is sent to rightDelay
  leftDelay.connect(rightDelay);

  // then we loop sound that comes out of rightDelay
  let feedback = ctx.createGain();
  feedback.connect(leftDelay);
  rightDelay.connect(feedback);
  // feedback ratio
  feedback.gain.value = 0.3;

  // lets merge the two mono signals into a stereo signal
  let merger = ctx.createChannelMerger(2);
  leftDelay.connect(merger, 0, 0);
  rightDelay.connect(merger, 0, 1);
  // to control the delay overall gain
  let output = this.audioCtx.createGain();
  output.gain.value = 0.5;
  merger.connect(output);

  return {feedback, output};
}

// =====
// PAUSE
// =====

AudioManager.prototype.pause = function() {
  this.audioCtx.suspend();
  this.paused = true;
}

// ======
// RESUME
// ======

AudioManager.prototype.resume = function() {
  this.audioCtx.resume();
  this.paused = false;
}

// ===========
// PRELOAD ALL
// ===========

// preload all our audiofiles (and store in our buffer array)
AudioManager.prototype.preloadAll = function(callback) {
  // all files:
  this.preLoad("static/sounds/coin.wav", "coin", 0);
  this.preLoad("static/sounds/diceroll.wav", "diceroll", 1);
  this.preLoad("static/sounds/jump.wav", "jump", 2);
  this.preLoad("static/sounds/movement.wav", "movement", 3);
  this.preLoad("static/sounds/pipe.wav", "pipe", 4);
  this.preLoad("static/sounds/star.wav", "star", 5);
  this.preLoad("static/sounds/arrow.wav", "arrow", 6);

  // when we have preloaded all files we go to the callback
  let fileCount = this.fileCount;
  let preloaded = this.preloaded;
  let interval = setInterval(function() {
    for (let i=0; i<fileCount; i++) {
      if (!preloaded[i]) {
        return;
      }
    }
    // when all files have been loaded we clear the interval and then go to the callback
    clearInterval(interval);
    callback();
  }, 100)
}

// lets a create a new manager
let audioManager = new AudioManager();
