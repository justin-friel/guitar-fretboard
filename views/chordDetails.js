export function createChordDetailsView(detailsElement) {
	const chordName = detailsElement.querySelector('#chord-name');
	const relatedNotes = detailsElement.querySelector('#chord-tone-groups');

	function setDetails({ name, toneGroups }) {
		chordName.textContent = name;
		setRelatedNotes(toneGroups);
	}

	function setRelatedNotes(toneGroups) {
		const toneGroupClass = 'tone-group';
		Object.values(toneGroups).forEach((toneGroup) => {
			if (toneGroup.values.length > 0) {
				const toneSection = document.createElement('section');
				toneSection.classList.add(toneGroupClass);
				relatedNotes.appendChild(toneSection);

				const toneLabel = document.createElement('h3');
				toneLabel.textContent = toneGroup.name;
				toneSection.appendChild(toneLabel);

				const toneList = document.createElement('ul');
				toneSection.appendChild(toneList);

				toneGroup.values.forEach((tone) => {
					const toneDescription = document.createElement('li');
					toneDescription.textContent = tone;
					toneList.appendChild(toneDescription);
				});
			}
		});
	}

	function clearRelatedNotes() {
		chordName.textContent = 'None Selected';
		relatedNotes.replaceChildren();
	}

	const setVisible = (isVisible) => {
		detailsElement.hidden = !isVisible;
	};

	return {
		setDetails,
		clearRelatedNotes,
		setVisible
	};
}
