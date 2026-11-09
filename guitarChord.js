const chordPositions = {
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
	}
};

const getChordPosition = (id) => chordPositions[id] ?? null; 

const getChordNames = () =>
    Object.entries(chordPositions).map(([key, value]) => ({
        key,
        name: value.name
    }));

export { getChordNames, getChordPosition };