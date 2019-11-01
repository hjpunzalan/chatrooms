// Whenever user joins a different room
function joinRoom(roomName) {
	// Send this roomName to the server
	nsSocket.emit('joinRoom', roomName);

	nsSocket.on('historyCatchup', history => {
		const messagesList = document.querySelector('#messages');
		messagesList.innerHTML = ''; // removes anything in HTML
		history.forEach(msg => {
			const newMsg = buildHTML(msg); // from joinNs
			const currentMessages = messagesList.innerHTML;
			messagesList.innerHTML = currentMessages + newMsg; // Add message from history
		});
		messagesList.scrollTo(0, messagesList.scrollHeight);
	});

	nsSocket.on('updateMembers', nMembers => {
		// update number of members total
		document.querySelector(
			'.curr-room-num-users'
		).innerHTML = `${nMembers} <i class="fa fa-user" aria-hidden="true"></i>`;
		// update number of members total
		document.querySelector('.curr-room-text').innerText = roomName;
	});

	// Handle search box
	let searchBox = document.querySelector('#search-box');
	searchBox.addEventListener('input', e => {
		// Grab all messages made
		let messages = Array.from(document.getElementsByClassName('message-text'));
		messages.forEach(msg => {
			// Check if input is inside of each
			if (
				msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
			) {
				// the msg does not contain the user search item
				msg.style.display = 'none';
			} else {
				msg.style.display = 'block';
			}
		});
	});
}
