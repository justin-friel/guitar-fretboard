export function createNoteOptionsView({
	optionsElement,
	optionSelectedCallback
}) {
	const noteOptions = Array.from(
		optionsElement.querySelectorAll(
			'input[type="radio"][name="sharpsOrFlats"]'
		)
	);

	noteOptions.forEach((option) =>
		option.addEventListener('change', () => {
			optionSelectedCallback(getSelectedOption());
		})
	);

	const getSelectedOption = () =>
		noteOptions.find((option) => option.checked)?.value;

	return {
		getSelectedOption
	};
}
