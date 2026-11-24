const semitonesPerOctave = 12;

const intervals = Object.freeze({
	unison: 0,
	minorSecond: 1,
	majorSecond: 2,
	minorThird: 3,
	majorThird: 4,
	perfectFourth: 5,
	tritone: 6,
	perfectFifth: 7,
	minorSixth: 8,
	majorSixth: 9,
	minorSeventh: 10,
	majorSeventh: 11
});

// prettier-ignore
const intervalNames = new Map([
	[
		intervals.unison,
		Object.freeze({ singular: 'Root', plural: 'Roots' })
	],
	[
		intervals.minorSecond,
		Object.freeze({ singular: 'Minor Second', plural: 'Minor Seconds' })
	],
	[
		intervals.majorSecond,
		Object.freeze({ singular: 'Major Second', plural: 'Major Seconds' })
	],
	[
		intervals.minorThird,
		Object.freeze({ singular: 'Minor Third', plural: 'Minor Thirds' })
	],
	[
		intervals.majorThird,
		Object.freeze({ singular: 'Major Third', plural: 'Major Thirds' })
	],
	[
		intervals.perfectFourth,
		Object.freeze({ singular: 'Perfect Fourth', plural: 'Perfect Fourths' })
	],
	[
		intervals.tritone,
		Object.freeze({ singular: 'Tritone', plural: 'Tritones' })
	],
	[
		intervals.perfectFifth,
		Object.freeze({ singular: 'Perfect Fifth', plural: 'Perfect Fifths' })
	],
	[
		intervals.minorSixth,
		Object.freeze({ singular: 'Minor Sixth', plural: 'Minor Sixths' })
	],
	[
		intervals.majorSixth,
		Object.freeze({ singular: 'Major Sixth', plural: 'Major Sixths' })
	],
	[
		intervals.minorSeventh,
		Object.freeze({ singular: 'Minor Seventh', plural: 'Minor Sevenths' })
	],
	[
		intervals.majorSeventh,
		Object.freeze({ singular: 'Major Seventh', plural: 'Major Sevenths' })
	]

]);

function getIntervalNames(interval) {
	if (
		!Number.isInteger(interval) ||
		interval < 0 ||
		interval >= semitonesPerOctave
	) {
		throw new TypeError('Interval must be an integer between 0 and 11');
	}
	const names = intervalNames.get(interval);
	if (!names) {
		throw new Error(`No interval terminology is defined for ${interval}.`);
	}

	return names;
}

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
].map((names) => Object.freeze(names));

function createNote(midiNoteNumber, frequency) {
	const noteIndex = midiNoteNumber % semitonesPerOctave;

	const octave = Math.floor(midiNoteNumber / semitonesPerOctave) - 1;

	return Object.freeze({
		midiNoteNumber,
		octave,
		frequency,
		names: noteNames[noteIndex]
	});
}

const referenceNote = createNote(69, 440);

function getNote(midiNoteNumber) {
	const semitoneDistance = midiNoteNumber - referenceNote.midiNoteNumber;

	const octaveDistance = semitoneDistance / semitonesPerOctave;

	const frequency = referenceNote.frequency * Math.pow(2, octaveDistance);

	return createNote(midiNoteNumber, frequency);
}

function getRelatedNote(note, semitoneCount) {
	const relatedNoteNumber = note.midiNoteNumber + semitoneCount;
	return getNote(relatedNoteNumber);
}

function getRelatedNotes(note) {
	return Object.freeze({
		majorThird: getRelatedNote(note, intervals.majorThird),
		minorThird: getRelatedNote(note, intervals.minorThird),
		perfectFifth: getRelatedNote(note, intervals.perfectFifth)
	});
}

function getInterval(firstNote, secondNote) {
	const distance = secondNote.midiNoteNumber - firstNote.midiNoteNumber;

	return (
		((distance % semitonesPerOctave) + semitonesPerOctave) %
		semitonesPerOctave
	);
}

export { intervals, getInterval, getIntervalNames, getNote, getRelatedNotes };
