const chordPositions = {
	A: {
		name : 'A Major',
		rootMidiNoteNumber: 45,
		positions: [
			{ stringNumber: 1, fretNumber: 0 },
			{ stringNumber: 2, fretNumber: 2 },
			{ stringNumber: 3, fretNumber: 2 },
			{ stringNumber: 4, fretNumber: 2 },
			{ stringNumber: 5, fretNumber: 0 }
		]
	},
	Am: {
		name : 'A Minor',
		rootMidiNoteNumber: 45,
		positions: [
			{ stringNumber: 1, fretNumber: 0 },
			{ stringNumber: 2, fretNumber: 1 },
			{ stringNumber: 3, fretNumber: 2 },
			{ stringNumber: 4, fretNumber: 2 },
			{ stringNumber: 5, fretNumber: 0 }
		]
	},
	C: {
		name: 'C Major',
		rootMidiNoteNumber: 48,
		positions: [
			{ stringNumber: 1, fretNumber: 0 },
			{ stringNumber: 2, fretNumber: 1 },
			{ stringNumber: 3, fretNumber: 0 },
			{ stringNumber: 4, fretNumber: 2 },
			{ stringNumber: 5, fretNumber: 3 },
		]
	},
	D: {
		name: 'D Major',
		rootMidiNoteNumber: 50,
		positions: [
			{ stringNumber: 1, fretNumber: 2 },
			{ stringNumber: 2, fretNumber: 3 },
			{ stringNumber: 3, fretNumber: 2 },
			{ stringNumber: 4, fretNumber: 0 }
		]
	},	
	Dm: {
		name: 'D Minor',
		rootMidiNoteNumber: 50,
		positions: [
			{ stringNumber: 1, fretNumber: 1 },
			{ stringNumber: 2, fretNumber: 3 },
			{ stringNumber: 3, fretNumber: 2 },
			{ stringNumber: 4, fretNumber: 0 }
		]
	},
	E: {
		name: 'E Major',
		rootMidiNoteNumber: 40,
		positions: [
			{ stringNumber: 1, fretNumber: 0 },
			{ stringNumber: 2, fretNumber: 0 },
			{ stringNumber: 3, fretNumber: 1 },
			{ stringNumber: 4, fretNumber: 2 },
			{ stringNumber: 5, fretNumber: 2 },
			{ stringNumber: 6, fretNumber: 0 }
		]
	},
	Em: {
		name: 'E Minor',
		rootMidiNoteNumber: 40,
		positions: [
			{ stringNumber: 1, fretNumber: 0 },
			{ stringNumber: 2, fretNumber: 0 },
			{ stringNumber: 3, fretNumber: 0 },
			{ stringNumber: 4, fretNumber: 2 },
			{ stringNumber: 5, fretNumber: 2 },
			{ stringNumber: 6, fretNumber: 0 }
		]
	},
	G: {
		name: 'G Major',
		rootMidiNoteNumber: 43,
		positions: [
			{ stringNumber: 1, fretNumber: 3 },
			{ stringNumber: 2, fretNumber: 0 },
			{ stringNumber: 3, fretNumber: 0 },
			{ stringNumber: 4, fretNumber: 0 },
			{ stringNumber: 5, fretNumber: 2 },
			{ stringNumber: 6, fretNumber: 3 }
		]
	}
};

const getChordPosition = (id) => chordPositions[id] ?? null; 

const getChordNames = () =>
    Object.entries(chordPositions).map(([key, value]) => ({
        key,
        name: value.name
    })).sort((a, b) => a.name.localeCompare(b.name));

export { getChordNames, getChordPosition };