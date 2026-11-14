export function createFretboardView({
    boardElement,
    guitarStrings,
    fretCount,
    buttonClickCallback
}) {

    const getButtons = () => boardElement.querySelectorAll('.note');

    function build() {
        boardElement.style.setProperty('--fret-column-count', fretCount + 1);
        boardElement.replaceChildren();

        buildHeaders();
        guitarStrings.forEach((string) => {
            addCell(string.label, 'label');
            for (let fret = 0; fret <= fretCount; fret++) {
                const cell = addCell();
                const button = createButton(string, fret);
                cell.appendChild(button);
            }
        });
    }

    function buildHeaders() {
        addCell('String', 'label heading');
        // Add headers.
        for (let fret = 0; fret <= fretCount; fret++) {
            addCell(fret === 0 ? 'Open' : String(fret), 'heading');
        }
    }

    function addCell(text = '', classes = '') {
        const cell = document.createElement('div');
        cell.className = classes ? `cell ${classes}` : 'cell';
        cell.textContent = text;
        boardElement.appendChild(cell);
        return cell;
    }

    function createButton(guitarString, fretNumber) {
        const button = document.createElement('button');

        button.type = 'button';
        button.dataset.stringNumber = guitarString.stringNumber;
        button.dataset.fretNumber = fretNumber;
        button.className = 'note';
        button.addEventListener('click', () => {
            buttonClickCallback({
                stringNumber: guitarString.stringNumber,
                fretNumber: fretNumber
            });
        });
        return button;
    }

    function setNoteLabels(labels) {
        labels.forEach((noteLabel) => setNoteLabel(noteLabel));
    }

    function setNoteLabel({ stringNumber, fretNumber, text }) {
        const button = findButton(stringNumber, fretNumber);
        const guitarString = guitarStrings.find(
            (string) => string.stringNumber === stringNumber
        );
        const fretLabel = fretNumber > 0 ? `fret ${fretNumber}` : 'open';

        button.textContent = text;
        button.setAttribute(
            'aria-label',
            `${guitarString.label} string, ${fretLabel}, ${button.textContent}`
        );
    }

    function findButton(stringNumber, fretNumber) {
        return boardElement.querySelector(
            `.note[data-string-number="${stringNumber}"]` +
            `[data-fret-number="${fretNumber}"]`
        );
    }

    function highlightPosition({ stringNumber, fretNumber }, className) {
        const button = findButton(stringNumber, fretNumber);
        button?.classList.remove('note-unplayed');
        button?.classList.add(className);
    }

    function clearHighlights() {
        const classNames = [
            'highlight-primary',
            'highlight-secondary',
            'highlight-tertiary',
            'highlight-additional',
            'note-unplayed'
        ];
        const classString = `.${classNames.join(', .')}`;
        const previousButtons = boardElement.querySelectorAll(classString);

        previousButtons.forEach((button) => {
            button.classList.remove(...classNames);
        });
    }

    function markUnplayed() {
        const buttons = getButtons();
        buttons.forEach((button) => {
            button?.classList.add('note-unplayed');
        });
    }

    return {
        build,
        setNoteLabels,
        highlightPosition,
        clearHighlights,
        markUnplayed
    }
}
