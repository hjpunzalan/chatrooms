const express = require('express');
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

// Initialise express
const app = express();
app.use(express.static(__dirname + '/public'));

// Declare server
const server = app.listen(8000, () => {
	console.log('Listening at port 8000...');
});
const io = socketio(server);

// loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
	io.of(namespace.endpoint).on('connection', nsSocket => {
		console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
		// socket connected to our namespaces
		// send that ns group info back
		nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
	});
});

// Connected to the main namespace '/'
io.on('connection', socket => {
	// build an array to send  back with the img and endpoint for each NS
	let nsData = namespaces.map(ns => {
		return {
			img: ns.img,
			endpoint: ns.endpoint
		};
	});
	// Send the nsData back to client. Need to use socket and NOT io, because we want it to go to just this client
	// using io sends it to everyone, socket sends it to the person connecting
	socket.emit('nsList', nsData);
});

// Connected to the admin namespace
// io.of('/admin').on('connection', socket => {
// 	socket.emit('welcome', 'Someone connected to the admin namespace!');
// });
