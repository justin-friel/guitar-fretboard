import { getInterval, getNote, getRelatedNotes } from "./music.js";
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

    function getRelatedFrets(rootNote, relatedNotes) {
        relatedNotes ??= getRelatedNotes(rootNote);
        const relatedMidiNoteNumbers = new Set(
            Object.values(relatedNotes).map(
                (relatedNote) => relatedNote.midiNoteNumber
            )
        );
        const relatedFrets = [];

        standardTuning.forEach((string) => {
            for (let fret = 0; fret <= fretCount; fret++) {
                const currentNote = getNoteAt(string, fret);
                if (relatedMidiNoteNumbers.has(currentNote.midiNoteNumber)) {
                    const position = {
                        stringNumber: string.stringNumber,
                        fretNumber: fret
                    };
                    relatedFrets.push(
                        mapPosition(
                            position,
                            string,
                            currentNote,
                            rootNote
                        )
                    );
                }
            }
        });

        return Object.freeze(relatedFrets);
    }

    function getChord(chordId) {
        const rawPositions = getChordPosition(chordId);
        if (!rawPositions) {
            return null;
        }

        const rootNote = getNote(rawPositions.rootMidiNoteNumber);

        const positions = Object.freeze(
            rawPositions.positions.map((position) => {
                const string = standardTuning.find(
                    (string) => string.stringNumber === position.stringNumber
                );

                const currentNote = getNoteAt(string, position.fretNumber);
                return mapPosition(position, string, currentNote, rootNote);
            })
        );

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
function mapPosition(position, string, currentNote, rootNote) {
    return Object.freeze({
        ...position,
        string,
        note: currentNote,
        interval: getInterval(rootNote, currentNote)
    });
}
