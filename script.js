import { createGuitar } from "./guitar.js";
import { intervals, getRelatedNotes } from "./music.js";
import { getChordNames } from "./guitarChord.js";

const guitar = createGuitar(21);

const tabNameNotes = 'notes';
const tabNameChords = 'chords';
const tabs = document.querySelectorAll('.tab');
const activeTabName = () => document.querySelector('.tab.active')?.dataset.tab;
const notesPanel = document.getElementById('notes-panel');
const chordsPanel = document.getElementById('chords-panel');
const notesDetails = document.getElementById('notes-details');
const chordsDetails = document.getElementById('chords-details');
const chordSelect = document.getElementById('chord-select');
const board = document.getElementById('fretboard');
const showNotesAs = document.querySelectorAll('input[name="sharpsOrFlats"]');
const selectedNote = document.getElementById('selected-note');
const selectedPosition = document.getElementById('selected-position');
const minorThird = document.getElementById('minor-third');
const majorThird = document.getElementById('major-third');
const perfectFifth = document.getElementById('perfect-fifth');
const chordRelatedDetails = document.getElementById('chord-related-details');
const defaultSelected = Object.freeze({ stringIndex: 5, fret: 0 });
let selected = { ...defaultSelected };
const intervalClassMap = Object.freeze({
    [intervals.unison]: 'highlight-primary',
    [intervals.majorThird]: 'highlight-secondary',
    [intervals.minorThird]: 'highlight-secondary',
    [intervals.perfectFifth]: 'highlight-tertiary'
});

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

    button.addEventListener('click', () => {
        if (activeTabName() === tabNameNotes) {
            selected = { stringIndex, fret };

            const noteInfo = getSelectedNoteInfo();
            renderNoteInfo(noteInfo);
            renderFretboardHighlights(noteInfo);
        }
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
    ];
    const classString = `.${classNames.join(', .')}`;
    const previousButtons = board.querySelectorAll(classString);

    previousButtons.forEach((button) => {
        button.classList.remove(...classNames);
    });
}

function getSelectedNoteInfo() {
    const string = guitar.strings[selected.stringIndex];
    const note = guitar.getNoteAt(string, selected.fret);

    return {
        string,
        fret: selected.fret,
        note,
        relatedNotes: getRelatedNotes(note)
    };
}

function highlightFretPositions(positions, className) {
    positions.forEach((position) => {
        const button = findButton(position.string.stringNumber, position.fretNumber);
        button?.classList.add(className);
    });
}

function markUnplayed(buttons) {
    buttons.forEach((button) => {
        button?.classList.add('note-unplayed');
    });
}

function highlightRelatedNotes({ note, relatedNotes }) {
    const relatedFrets = guitar.getRelatedFrets(note, relatedNotes);

    highlightFretPositions([ ...relatedFrets.majorThirds, ...relatedFrets.minorThirds ], 'highlight-secondary');
    highlightFretPositions(relatedFrets.perfectFifths, 'highlight-tertiary');
}

function highlightSelectedNote({ string, fret }) {
    const button = findButton(string.stringNumber, fret);
    button?.classList.add('highlight-primary');
}

function renderFretboardHighlights(noteInfo) {
    clearFretHighlights();

    const tabName = activeTabName();
    if (tabName === tabNameNotes) {
        highlightSelectedNote(noteInfo);
        highlightRelatedNotes(noteInfo);
    } else if (tabName === tabNameChords) {
        highlightChord(chordSelect.value);
    }
}

function highlightChord(chordId) {
    const buttons = board.querySelectorAll('.note');
    markUnplayed(buttons);

    const chord = guitar.getChord(chordId);
    if (!chord) {
        return;
    }

    chord.positions.forEach((position) => {
        const button = findButton(position.string.stringNumber, position.fretNumber);
        button?.classList.remove('note-unplayed');
        button?.classList.add(
            intervalClassMap[position.interval] ?? 'highlight-additional'
        );
    });
}

function renderFretboard() {
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

function describeNote(note) {
    return `${nameOfNote(note)} · ${note.frequency.toFixed(2)} Hz`;
}

function renderNoteInfo({ string, fret, note, relatedNotes }) {
    selectedNote.textContent = describeNote(note);
    selectedPosition.textContent = `${string.label} string · ${fret === 0 ? 'open' : `fret ${fret}`}`;
    minorThird.textContent = describeNote(relatedNotes.minorThird);
    majorThird.textContent = describeNote(relatedNotes.majorThird);
    perfectFifth.textContent = describeNote(relatedNotes.perfectFifth);
}

function render() {
    const noteInfo = getSelectedNoteInfo();
    renderFretboard();
    renderNoteInfo(noteInfo);
    renderFretboardHighlights(noteInfo);
}

showNotesAs.forEach((radioButton) => {
    radioButton.addEventListener('change', () => {
        render();
    });
});

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const nextTabName = tab.dataset.tab;
        if (activeTabName() !== nextTabName) {
            tabs.forEach((button) => {
                button.classList.toggle('active', button === tab);
            });

            chordsPanel.hidden = nextTabName !== tabNameChords;
            if (nextTabName !== tabNameChords) {
                chordSelect.value = '';
            }

            notesPanel.hidden = nextTabName !== tabNameNotes;
            notesDetails.hidden = nextTabName !== tabNameNotes;
            if (nextTabName === tabNameNotes) {
                render();
            } else if (nextTabName === tabNameChords) {
                const noteInfo = getSelectedNoteInfo();
                renderNoteInfo(noteInfo);
                renderFretboardHighlights(noteInfo);
            } else {
                clearFretHighlights();
                selected = { ...defaultSelected };
            }
        }
    });
});

chordSelect.addEventListener('change', () => {
    renderFretboardHighlights(getSelectedNoteInfo());
});

getChordNames().forEach((chordName) => {
    const option = document.createElement('option');
    option.value = chordName.key;
    option.textContent = chordName.name;
    chordSelect.appendChild(option);
});

render();

if (new URLSearchParams(window.location.search).get('tab') === tabNameChords) {
    document.querySelector(`.tab[data-tab="${tabNameChords}"]`).click();
}
