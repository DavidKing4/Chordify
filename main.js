
var cannon = "X:1\n\
T:Pachelbel's Canon\n\
C:Johann Pachelbel (1653-1706)\n\
M:4/4\n\
L: 1/8\n\
Q:84\n\
K:D\n\
V: T1 clef=treble name=\"Melody\"\n\
V: T2 clef=bass name=\"Bass\"\n\
[V: T1]af/g/ af/g/ a/A/B/c/ d/e/f/g/ | fd/e/ fF/G/ A/B/A/G/ A/F/G/A/ |  GB/A/ GF/E/ F/E/D/E/  F/G/A/B/ | GB/A/ Bc/d/ A/B/c/d/ e/f/g/a/ |]\n\
[V: T2]  ";
var chords = ["z8","z8","z8","z8"];
cannon = cannon + chords.join(" | ") + " |]";

var chordDict = {};
chordDict["A2"] = "A,,4";
chordDict["B2"] = "B,,4";
chordDict["A3"] = "A,4";
chordDict["D3"] = "D,4";
chordDict["F3"] = "F,4";
chordDict["G3"] = "G,4";
chordDict["Choose"] = "z4";

self.addEventListener("load", function() {   

    if (ABCJS.synth.supportsAudio()) {
        var visualObj = ABCJS.renderAbc('notes', cannon)[0];
        var synthControl = new ABCJS.synth.SynthController();
        synthControl.load("#audio", null, {displayRestart: true, displayPlay: true, displayProgress: true});
        synthControl.setTune(visualObj, false);
    } else {
        document.querySelector("#audio").innerHTML = "<div class='audio-error'>Audio is not supported in this browser.</div>";
    }
});

const selectElement = document.querySelector('.noteDropdowns');

selectElement.addEventListener("change", (event) => {
    
});