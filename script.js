import { createGuitar } from "./guitar.js";

'use strict';

const guitar = createGuitar(21);

const board = document.getElementById('fretboard');
const toggle = document.getElementById('use-sharps');
const selectedNote = document.getElementById('selected-note');
const selectedPosition = document.getElementById('selected-position');
let selected = { stringIndex: 5, fret: 0 };

function nameOfNote(note) { 

    const sharpOrFlatName = toggle.checked
        ? note.names.sharp
        : note.names.flat;

    const noteName = sharpOrFlatName ?? note.names.natural;

    return noteName + note.octave;
}


function addCell(text = '', classes = '') { 
    const cell = document.createElement('div'); 
    cell.className = classes ? `cell ${classes}` : 'cell';
    cell.textContent = text; 
    board.appendChild(cell); 
    return cell; 
}

function createButton(string, fret, stringIndex) {
    const button = document.createElement('button');
    const note = guitar.getNoteAt(string, fret);
    
    button.type = 'button';
    button.textContent = nameOfNote(note);

    button.className = 'note';
    button.setAttribute(
        'aria-label', 
        `${string.label} string, fret ${fret}, ${button.textContent}`
    );
    button.classList.toggle('highlight-primary',
        selected.stringIndex === stringIndex && selected.fret === fret);
    
    button.addEventListener('click', () => {
        const previousButton = board.querySelector('.note.highlight-primary');
        previousButton?.classList.remove('highlight-primary');
        button.classList.add('highlight-primary');
        selected = { stringIndex, fret };

        renderInfo();
    });
    return button;
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
}

function renderInfo() {
    const string = guitar.strings[selected.stringIndex];
    const note = guitar.getNoteAt(string, selected.fret);
    selectedNote.textContent = `${nameOfNote(note)} · ${note.frequency.toFixed(2)} Hz`;
    selectedPosition.textContent = `${string.label} string · ${selected.fret === 0 ? 'open' : `fret ${selected.fret}`}`;
}

function render() {
    renderFretboard();
    renderInfo();
}

toggle.addEventListener('change', render);
render();

