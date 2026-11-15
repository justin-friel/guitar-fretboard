export function createTabsView({ tabsElement, tabSelectedCallback }) {
	const tabs = Array.from(tabsElement.querySelectorAll('.tab'));
	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			setActiveTab(tab.dataset.tab);
		});
	});

	const tabExists = (tabName) =>
		tabs.some((tab) => tab.dataset.tab === tabName);

	const getActiveTabName = () =>
		tabs.find((tab) => tab.classList.contains('active'))?.dataset.tab;

	function setActiveTab(tabName) {
		if (tabExists(tabName) && getActiveTabName() !== tabName) {
			tabs.forEach((tab) => {
				tab.classList.toggle('active', tab.dataset.tab === tabName);
			});
			tabSelectedCallback(tabName);
		}
	}
	return {
		getActiveTabName,
		setActiveTab
	};
}
