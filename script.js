import { createGuitar } from './guitar.js';
import { intervals, getRelatedNotes } from './music.js';
import { getChordNames } from './guitarChord.js';
import { createFretboardView } from './views/fretboard.js';
import { createNoteDetailsView } from './views/noteDetails.js';
import { createTabsView } from './views/tabs.js';
import { createNoteOptionsView } from './views/noteOptions.js';
import { createChordSelectView } from './views/chordSelect.js';
import { createChordDetailsView } from './views/chordDetails.js';

const guitar = createGuitar(21);
const tabNameNotes = 'notes';
const tabNameChords = 'chords';
const defaultSelected = Object.freeze({ stringNumber: 6, fretNumber: 0 });
let selected = { ...defaultSelected };
const intervalClassMap = Object.freeze({
	[intervals.unison]: 'highlight-primary',
	[intervals.majorThird]: 'highlight-secondary',
	[intervals.minorThird]: 'highlight-secondary',
	[intervals.perfectFifth]: 'highlight-tertiary'
});
const fretboard = createFretboardView({
	boardElement: document.getElementById('fretboard'),
	guitarStrings: guitar.strings,
	fretCount: guitar.fretCount,
	buttonClickCallback: onPositionSelected
});
const notesDetailsView = createNoteDetailsView({
	detailsElement: document.getElementById('notes-details')
});
const tabsView = createTabsView({
	tabsElement: document.getElementById('tabs'),
	tabSelectedCallback: onTabSelected
});
const noteOptionsView = createNoteOptionsView({
	optionsElement: document.getElementById('notes-panel'),
	optionSelectedCallback: onNoteOptionChanged
});
const chordSelectView = createChordSelectView({
	chordContainerElement: document.getElementById('chords-panel'),
	optionSelectedCallback: showSelectedChord
});

const chordDetailsView = createChordDetailsView(
	document.getElementById('chords-details')
);

function onNoteOptionChanged(selectedValue) {
	setFretboardLabels(selectedValue);
	showSelectedNote();
}

function getNoteName(note, sharpOrFlatName) {
	const noteName = note.names[sharpOrFlatName] ?? note.names.natural;
	return noteName + note.octave;
}

function onPositionSelected({ stringNumber, fretNumber }) {
	if (tabsView.getActiveTabName() === tabNameNotes) {
		selected = { stringNumber, fretNumber };
		showSelectedNote();
	}
}

function showSelectedNote() {
	const noteInfo = getSelectedNoteInfo(selected);

	fretboard.clearHighlights();
	highlightNotePositions(noteInfo);
	setNoteDetails(noteInfo);
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
			intervalClassMap[position.interval] ?? 'highlight-additional';

		fretboard.highlightPosition(position, className);
	});
}

function highlightNotePositions({ note, relatedNotes }) {
	const relatedFrets = guitar.getRelatedFrets(note, relatedNotes);
	highlightPositionsByInterval(relatedFrets);
}

function highlightChord(chord) {
	highlightPositionsByInterval(chord.positions);
}

function showSelectedChord(chordId) {
	fretboard.clearHighlights();
	fretboard.markUnplayed();
	chordDetailsView.clearRelatedNotes();
	const chord = guitar.getChord(chordId);
	if (chord) {
		highlightChord(chord);
		const chordIntervals = {
			[intervals.unison]: { name: 'Roots', values: [] },
			[intervals.majorThird]: { name: 'Major Thirds', values: [] },
			[intervals.minorThird]: { name: 'Minor Thirds', values: [] },
			[intervals.perfectFifth]: { name: 'Perfect Fifths', values: [] }
		};
		chord.positions.forEach((position) => {
			const description = describeNote(position.note);
			chordIntervals[position.interval].values.push(description);
		});

		chordDetailsView.setDetails({
			name: chord.name,
			toneGroups: chordIntervals
		});
	}
}

function describeNote(note) {
	const sharpOrFlatName = noteOptionsView.getSelectedOption();
	return `${getNoteName(note, sharpOrFlatName)} · ${note.frequency.toFixed(2)} Hz`;
}

function setNoteDetails({ string, fretNumber, note, relatedNotes }) {
	const fretLabel = fretNumber === 0 ? 'open' : `fret ${fretNumber}`;
	notesDetailsView.setDetails({
		selectedNoteDetails: describeNote(note),
		selectedPositionDetails: `${string.label} string · ${fretLabel}`,
		majorThirdDetails: describeNote(relatedNotes.majorThird),
		minorThirdDetails: describeNote(relatedNotes.minorThird),
		perfectFifthDetails: describeNote(relatedNotes.perfectFifth)
	});
}

function onTabSelected(tabName) {
	setTabVisibility(tabName);

	if (tabName === tabNameNotes) {
		showSelectedNote();
	}
	if (tabName === tabNameChords) {
		const selectedChordId = chordSelectView.getValue();
		showSelectedChord(selectedChordId);
	}
}

function setTabVisibility(tabName) {
	noteOptionsView.setVisible(tabName === tabNameNotes);
	notesDetailsView.setVisible(tabName === tabNameNotes);
	chordSelectView.setVisible(tabName === tabNameChords);
	chordDetailsView.setVisible(tabName === tabNameChords);
}

function setFretboardLabels(noteType) {
	const labels = [];
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
setFretboardLabels(noteOptionsView.getSelectedOption());
chordSelectView.buildOptions(getChordNames());
showSelectedNote();

const requestedTab = new URLSearchParams(window.location.search).get('tab');
tabsView.setActiveTab(requestedTab);
