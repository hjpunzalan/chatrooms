// Connect socket for each namespace
function joinNamespace(endpoint) {
	nsSocket = io(`http://localhost:8000${endpoint}`);
	nsSocket.on('nsRoomLoad', nsrooms => {
		let roomList = document.querySelector('.room-list');
		roomList.innerHTML = '';
		nsrooms.forEach(room => {
			let icon;
			room.privateRoom ? (icon = 'lock') : (icon = 'slack');
			roomList.innerHTML += `<li class="room">
			<i class="fa fa-${icon}" aria-hidden="true"></i>
			${room.roomTitle}
			</li>`;
		});

		// add click listener to each room
		let roomNodes = document.getElementsByClassName('room');
		Array.from(roomNodes).forEach(elem => {
			elem.addEventListener('click', e => {
				console.log(e.target.innerText);
			});
		});

		// add room automatically... first time here
		const topRoom = document.querySelector('.room'); // grab first li
		const topRoomName = topRoom.innerText; // from li
		joinRoom(topRoomName);
	});

	// Listens message from server
	nsSocket.on('messageToClients', msg => {
		document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
	});

	// Adding handler to the form
	document.querySelector('.message-form').addEventListener('submit', event => {
		event.preventDefault();
		const message = document.querySelector('#user-message');
		let newMessage = message.value;
		nsSocket.emit('newMessageToServer', {
			text: newMessage
		});
		message.value = '';
	});
}
