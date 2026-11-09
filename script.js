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

function highlightRelatedNotes(stringIndex, fret) {
    const guitarString = guitar.strings[stringIndex];
    const rootNote = guitar.getNoteAt(guitarString, fret);
    const relatedFrets = guitar.getRelatedFrets(rootNote);

    highlightFretPositions([ ...relatedFrets.majorThirds, ...relatedFrets.minorThirds ], 'highlight-secondary');
    highlightFretPositions(relatedFrets.perfectFifths, 'highlight-tertiary');
}

function highlightChord(chordName) {
	const buttons = board.querySelectorAll('.note');

	clearFretHighlights();
/*
	const testPositions = [
		{ stringNumber: 6, fretNumber: 0, className: 'highlight-primary' },
		{ stringNumber: 3, fretNumber: 1, className: 'highlight-secondary' },
		{ stringNumber: 5, fretNumber: 2, className: 'highlight-tertiary' },
		{ stringNumber: 4, fretNumber: 2, className: 'highlight-additional' }
	];

	testPositions.forEach(({ stringNumber, fretNumber, className }) => {
		const button = findButton(stringNumber, fretNumber);
		if (!button)  {
            return;
        }

		button.classList.remove('note-unplayed');
		button.classList.add(className);
	});
*/
}

function isNotesMode() {
    const activeTabName = document.querySelector('.tab.active')?.dataset.tab;

    return (activeTabName === 'notes');
}

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

    if (isNotesMode()) {       
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
		const isNotesMode = tab.dataset.tab === 'notes';

		tabs.forEach((button) => {
			button.classList.toggle('active', button === tab);
		});


		notesPanel.hidden = !isNotesMode;
		notesDetails.hidden = !isNotesMode;
		chordsPanel.hidden = isNotesMode;
        if (isNotesMode) {
            render();
        } else {
            clearFretHighlights();
        }
	});
});

chordSelect.addEventListener('change', () => {
    const chordName = getChordNames().find(
        (chordName) => chordName.key === chordSelect.value 
    );
    if (chordName) {
	    const chord = guitar.getChord(chordSelect.value);
	// highlightChord(chordName);

    }
    
});

getChordNames().forEach((chordName) => {
	const option = document.createElement('option');
	option.value = chordName.key;
	option.textContent = chordName.name;
	chordSelect.appendChild(option);
});

render();
