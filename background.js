try {
	const listData = {
		omw: 'On my way!',
		tq: 'Thank you',
		omg: 'Oh my God!',
		tc: 'take care',
		hbd: 'happy birthday',
	};
	
	chrome.runtime.onInstalled.addListener(() => {
		chrome.storage.sync.set({['list']: listData });
	});
} catch (error) {
	console.log(error);
}

