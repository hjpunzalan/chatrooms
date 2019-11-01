function joinRoom(roomName) {
	// Send this roomName to the server
	nsSocket.emit('joinRoom', roomName, nMembers => {
		// update number of members total
		document.querySelector(
			'.curr-room-num-users'
		).innerHTML = `${nMembers} <i class="fa fa-user" aria-hidden="true"></i>`;
	});
}
