"use strict";

const chordDict = {
    "C0": "C,,,,",
    "D0": "D,,,,",
    "E0": "E,,,,",
    "F0": "F,,,,",
    "G0": "G,,,,",
    "A0": "A,,,,",
    "B0": "B,,,,",
    "C1": "C,,,",
    "D1": "D,,,",
    "E1": "E,,,",
    "F1": "F,,,",
    "G1": "G,,,",
    "A1": "A,,,",
    "B1": "B,,,",
    "C2": "C,,",
    "D2": "D,,",
    "E2": "E,,",
    "F2": "F,,",
    "G2": "G,,",
    "A2": "A,,",
    "B2": "B,,",
    "C3": "C,",
    "D3♭": "_D,",
    "D3": "D,",
    "E3": "E,",
    "E3♮": "=E,",
    "F3": "F,",
    "G3": "G,",
    "A3": "A,",
    "B3": "B,",
    "C4": "C",
    "D4": "D",
    "E4": "E",
    "F4": "F",
    "G4": "G",
    "A4": "A",
    "B4": "B",
    "C5": "c",
    "D5": "d",
    "E5": "e",
    "F5": "f",
    "G5": "g",
    "A5": "a",
    "B5": "b",
    "C6": "c'",
    "D6": "d'",
    "E6": "e'",
    "F6": "f'",
    "G6": "g'",
    "A6": "a'",
    "B6": "b'"
};
const reverseChordDict = {
    "C,,,,": "C0",
    "D,,,,": "D0",
    "E,,,,": "E0",
    "F,,,,": "F0",
    "G,,,,": "G0",
    "A,,,,": "A0",
    "B,,,,": "B0",
    "C,,,": "C1",
    "D,,,": "D1",
    "E,,,": "E1",
    "F,,,": "F1",
    "G,,,": "G1",
    "A,,,": "A1",
    "B,,,": "B1",
    "C,,": "C2",
    "D,,": "D2",
    "E,,": "E2",
    "F,,": "F2",
    "G,,": "G2",
    "A,,": "A2",
    "B,,": "B2",
    "C,": "C3",
    "_D,": "D3♭",
    "D,": "D3",
    "E,": "E3",
    "=E,": "E3♮",
    "F,": "F3",
    "G,": "G3",
    "A,": "A3",
    "B,": "B3",
    "C": "C4",
    "D": "D4",
    "E": "E4",
    "F": "F4",
    "G": "G4",
    "A": "A4",
    "B": "B4",
    "c": "C5",
    "d": "D5",
    "e": "E5",
    "f": "F5",
    "g": "G5",
    "a": "A5",
    "b": "B5",
    "c'": "C6",
    "d'": "D6",
    "e'": "E6",
    "f'": "F6",
    "g'": "G6",
    "a'": "A6",
    "b'": "B6"
};
const holdDict = {
    4: "crotchet",
    2: "minum",
    1: "semibreve"
}
const lenDict = {
    "crotchet": 1,
    "minum": 2,
    "semibreve": 4
}
let data, source;
let L = 0;
let i, j, beats = [];
let baseCannon = "";
let chords = [];
let cannon = "";
const synthControl = new ABCJS.synth.SynthController();

function drag(ev) {
    source = ev.target;
    data = ev.target.innerHTML;
    ev.dataTransfer.setData("text", ev.target.text);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    chords = [];
    ev.preventDefault();
    if (["crotchet", "minum", "semibreve"].includes(source.className)) {
        source.innerHTML = "";
    }
    if (["crotchet", "minum", "semibreve"].includes(ev.target.className) && data != undefined){
        ev.target.innerHTML = data;
    }
    let bar = '';
    let beatCounter = 1;
    for (i = 0; i < beats.length; i++) {
        if (beatCounter != 1 && beatCounter % 4 == 1){
            const barNotes = bar.split(" ");
            let allRests = true;
            for (j = 0; j < barNotes.length - 1; j++){
                if (barNotes[j][0] != "z"){
                    allRests = false;
                }
            }
            if (allRests == true) {
                bar = "z" + L;
            }
            chords[Math.floor(beatCounter/4) - 1] = bar;
            bar = '';
        }
        if (beats[i] === null) {
            continue;
        }
        beatCounter += lenDict[beats[i].className];
        const note = beats[i].innerHTML;
        if (note === "") {
            bar += "z" +  (lenDict[beats[i].className] * L/4) + " ";
        } else {
            bar += chordDict[note] + (lenDict[beats[i].className] * L/4) + " ";
        }
    }
    if (beatCounter != 1 && beatCounter % 4 == 1){
        const barNotes = bar.split(" ");
        let allRests = true;
        for (j = 0; j < barNotes.length - 1; j++){
            if (barNotes[j][0] != "z"){
                allRests = false;
            }
        }
        if (allRests == true) {
            bar = "z" + L;
        }
        chords[Math.floor(beatCounter/4) - 1] = bar;
        bar = '';
    }
    cannon = baseCannon + chords.join(" | ") + " |]";
    makeMidi()
}

