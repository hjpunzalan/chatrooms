const socket = io('http://localhost:8000');
let nsSocket;

// listen for nsList, which is a list of all the namespaces
socket.on('nsList', nsData => {
	// Update DOM
	let namespacesDiv = document.querySelector('.namespaces');
	namespacesDiv.innerHTML = '';
	nsData.forEach(ns => {
		namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`;
		joinNamespace(ns.endpoint);
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
