const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9000, path: '/myapp' });

peerServer.on('connection', (client) => {
  console.log(`New client connected: ${client.id}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client disconnected: ${client.id}`);
});

console.log("PeerJS Server running on port 9000...");
