// Connect socket for each namespace
function joinNamespace(endpoint) {
	// Check if connection is not in use
	if (nsSocket) {
		nsSocket.close();
		// removed the eventListener before it's added again
		document
			.querySelector('#user-input')
			.removeEventListener('submit', formSubmission);
	}
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
		const newMsg = buildHTML(msg);
		document.querySelector('#messages').innerHTML += newMsg;
	});

	// Adding handler to the form
	document
		.querySelector('.message-form')
		.addEventListener('submit', formSubmission);
}
function formSubmission(event) {
	event.preventDefault();
	const message = document.querySelector('#user-message');
	let newMessage = message.value;
	nsSocket.emit('newMessageToServer', newMessage);
	message.value = '';
}

function buildHTML(msg) {
	const convertedDate = new Date(msg.time).toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit'
	});
	return `
	<li>
		<div class="user-image">
			<img src="${msg.avatar}" />
		</div>
		<div class="user-message">
			<div class="user-name-time">
				${msg.username} <span>${convertedDate}</span>
			</div>
			<div class="message-text">
				${msg.text}
			</div>
		</div>
	</li>`;
}
