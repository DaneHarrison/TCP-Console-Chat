// ----------------------------------------------------------------------
// Backend for a TCP chat service with the follow functionality
//      - Give clients list of existing chat rooms as well as their capacity and whos in it
//      - Allows client to join elligable chat rooms
//      - Create new chat rooms
//      - Send messages that get sent to all other client in a chat room
//      - Leave a chat room
//-----------------------------------------------------------------------
const net = require('net');
const {ConnHandler} = require('./connHandler')

const HOST = 'localhost';
const PORT = 8080;

//setup the server
let handler = new ConnHandler();
let server = net.createServer().listen({
    host: HOST,
    port: PORT
});

console.log(`Server llistening @ ${HOST}:${PORT}`);

//setup listener
server.on('connection', (conn) => { handler.handleIncoming(conn); });