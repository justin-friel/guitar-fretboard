export function createNoteDetailsView({ detailsElement }) {
	const selectedNote = detailsElement.querySelector('#selected-note');
	const selectedPosition = detailsElement.querySelector('#selected-position');
	const minorThird = detailsElement.querySelector('#minor-third');
	const majorThird = detailsElement.querySelector('#major-third');
	const perfectFifth = detailsElement.querySelector('#perfect-fifth');

	function setDetails({
		selectedNoteDetails,
		selectedPositionDetails,
		majorThirdDetails,
		minorThirdDetails,
		perfectFifthDetails
	}) {
		selectedNote.textContent = selectedNoteDetails;
		selectedPosition.textContent = selectedPositionDetails;
		minorThird.textContent = minorThirdDetails;
		majorThird.textContent = majorThirdDetails;
		perfectFifth.textContent = perfectFifthDetails;
	}

	return {
		setDetails
	};
}
