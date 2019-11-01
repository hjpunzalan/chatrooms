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
		nsSocket.on('joinRoom', (roomToJoin, nMembers) => {
			// deal with history later
			// Join the room
			nsSocket.join(roomToJoin); // the event joinRoom joins a socket to the room
			io.of('/wiki')
				.in(roomToJoin) //returns method available from the room
				.clients((error, clients) => {
					nMembers(clients.length); // return number of users
				});
		});
		nsSocket.on('newMessageToServer', msg => {
			const fullMsg = {
				text: msg,
				time: Date.now(),
				username: 'jpunzalan',
				avatar: 'https://via.placeholder.com/30'
			};
			// Send this message to All the sockets that are in the room that THIS socket is in
			// console.log(nsSocket.rooms);
			// The user will be in the 2nd room in the object list
			// this is because the socket ALWAYS joins its own room on connection (1st room)
			// get the keys
			const roomTitle = Object.keys(nsSocket.rooms)[1];
			io.of('/wiki')
				.to(roomTitle)
				.emit('messageToClients', fullMsg);
		});
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
