// keyboard.js
(function(){

// ---------- KEYBOARD LAYOUT ----------
const keyboardLayout = "extended"; // "degree", "classic", "extended"

// ---------- DEGREE LAYOUT ----------
function getDegreeMap(){
  return {
    "1": 0,
    "2": 2,
    "3": 4,
    "4": 5,
    "5": 7,
    "6": 9,
    "7": 11,

    "!": 1,
    "@": 3,
    "#": 6,
    "$": 8,
    "%": 10
  };
}

// ---------- CLASSIC LAYOUT ----------
function getClassicMap(){
  return {

    // White keys
    "a": 0,
    "s": 2,
    "d": 4,
    "f": 5,
    "g": 7,
    "h": 9,
    "j": 11,
    "k": 12,
    "l": 14,
    ";": 16,

    // Black keys
    "w": 1,
    "e": 3,
    "t": 6,
    "y": 8,
    "u": 10,
    "o": 13,
    "p": 15

  };
}

// ---------- EXTENDED (FL STUDIO) LAYOUT ----------
function getExtendedMap(){
  return {

    // Lower octave - White keys
// Lower octave - White keys
    "z": -12,  // C3
    "x": -10,  // D3
    "c": -8,   // E3
    "v": -7,   // F3
    "b": -5,   // G3
    "n": -3,   // A3
    "m": -1,   // B3
    ",": 0,    // C4
    ".": 2,    // D4
    "/": 4,    // E4

    // Lower octave - Black keys
    "s": -11,  // C#3
    "d": -9,   // D#3
    "g": -6,   // F#3
    "h": -4,   // G#3
    "j": -2,   // A#3

    // Upper octave - White keys
    "q": 0,    // C4
    "w": 2,    // D4
    "e": 4,    // E4
    "r": 5,    // F4
    "t": 7,    // G4
    "y": 9,    // A4
    "u": 11,   // B4
    "i": 12,   // C5
    "o": 14,   // D5
    "p": 16,   // E5
    "[": 17,   // F5
    "]": 19,   // G5
    "\\": 21,  // A5

    // Upper octave - Black keys
    "2": 1,    // C#4
    "3": 3,    // D#4
    "5": 6,    // F#4
    "6": 8,    // G#4
    "7": 10,   // A#4
    "9": 13,   // C#5
    "0": 15,    // D#5
    "+": 18    // F#5

  };
}

// ---------- ACTIVE KEY MAP ----------
let keyMap;

switch(keyboardLayout){

  case "classic":
    keyMap = getClassicMap();
    break;

  case "extended":
    keyMap = getExtendedMap();
    break;

  default:
    keyMap = getDegreeMap();

}

// ---------- CHROMATIC NOTES ----------
const notes = [
  "C","C#","D","D#","E","F","F#","G","G#","A","A#","B"
];

// ---------- STATE ----------
let currentKey = "C";
let currentOctave = 4;

const pressedKeys = new Set();

// ---------- CONNECT TO KEY STATE ----------
if(window.__KEY_STATE__){

  // initial key
  currentKey = window.__KEY_STATE__.key;

  // subscribe to changes
  window.__KEY_STATE__.subscribe(function(newKey){
    currentKey = newKey;
  });

}

// ---------- NOTE CALCULATION ----------
function getNoteFromDegree(degree){

  const keyIndex = notes.indexOf(currentKey);

  const total = keyIndex + degree;

  const noteIndex = ((total % 12) + 12) % 12;

  const octaveShift = Math.floor(total / 12);

  return {
    pitch: notes[noteIndex],
    octaveShift
  };

}

// ---------- KEYBOARD INPUT ----------
document.addEventListener("keydown", function(e){

  // ----- OCTAVE LEFT -----
  if(e.key === "ArrowLeft"){

    e.preventDefault();

    if(!window.piano) return;

    const wrapper = window.piano.pianoWrapper;
    const keyWidth = window.piano.getKeyWidth();

    const newScroll = wrapper.scrollLeft - keyWidth * 7;

    if(newScroll < 0) return;

    wrapper.scrollLeft = newScroll;
    currentOctave--;

    return;
  }

  // ----- OCTAVE RIGHT -----
  if(e.key === "ArrowRight"){

    e.preventDefault();

    if(!window.piano) return;

    const wrapper = window.piano.pianoWrapper;
    const keyWidth = window.piano.getKeyWidth();

    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

    const newScroll = wrapper.scrollLeft + keyWidth * 7;

    if(newScroll > maxScroll) return;

    wrapper.scrollLeft = newScroll;
    currentOctave++;

    return;
  }

  // ----- NOTE PLAY -----
  const degree = keyMap[e.key];
  if(degree === undefined) return;

  if(pressedKeys.has(e.key)) return;

  const result = getNoteFromDegree(degree);
  const note = result.pitch + (currentOctave + result.octaveShift);

  pressedKeys.add(e.key);

  e.preventDefault();
  pressPianoKey(note);

});

// ---------- KEY RELEASE ----------
document.addEventListener("keyup", function(e){

  const degree = keyMap[e.key];
  if(degree === undefined) return;

  const result = getNoteFromDegree(degree);
  const note = result.pitch + (currentOctave + result.octaveShift);

  pressedKeys.delete(e.key);

  releasePianoKey(note);

});

// ---------- WINDOW BLUR ----------
window.addEventListener("blur", function(){

  pressedKeys.forEach(key=>{

    const degree = keyMap[key];
    if(degree !== undefined){

      const result = getNoteFromDegree(degree);
      const note = result.pitch + (currentOctave + result.octaveShift);

      releasePianoKey(note);

    }

  });

  pressedKeys.clear();

});

})();