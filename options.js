var listObj = {};

function isKeyValid(key) {
	// Handle Special characters
	let spaceNum = /^\d|.*\s/;
	if (spaceNum.test(key)) {
		handleErrors('Error! String cannot start with number or contain spaces');
		return false;
	}

	// Allowed: !@#$%^&_+-.?
	// Not Allowed: %*()=\[]{};':"\|,<>`~
	// let invalidSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;
	let invalidSpecialChars = /[%*()=\[\]{};':"\\|,<>`~]/;
	if (invalidSpecialChars.test(key)) {
		handleErrors('Error! Invalid special character');
		return false;
	}

	return true;
}

function deleteRow(parentObj) {
	let keyObj = parentObj.querySelector('td:nth-child(1) > input');
	let valueObj = parentObj.querySelector('td:nth-child(2) > input');
	let index = parentObj.rowIndex - 1;
	// console.log('Delete:', keyObj.value, '-', valueObj.value, '|', index);

	if (listObj && listObj.hasOwnProperty(keyObj.value)) {
		delete listObj[keyObj.value];

		// Remove Listeners & Delete
		keyObj.removeEventListener('keydown', handleKeyDown);
		valueObj.removeEventListener('keydown', handleKeyDown);
		parentObj.removeEventListener('click', handleRowClicks);
		parentObj.parentNode.deleteRow(index);

		syncStorage();
	}
}

function saveRow(parentObj) {
	let key = parentObj.querySelector('td:nth-child(1) > input').value;
	let value = parentObj.querySelector('td:nth-child(2) > input').value;
	let index = parentObj.rowIndex - 1;
	// console.log('Save Edited Row:', key, '-', value, '|', index);

	if (!isKeyValid(key)) {
		return;
	}

	let oldKey = Object.keys(listObj)[index];
	if (listObj && listObj.hasOwnProperty(oldKey)) {
		delete listObj[oldKey];
		listObj[key] = value;
		syncStorage();
	}
}

function addRow(evt, key, value, isLoadedFromDB) {
	clearErrors();
	if (!isLoadedFromDB) {
		if (!key) {
			key = document.getElementById('ipKey').value.trim();

			if (listObj && listObj.hasOwnProperty(key)) {
				// Duplicate check
				handleErrors('Error! Already exists!');
				evt.preventDefault();
				return;
			}

			if (!isKeyValid(key)) {
				evt.preventDefault();
				return;
			}

			document.getElementById('ipKey').value = '';
		}
		if (!value) {
			value = document.getElementById('ipValue').value.trim();
			document.getElementById('ipValue').value = '';
		}
	}

	// Return if empty
	if (!key) return;
	if (!value) return;

	let tableRef = document.querySelector('#listTable > tbody');
	let newRow = document.createElement('tr');

	let cellKey = document.createElement('td');
	cellKey.innerHTML = `<input size="10" type="text" class="ip-key" value="${key}"/>`;
	cellKey.addEventListener('keydown', handleKeyDown);

	let cellValue = document.createElement('td');
	cellValue.innerHTML = `<input size="30" type="text" class="ip-value" value="${value}"/>`;
	cellValue.addEventListener('keydown', handleKeyDown);

	let cellDel = document.createElement('td');
	cellDel.innerHTML =
		'<input type="button" value="DelRow" class="btn-style del-row"/>';

	let cellSave = document.createElement('td');
	cellSave.innerHTML =
		'<input type="button" value="SaveRow" class="btn-style save-row"/>';

	// Append the cells to the row
	newRow.appendChild(cellKey);
	newRow.appendChild(cellValue);
	newRow.appendChild(cellSave);
	newRow.appendChild(cellDel);

	// Add Listeners
	newRow.addEventListener('click', handleRowClicks);

	// Append the row to the table
	tableRef.appendChild(newRow);

	if (!listObj) listObj = {};
	if (!isLoadedFromDB) {
		listObj[key] = value;
		// console.log('Save/Sync the input', key, value, listObj);
		syncStorage();
	}
}

function syncStorage() {
	chrome.storage.sync.set({ ['list']: listObj });
	document.getElementById('ipForm').submit();
}

function handleRowClicks(obj) {
	let value = obj.srcElement.value;
	let parentElem = obj.srcElement.parentNode.parentNode;
	// console.log('handleRowClicks >>', obj, value);
	switch (value) {
		case 'DelRow':
			deleteRow(parentElem);
			break;
		case 'SaveRow':
			saveRow(parentElem);
			break;
	}
}

function handleKeyDown(event) {
	if (event.key === 'Enter' || event.keyCode === 13) {
		// console.log('Enter key was pressed', event);
		saveRow(event.srcElement.parentElement.parentElement);
	}
}

function clearErrors() {
	document.getElementById('msgBox').innerHTML = '';
}

function handleErrors(msg) {
	document.getElementById('msgBox').innerHTML = msg;
}

function constructOptions() {
	chrome.storage.sync.get('list', (data) => {
		listObj = data.list;
		// console.log(listObj); //Need for DEBUG option in settings
		for (let key in listObj) {
			addRow(null, key, listObj[key], true);
		}
	});

	const addBtn = document.getElementById('addRow');
	addBtn.addEventListener('click', addRow);
}

// Initialize the page by constructing the color options
constructOptions();
