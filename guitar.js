import { getNote, getRelatedNotes } from "./music.js";

const defaultFretCount = 21;

const standardTuning = Object.freeze([
    { stringNumber: 1, label: 'High e', openMidiNoteNumber: 64 },
    { stringNumber: 2, label: 'B', openMidiNoteNumber: 59 },
    { stringNumber: 3, label: 'G', openMidiNoteNumber: 55 },
    { stringNumber: 4, label: 'D', openMidiNoteNumber: 50 },
    { stringNumber: 5, label: 'A', openMidiNoteNumber: 45 },
    { stringNumber: 6, label: 'Low E', openMidiNoteNumber: 40 }
].map(string => Object.freeze(string)));

function getNoteAt(guitarString, fret) {
    const midiNoteNumber =
        guitarString.openMidiNoteNumber + fret;

    return getNote(midiNoteNumber);
}

function getRelatedFrets(note) {
    const relatedNotes = getRelatedNotes(note);

    const majorThirds = [];
    const minorThirds = [];
    const perfectFifths = [];
    const frets = standardTuning.forEach(string => {
        for (let fret = 0; fret <= this.fretCount; fret++) {
            const note = getNoteAt(string, fret);
            if (note.midiNoteNumber === relatedNotes.majorThird.midiNoteNumber) {
                majorThirds.push({
                    string: string, 
                    fretNumber: fret
                });
            } else if (note.midiNoteNumber === relatedNotes.minorThird.midiNoteNumber) {
                minorThirds.push({
                    string: string, 
                    fretNumber: fret
                });
            } else if (note.midiNoteNumber === relatedNotes.perfectFifth.midiNoteNumber) {
                perfectFifths.push({
                    string: string, 
                    fretNumber: fret
                });
            }
        }
    });

    return Object.freeze({
        majorThirds: majorThirds,
        minorThirds: minorThirds,
        perfectFifths: perfectFifths
    });
}

export function createGuitar(numberOfFrets) {
    let frets = defaultFretCount;
    if (Number.isInteger(numberOfFrets) && numberOfFrets > 0) {
        frets = numberOfFrets;
    }

    return Object.freeze({
        fretCount: frets,
        strings: standardTuning,
        getNoteAt: getNoteAt,
        getRelatedFrets: getRelatedFrets
    });
}
