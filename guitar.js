import { getNote, getRelatedNotes, isSameNoteAnyOctave, isMajorThirdAnyOctave , isMinorThirdAnyOctave, isPerfectFifthAnyOctave} from "./music.js";
import { getChordPosition } from "./guitarChord.js";

const defaultFretCount = 21;

const standardTuning = Object.freeze([
    { stringNumber: 1, label: 'High e', openMidiNoteNumber: 64 },
    { stringNumber: 2, label: 'B', openMidiNoteNumber: 59 },
    { stringNumber: 3, label: 'G', openMidiNoteNumber: 55 },
    { stringNumber: 4, label: 'D', openMidiNoteNumber: 50 },
    { stringNumber: 5, label: 'A', openMidiNoteNumber: 45 },
    { stringNumber: 6, label: 'Low E', openMidiNoteNumber: 40 }
].map(string => Object.freeze(string)));

export function createGuitar(numberOfFrets) {
    const fretCount =
    Number.isInteger(numberOfFrets) && numberOfFrets > 0
        ? numberOfFrets
        : defaultFretCount;

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
        standardTuning.forEach(string => {
            for (let fret = 0; fret <= fretCount; fret++) {
                const note = getNoteAt(string, fret);
                if (note.midiNoteNumber === relatedNotes.majorThird.midiNoteNumber) {
                    majorThirds.push(Object.freeze({
                        string: string, 
                        fretNumber: fret
                }));
                } else if (note.midiNoteNumber === relatedNotes.minorThird.midiNoteNumber) {
                    minorThirds.push(Object.freeze({
                        string: string, 
                        fretNumber: fret
                    }));
                } else if (note.midiNoteNumber === relatedNotes.perfectFifth.midiNoteNumber) {
                    perfectFifths.push(Object.freeze({
                        string: string, 
                        fretNumber: fret
                    }));
                }
            }
        });

        return Object.freeze({
            majorThirds: Object.freeze(majorThirds),
            minorThirds: Object.freeze(minorThirds),
            perfectFifths: Object.freeze(perfectFifths)
        });
    }

    function getChord(chordId) {
        const rawPositions = getChordPosition(chordId);
        const rootNote = getNote(rawPositions.rootMidiNoteNumber);
        const relatedFrets = getRelatedFrets(rootNote);

        const positions = rawPositions.positions.map((position) => {
            const string = standardTuning.find(
                (string) => string.stringNumber === position.stringNumber
            );

            const currentNote = getNoteAt(string, position.fretNumber);
            position.string = string;
            position.note = currentNote;

            if (isSameNoteAnyOctave(rootNote, currentNote)) {
                position.role = 'Root'
            } else if (isMajorThirdAnyOctave(rootNote, currentNote)) {
                position.role = 'Major Third'
            } else if (isMinorThirdAnyOctave(rootNote, currentNote)) {
                position.role = 'Minor Third'
            } else if (isPerfectFifthAnyOctave(rootNote, currentNote)) {
                position.role = 'Perfect fifth'
            } 
            
            return position;
        });

        return Object.freeze({
            rootNote,
            positions,
        });
    }

    return Object.freeze({
        fretCount,
        strings: standardTuning,
        getNoteAt,
        getRelatedFrets,
        getChord
    });
}
