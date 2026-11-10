const semitonesPerOctave = 12;
const majorThirdSemitones = 4;
const minorThirdSemitones = 3;
const perfectFifthSemitones = 7;

const noteNames = [
    { natural: 'C', sharp: null, flat: null },
    { natural: null, sharp: 'C♯', flat: 'D♭' },
    { natural: 'D', sharp: null, flat: null },
    { natural: null, sharp: 'D♯', flat: 'E♭' },
    { natural: 'E', sharp: null, flat: null },
    { natural: 'F', sharp: null, flat: null },
    { natural: null, sharp: 'F♯', flat: 'G♭' },
    { natural: 'G', sharp: null, flat: null },
    { natural: null, sharp: 'G♯', flat: 'A♭' },
    { natural: 'A', sharp: null, flat: null },
    { natural: null, sharp: 'A♯', flat: 'B♭' },
    { natural: 'B', sharp: null, flat: null }
].map(names => Object.freeze(names));

function createNote(midiNoteNumber, frequency) {
    const noteIndex =
        midiNoteNumber % semitonesPerOctave;

    const octave =
        Math.floor(midiNoteNumber / semitonesPerOctave) - 1;

    return Object.freeze({
        midiNoteNumber,
        octave,
        frequency,
        names: noteNames[noteIndex]
    });
}

const referenceNote = createNote(69, 440);

function getNote(midiNoteNumber) {

    const semitoneDistance =
        midiNoteNumber - referenceNote.midiNoteNumber;

    const octaveDistance =
        semitoneDistance / semitonesPerOctave;

    const frequency =
        referenceNote.frequency * Math.pow(2, octaveDistance);

    return createNote(midiNoteNumber, frequency);
}

function getRelatedNote(note, semitoneCount) {
    const relatedNoteNumber = note.midiNoteNumber + semitoneCount;
    return getNote(relatedNoteNumber);
}

function getRelatedNotes(note) {
    return Object.freeze({
        majorThird: getRelatedNote(note, majorThirdSemitones),
        minorThird: getRelatedNote(note, minorThirdSemitones),
        perfectFifth: getRelatedNote(note, perfectFifthSemitones)
    });
}

const isSameNoteAnyOctave = (rootNote, note) =>
    (note.midiNoteNumber - rootNote.midiNoteNumber) % semitonesPerOctave === 0;

const isMajorThirdAnyOctave = (rootNote, note) => 
    (note.midiNoteNumber - rootNote.midiNoteNumber) %12 === majorThirdSemitones;

const isMinorThirdAnyOctave = (rootNote, note) => 
    (note.midiNoteNumber - rootNote.midiNoteNumber) %12 === minorThirdSemitones;

const isPerfectFifthAnyOctave = (rootNote, note) => 
    (note.midiNoteNumber - rootNote.midiNoteNumber) %12 === perfectFifthSemitones


export { 
    getNote,
    getRelatedNotes,
    isSameNoteAnyOctave,
    isMajorThirdAnyOctave, 
    isMinorThirdAnyOctave, 
    isPerfectFifthAnyOctave 
}

