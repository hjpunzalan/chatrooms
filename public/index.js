const socket = io('http://localhost:8000');

socket.on('messageFromServer', dataFromServer => {
	console.log(dataFromServer);
	socket.emit('dataToServer', {
		data: 'Data from the client!'
	});
});

// Adding handler to the form
// document.querySelector('#message-form').addEventListener('submit', event => {
// 	event.preventDefault();
// 	const newMessage = document.querySelector('#user-message').value;
// 	socket.emit('newMessageToServer', {
// 		text: newMessage
// 	});
// });
