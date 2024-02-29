function openOptionPage() {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('options.html'));
	}
}

document.addEventListener('DOMContentLoaded', function () {
	openOptionPage();
});
