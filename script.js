import { createGuitar } from "./guitar.js";
import { intervals, getRelatedNotes } from "./music.js";
import { getChordNames } from "./guitarChord.js";
import { createFretboardView } from "./views/fretboard.js";

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
const defaultSelected = Object.freeze({ stringNumber: 6, fretNumber: 0 });
let selected = { ...defaultSelected };
const intervalClassMap = Object.freeze({
    [intervals.unison]: 'highlight-primary',
    [intervals.majorThird]: 'highlight-secondary',
    [intervals.minorThird]: 'highlight-secondary',
    [intervals.perfectFifth]: 'highlight-tertiary'
});
const fretboard = createFretboardView({
    boardElement: board,
    guitarStrings: guitar.strings,
    fretCount: guitar.fretCount,
    buttonClickCallback: onPositionSelected
});

function getNoteType() {
    let noteType = 'sharp';
    showNotesAs.forEach((radio) => {
        if (radio.checked) {
            noteType = radio.value;
        }
    });
    return noteType;
}

function getNoteName(note, sharpOrFlatName) {
    const noteName = note.names[sharpOrFlatName] ?? note.names.natural;
    return noteName + note.octave;
}

function onPositionSelected({
    stringNumber,
    fretNumber
}) {
    if (activeTabName() === tabNameNotes) {
        selected = { stringNumber, fretNumber };
        showSelectedNote();
    }
}

function showSelectedNote() {
    const noteInfo = getSelectedNoteInfo(selected);

    fretboard.clearHighlights();
    fretboard.highlightPosition(selected, 'highlight-primary');
    highlightRelatedNotes(noteInfo);
    renderNoteInfo(noteInfo);
}

function getSelectedNoteInfo({ stringNumber, fretNumber }) {
    const guitarString = guitar.strings.find(
        (string) => string.stringNumber === stringNumber
    );
    const note = guitar.getNoteAt(guitarString, fretNumber);

    return {
        string: guitarString,
        fretNumber,
        note,
        relatedNotes: getRelatedNotes(note)
    };
}

function highlightPositionsByInterval(positions) {
    positions.forEach((position) => {
        const className =
            intervalClassMap[position.interval] ??
            'highlight-additional';

        fretboard.highlightPosition(position, className);
    });
}

function highlightRelatedNotes({
    note,
    relatedNotes
}) {
    const relatedFrets =
        guitar.getRelatedFrets(note, relatedNotes);

    highlightPositionsByInterval(relatedFrets);
}

function highlightChord(chordId) {
    const chord = guitar.getChord(chordId);
    if (chord) {
        highlightPositionsByInterval(chord.positions);
    }
}

function showSelectedChord() {
    fretboard.clearHighlights();
    fretboard.markUnplayed();
    if (chordSelect.value) {
        highlightChord(chordSelect.value);
    }
}

function describeNote(note) {
    const sharpOrFlatName = getNoteType();
    return `${getNoteName(note, sharpOrFlatName)} · ${note.frequency.toFixed(2)} Hz`;
}

function renderNoteInfo({ string, fretNumber, note, relatedNotes }) {
    selectedNote.textContent = describeNote(note);
    selectedPosition.textContent = `${string.label} string · ${fretNumber === 0 ? 'open' : `fret ${fretNumber}`}`;
    minorThird.textContent = describeNote(relatedNotes.minorThird);
    majorThird.textContent = describeNote(relatedNotes.majorThird);
    perfectFifth.textContent = describeNote(relatedNotes.perfectFifth);
}

showNotesAs.forEach((radioButton) => {
    radioButton.addEventListener('change', () => {
        setFretboardLabels();
        showSelectedNote();
    });
});

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const nextTabName = tab.dataset.tab;
        selectTab(nextTabName);
    });
});

function selectTab(tabName) {
    if (activeTabName() !== tabName) {
        setActiveTab(tabName);
        setTabVisibility(tabName);

        if (tabName === tabNameNotes) {
            showSelectedNote();
        }
        if (tabName === tabNameChords) {
            showSelectedChord();
        }
    }
}

function setActiveTab(tabName) {
    tabs.forEach((tab) => {
        tab.classList.toggle(
            'active',
            tab.dataset.tab === tabName);
    });
}
function setTabVisibility(tabName) {
    notesPanel.hidden = tabName !== tabNameNotes;
    notesDetails.hidden = tabName !== tabNameNotes;
    chordsPanel.hidden = tabName !== tabNameChords;
}

chordSelect.addEventListener('change', () => {
    showSelectedChord();
});

getChordNames().forEach((chordName) => {
    const option = document.createElement('option');
    option.value = chordName.key;
    option.textContent = chordName.name;
    chordSelect.appendChild(option);
});

function setFretboardLabels() {
    const labels = [];
    const noteType = getNoteType();
    guitar.strings.forEach((guitarString) => {
        for (let fretNumber = 0; fretNumber <= guitar.fretCount; fretNumber++) {
            const note = guitar.getNoteAt(guitarString, fretNumber);
            const label = {
                stringNumber: guitarString.stringNumber,
                fretNumber,
                text: getNoteName(note, noteType)
            };
            labels.push(label);
        }
    });
    fretboard.setNoteLabels(labels);
}

fretboard.build();
setFretboardLabels();
showSelectedNote();

const requestedTab = new URLSearchParams(window.location.search).get('tab');
if (requestedTab === tabNameNotes || requestedTab === tabNameChords) {
    selectTab(requestedTab);
}
