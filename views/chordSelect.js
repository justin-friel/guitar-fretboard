export function createChordSelectView({
	chordContainerElement,
	optionSelectedCallback
}) {
	const chordSelect = chordContainerElement.querySelector('#chord-select');
	chordSelect.addEventListener('change', () => {
		selectionChanged();
	});

	const getValue = () => chordSelect.value;

	function buildOptions(chordNames) {
		chordNames.forEach((chordName) => {
			const option = document.createElement('option');
			option.value = chordName.key;
			option.textContent = chordName.name;
			chordSelect.appendChild(option);
		});
	}

	function selectionChanged() {
		const selectedValue = getValue();
		optionSelectedCallback(selectedValue);
	}

	const setVisible = (isVisible) => {
		chordContainerElement.hidden = !isVisible;
	};

	return {
		buildOptions,
		getValue,
		setVisible
	};
}
