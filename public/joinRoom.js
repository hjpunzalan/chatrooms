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
}
