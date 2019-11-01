const socket = io('http://localhost:8000');

// listen for nsList, which is a list of all the namespaces
socket.on('nsList', nsData => {
	// Update DOM
	let namespacesDiv = document.querySelector('.namespaces');
	namespacesDiv.innerHTML = '';
	nsData.forEach(ns => {
		namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`;
	});

	// Add a click listener to all the namespace
	// Convert Array like node list into an array
	Array.from(document.getElementsByClassName('namespace')).forEach(elem => {
		elem.addEventListener('click', e => {
			// Get ns attribute from div ie.elem
			const nsEndPoint = elem.getAttribute('ns');
			console.log(`${nsEndPoint} I should go to now`);
		});
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
