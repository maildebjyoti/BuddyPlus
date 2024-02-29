var list = {};

/* TODO:
[x] Should work only for input & text area. 
[ ] Should ignore all other input types. and also passwords/emails
[ ] Style should have indication that the extension is active
[-] Confluence/JIRA WYTIWUG iFrame issue wont fix/complex
[?] Extension errors more data required
[ ] input box to add should be sticky to the bottom & rest screen scrolling
[ ] table head sticky
[ ] Should work for few wild characters - @text $text
[ ] Handle keys with spaces
[ ] Settings page
[ ] Help/FAQ/Manual page
[ ] Images & icons
[ ] Remove console & minify

[ ] todo tasks
*/

function elemFocus(event) {
	// event.target.style.background = 'pink';
	event.target.addEventListener('input', captureText);
}

function elemFocusBlur(event) {
	// event.target.style.background = '';
	replaceStr(event);

	event.target.removeEventListener('input', captureText);
}

function captureText(event) {
	if (event.data == ' ') replaceStr(event);
}

function replaceStr(event) {
	let inputValue = event.target.value;
	let specialCharsRegEx = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	if (inputValue) {
		let wrd = inputValue.trim().split(' ').pop().split('.')[0];
		let newStr = '';
		if (list && list.hasOwnProperty(wrd)) {
			if (specialCharsRegEx.test(wrd)) {
				newStr = inputValue.replace(wrd, list[wrd]);
			} else {
				let regex = new RegExp('\\b' + wrd + '\\b', 'gi');
				newStr = inputValue.replace(regex, list[wrd]);
			}
			event.target.value = newStr;
		}
		newStr = keyTextFns(event.target.value);
		event.target.value = newStr;
	}
}

function keyTextFns(str) {
	let resultStr = '';
	let month = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',');

	let today = new Date();
	let dt = today.toLocaleDateString('en-GB').split('/');
	dt[1] = month[parseInt(dt[1] - 1)];
	dt = dt.join('-');
	let now = today.toLocaleTimeString('en-US').split(' ');
	now[0] = now[0].split(':').slice(0, 2).join(':');
	now = now.join(' ');

	resultStr = str.replaceAll('$today', dt); // $today
	resultStr = resultStr.replaceAll('$now', now); // $now
	resultStr = resultStr.replaceAll('$tstamp', dt + ' ' + now); // $tstamp
	//TODO - day, year, tomorrow, yesterday

	return resultStr;
}

const body = document.querySelector('body');
if (body) {
	chrome.storage.sync.get('list', (data) => {
		console.log(data.list);
		list = data.list;
	});

	const evtElm = document.body;
	evtElm.addEventListener('focus', elemFocus, true);
	evtElm.addEventListener('blur', elemFocusBlur, true);
}
