(function(){

const css = `
#transpose{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:.5rem;
    margin:.25rem 0;
    font-family:sans-serif;
}

#transpose button{
    width:2rem;
    height:2rem;
    font-size:1.1rem;
}

#transpose-value{
    min-width:2.5rem;
    text-align:center;
    font-weight:bold;
    cursor:pointer;
}
`;

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);



const keyOrder = [
"A0","A#0","B0","C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1",
"A1","A#1","B1","C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2",
"A2","A#2","B2","C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3",
"A3","A#3","B3","C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4",
"A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5",
"A5","A#5","B5","C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6",
"A6","A#6","B6","C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7",
"A7","A#7","B7","C8"
];

const lookup = {};

keyOrder.forEach((n,i)=>{
    lookup[n]=i;
});

let transpose = 0;

function apply(note){

    const i = lookup[note];

    if(i == null) return note;

    const j = i + transpose;

    if(j < 0 || j >= keyOrder.length){
        return note;
    }

    return keyOrder[j];

}

function refresh(){

    value.textContent =
        (transpose>0?"+":"") + transpose;

}

window.transpose={

    get(){
        return transpose;
    },

    set(v){

        transpose=Math.max(-12,Math.min(12,v));

        refresh();

    },

    up(){
        this.set(transpose+1);
    },

    down(){
        this.set(transpose-1);
    },

    reset(){
        this.set(0);
    },

    apply

};



const ui=document.createElement("div");

ui.id="transpose";

ui.innerHTML=`
<button id="transpose-minus">−</button>
<span id="transpose-value">0</span>
<button id="transpose-plus">+</button>
`;

const value=ui.querySelector("#transpose-value");

ui.querySelector("#transpose-minus").onclick=()=>{
    window.transpose.down();
};

ui.querySelector("#transpose-plus").onclick=()=>{
    window.transpose.up();
};

value.onclick=()=>{
    window.transpose.reset();
};



document.addEventListener("DOMContentLoaded",()=>{

    const parent=
        document.getElementById("right-column")
        || document.body;

    parent.appendChild(ui);

    refresh();

});

})();