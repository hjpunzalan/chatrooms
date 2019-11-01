const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));

const server = app.listen(8000, () => {
	console.log('Listening at port 8000...');
});
const io = socketio(server);

// Connected to the main namespace '/'
io.on('connection', socket => {
	socket.emit('messageFromServer', { data: 'Welcome to the socket io server' });
	socket.on('messageToServer', dataFromClient => {
		console.log(dataFromClient);
	});

	socket.join('level1');
	socket
		.to('level1')
		.emit('joined', `${socket.id} says I have joined the level 1 room!`);
});

// Connected to the admin namespace
io.of('/admin').on('connection', socket => {
	socket.emit('welcome', 'Someone connected to the admin namespace!');
});
