'use strict';
const semitonesPerOctave = 12;
const referenceNote = {
    //A4
    frequency: 440,
    midiNoteNumber: 69,
};
const notes = [
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
];

const strings = [
    { label: 'High e', openMidiNoteNumber: 64 },
    { label: 'B', openMidiNoteNumber: 59 },
    { label: 'G', openMidiNoteNumber: 55 },
    { label: 'D', openMidiNoteNumber: 50 },
    { label: 'A', openMidiNoteNumber: 45 },
    { label: 'Low E', openMidiNoteNumber: 40 }
];

const board = document.getElementById('fretboard');
const toggle = document.getElementById('use-sharps');
const selectedNote = document.getElementById('selected-note');
const selectedPosition = document.getElementById('selected-position');
let selected = { stringIndex: 5, fret: 0 };

function nameOfNote(midiNoteNumber) { 

    const noteIndex = midiNoteNumber % semitonesPerOctave;
    const note = notes[noteIndex];

    const sharpOrFlatName = toggle.checked
        ? note.sharp
        : note.flat;

    const noteName = sharpOrFlatName ?? note.natural;
    const octave =
        Math.floor(midiNoteNumber / semitonesPerOctave) - 1;

    return noteName + octave;
}


function addCell(text, classes) { 
    const cell = document.createElement('div'); 
    cell.className = classes ? `cell ${classes}` : 'cell';
    cell.textContent = text; 
    board.appendChild(cell); 
    return cell; 
}

function createButton(string, fret, stringIndex) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'note';
    button.textContent = nameOfNote(string.openMidiNoteNumber + fret);
    button.setAttribute('aria-label', `${string.label} string, fret ${fret}, ${button.textContent}`);
    button.setAttribute('aria-pressed', String(selected.stringIndex === stringIndex && selected.fret === fret));
    button.addEventListener('click', () => {
        const previousButton = board.querySelector('.note[aria-pressed="true"]');

        previousButton?.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-pressed', 'true');
        selected = { stringIndex, fret };
        renderInfo();
    });
    return button;
}

function renderFretboard(){
    const fretCount = 21;
    board.style.setProperty('--fret-column-count', fretCount + 1); 
    board.replaceChildren();
    addCell('String', 'label heading');

    // Add headers.
    for (let fret = 0; fret <= fretCount; fret++) {
        addCell(fret === 0 ? 'Open' : String(fret), 'heading');
    }

    strings.forEach((string, stringIndex) => {
        addCell(string.label, 'label');
        for (let fret = 0; fret <= fretCount; fret++) {
            const cell = addCell('', '');
            const button = createButton(string, fret, stringIndex);
            cell.appendChild(button);
        }
    });
}

function renderInfo() {
    const string = strings[selected.stringIndex];
    const selectedMidiNoteNumber = string.openMidiNoteNumber + selected.fret;
    const frequency = calculateFrequency(selectedMidiNoteNumber);
    selectedNote.textContent = `${nameOfNote(selectedMidiNoteNumber)} · ${frequency.toFixed(2)} Hz`;
    selectedPosition.textContent = `${string.label} string · ${selected.fret === 0 ? 'open' : `fret ${selected.fret}`}`;
}

function calculateFrequency(midiNoteNumber) {
    const semitonesFromReference = midiNoteNumber - referenceNote.midiNoteNumber;
    const octavesFromReference = semitonesFromReference / semitonesPerOctave;
    const frequencyRatio = Math.pow(2, octavesFromReference);
    const frequency = referenceNote.frequency * frequencyRatio;
    
    return frequency;
}

function render() {
    renderFretboard();
    renderInfo();
}

toggle.addEventListener('change', render);
render();