function updateSong(song){  
    fetch(song)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            baseCannon = myJson.baseCannon;
            L = myJson.L
            chords = ["z" + myJson.L,"z" + myJson.L,"z" + myJson.L,"z" + myJson.L];
            cannon = baseCannon + chords.join(" | ") + " |]";
            makeDrops(myJson.bass, myJson.L);
            makeMidi();
        });
}

fetch("./songs.json")
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        let songHtml = "";
        for (i = 0; i < myJson.songNames.length; i++){
            songHtml +=" <div class=\"song\">" + myJson.songNames[i] + "</div>";
        }
        document.querySelector("#songs").innerHTML = songHtml;
        songs = document.querySelectorAll(".song");
        for (i = 0; i < myJson.songJson.length; i++) {
            const song = "./" + myJson.songJson[i]
            songs[i].addEventListener("click", function(){
                updateSong(song);
            });
        }
    });

function makeDrops(bass, L) {
    let drags = [];
    let drops = '';
    let barcounter = 0;
    beats = [];
    for (i = 0; i < bass.length; i++) {
        let bar = bass[i].split(' ');
        for (j = 0; j < bar.length; j++){
            const note = bar[j];
            const hold = note[note.length - 1];
            const noteType = holdDict[L/hold] == undefined ? "crotchet" : holdDict[L/hold];
            drops += "<div id=" + "b" + (barcounter + 1) + " class=\"" + noteType + "\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\" draggable=\"true\" ondragstart=\"drag(event)\"></div>\n";
            barcounter += holdDict[L/hold] == undefined ? 1 : parseInt(hold);
            if ((barcounter % L) == 0 && barcounter != L*4) {
                drops += "<div class=\"barline\"></div>\n";
            }
            if (!drags.includes(note.substring(0, note.length - 1))) {
                drags = drags.concat([note.substring(0, note.length - 1)]);
            }
        }
    }
    document.querySelector("#drops").innerHTML = drops;
    barcounter = 0;
    for (i = 0; i < bass.length; i++) {
        let bar = bass[i].split(' ');
        for (j = 0; j < bar.length; j++){
            const note = bar[j];
            const hold = note[note.length - 1];
            beats = beats.concat([document.querySelector('#b' + (barcounter + 1))]);
            barcounter += holdDict[L/hold] == undefined ? 1 : parseInt(hold);
        }
    }
    drags = drags.sort();
    var dragsHtml = "";
    for (i = 0; i < drags.length; i++){ 
        dragsHtml += "<div draggable=\"true\" class=\"chord\" ondragstart=\"drag(event)\">" + reverseChordDict[drags[i]] + "</div>";
    }
    document.querySelector("#drags").innerHTML = dragsHtml;
}

function makeMidi() {
    if (ABCJS.synth.supportsAudio()) {
        const visualObj = ABCJS.renderAbc('notes', cannon)[0];
        synthControl.load("#audio", null, {displayRestart: true, displayPlay: true, displayProgress: true});
        synthControl.setTune(visualObj, false);
        synthControl.restart();
    } else {
        document.querySelector("#audio").innerHTML = "<div class=\"audio-error\">Audio is not supported in this browser.</div>";
    }
}

updateSong("./cannon.json");