import { createGuitar } from "./guitar.js";
import { getRelatedNotes } from "./music.js";
import { getChordNames } from './guitarChord.js';

'use strict';

const guitar = createGuitar(21);

const tabs = document.querySelectorAll('.tab');
const notesPanel = document.getElementById('notes-panel');
const chordsPanel = document.getElementById('chords-panel');
const notesDetails = document.getElementById('notes-details');
const chordSelect = document.getElementById('chord-select');
const board = document.getElementById('fretboard');
const showNotesAs = document.querySelectorAll('input[name="sharpsOrFlats"]');
const selectedNote = document.getElementById('selected-note');
const selectedPosition = document.getElementById('selected-position');
const minorThird = document.getElementById('minor-third');
const majorThird = document.getElementById('major-third');
const perfectFifth = document.getElementById('perfect-fifth');
let selected = { stringIndex: 5, fret: 0 };

function nameOfNote(note) {
    let sharpOrFlatName = 'sharp';

    showNotesAs.forEach((radio) => {
        if (radio.checked) {
            sharpOrFlatName = radio.value;
        }
    });
    const noteName = note.names[sharpOrFlatName] ?? note.names.natural;

    return noteName + note.octave;
}


function addCell(text = '', classes = '') { 
    const cell = document.createElement('div'); 
    cell.className = classes ? `cell ${classes}` : 'cell';
    cell.textContent = text; 
    board.appendChild(cell); 
    return cell; 
}

function findButton(stringNumber, fretNumber) {
    return board.querySelector(
        `.note[data-string-number="${stringNumber}"]` +
        `[data-fret-number="${fretNumber}"]`
    );
}

function createButton(string, fret, stringIndex) {
    const button = document.createElement('button');
    const note = guitar.getNoteAt(string, fret);
    
    button.type = 'button';
    button.textContent = nameOfNote(note);
    button.dataset.stringNumber = string.stringNumber;
    button.dataset.fretNumber = fret;
    button.className = 'note';
    button.setAttribute(
        'aria-label', 
        `${string.label} string, fret ${fret}, ${button.textContent}`
    );
    button.classList.toggle('highlight-primary',
        selected.stringIndex === stringIndex && selected.fret === fret);

    button.addEventListener('click', () => {
        clearFretHighlights();
        button.classList.add('highlight-primary');
        selected = { stringIndex, fret };

        highlightRelatedNotes(stringIndex, fret);
        renderInfo();
    });
    return button;
}

function clearFretHighlights() {
    const classNames = [
        'highlight-primary',
        'highlight-secondary',
        'highlight-tertiary',
        'highlight-additional',
        'note-unplayed'
    ]
    const classString =  `.${classNames.join(', .')}`;
    const previousButtons = document.querySelectorAll(classString);

    previousButtons.forEach((button) => {
        button.classList.remove(...classNames);
    });
}

function highlightFretPositions(positions, className) {
    positions.forEach((position) => {
        const button = findButton(position.string.stringNumber, position.fretNumber);
        button?.classList.add(className);
    });
}

function markUnplayed(positions) {
    positions.forEach((position) => {
        position?.classList.add('note-unplayed');
    });
}

function highlightRelatedNotes(stringIndex, fret) {
    const guitarString = guitar.strings[stringIndex];
    const rootNote = guitar.getNoteAt(guitarString, fret);
    const relatedFrets = guitar.getRelatedFrets(rootNote);

    highlightFretPositions([ ...relatedFrets.majorThirds, ...relatedFrets.minorThirds ], 'highlight-secondary');
    highlightFretPositions(relatedFrets.perfectFifths, 'highlight-tertiary');
}

function highlightChord(chordId) {
	
    const buttons = board.querySelectorAll('.note');
    markUnplayed(buttons);

    const chord = guitar.getChord(chordId);
    chord.positions.forEach((position) => {
        const button = findButton(position.string.stringNumber, position.fretNumber);
        switch (position.role) {
            case 'Root':
                button.classList.remove('note-unplayed');
                button?.classList.add('highlight-primary');
                break
            case 'Major Third':
            case 'Minor Third':
                button.classList.remove('note-unplayed');
                button?.classList.add('highlight-secondary');
                break;
            case 'Perfect fifth':
                button.classList.remove('note-unplayed');
                button?.classList.add('highlight-tertiary');
                break;
            default:
                button.classList.remove('note-unplayed');
                button?.classList.add('highlight-additional');
                break;
        }
    });
}

const activeTabName = () => document.querySelector('.tab.active')?.dataset.tab;

function renderFretboard(){
    board.style.setProperty('--fret-column-count', guitar.fretCount + 1); 
    board.replaceChildren();
    addCell('String', 'label heading');

    // Add headers.
    for (let fret = 0; fret <= guitar.fretCount; fret++) {
        addCell(fret === 0 ? 'Open' : String(fret), 'heading');
    }

    guitar.strings.forEach((string, stringIndex) => {
        addCell(string.label, 'label');
        for (let fret = 0; fret <= guitar.fretCount; fret++) {
            const cell = addCell();
            const button = createButton(string, fret, stringIndex);
            cell.appendChild(button);
        }
    });

    if (activeTabName() === 'notes') {
        highlightRelatedNotes(selected.stringIndex, selected.fret);
    }
}

function describeNote(note) {
    return `${nameOfNote(note)} · ${note.frequency.toFixed(2)} Hz`;
}

function renderInfo() {
    const string = guitar.strings[selected.stringIndex];
    const note = guitar.getNoteAt(string, selected.fret);
    const relatedNotes = getRelatedNotes(note);
    selectedNote.textContent = describeNote(note);
    selectedPosition.textContent = `${string.label} string · ${selected.fret === 0 ? 'open' : `fret ${selected.fret}`}`;
    minorThird.textContent = describeNote(relatedNotes.minorThird);
    majorThird.textContent = describeNote(relatedNotes.majorThird);
    perfectFifth.textContent = describeNote(relatedNotes.perfectFifth);
}

function render() {
    renderFretboard();
    renderInfo();
}

showNotesAs.forEach((radioButton) => {
    radioButton.addEventListener('change', function() {
        render();
    });
});


tabs.forEach((tab) => {
    tab.addEventListener('click', () => {

        if (activeTabName() !== tab.dataset.tab) {

            tabs.forEach((button) => {
                button.classList.toggle('active', button === tab);
            });
            notesPanel.hidden = activeTabName() !== 'notes'
            notesDetails.hidden = activeTabName() !== 'notes'
            chordsPanel.hidden = activeTabName() !== 'chords'
            if (activeTabName() === 'notes') {
                chordSelect.value = '';
                render();
            } else {
                clearFretHighlights();
                
            }
        }
	});
});

chordSelect.addEventListener('change', () => {
    clearFretHighlights();
    const chordName = getChordNames().find(
        (chord) => chord.key === chordSelect.value
    );
    if (chordName) {
        highlightChord(chordSelect.value);
    }
});

getChordNames().forEach((chordName) => {
	const option = document.createElement('option');
	option.value = chordName.key;
	option.textContent = chordName.name;
	chordSelect.appendChild(option);
});

render();

if (new URLSearchParams(window.location.search).get('tab') === 'chords') {
    document.querySelector('.tab[data-tab="chords"]').click();
}
