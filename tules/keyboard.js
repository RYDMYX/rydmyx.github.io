// keyboard.js
(function(){

// ---------- KEYBOARD LAYOUT ----------
const keyboardLayout = "qwerty"; // "degree" or "qwerty"

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

// ---------- QWERTY LAYOUT ----------
function getQwertyMap(){
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

// ---------- ACTIVE KEY MAP ----------
const keyMap =
  keyboardLayout === "qwerty"
    ? getQwertyMap()
    : getDegreeMap();

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

  const noteIndex = total % 12;

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