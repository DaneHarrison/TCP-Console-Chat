// ----------------------------------------------------------------------
// Frontend cli client for a TCP chat service with the follow functionality
//      - View list of existing chat room, their capacity and their list of users
//      - Allows client to join elligable chat rooms
//      - Create new chat rooms
//      - Send messages to chat rooms
//      - Leave a chat room
//-----------------------------------------------------------------------
const {ChatHandler} = require('./chatHandler');
const {ReqFactory} = require('./reqFactory');
const prompt = require('prompt-sync')();

const net = require('net');
const HOST = 'localhost';   //the server host location
const PORT = 8080;          //the server port location


// Attempts to establish a connection and alerts the user of its success or failure
let conn = net.createConnection(PORT, HOST);    //the socket created by connecting the the backend TCP server
let cmds = new ReqFactory();                    //generates requests for the TCP chat client
let handler;                                    //the logic for the frontend client

let name = prompt('What is your name?');        //holds the name of the current user

conn.setEncoding('utf8');
conn.on('connect', () => {
    console.log(`[SUCCESS] successfully connected to ${HOST}:${PORT}`);

    conn.write(cmds.requestChatDetails());
    setTimeout(() => {}, 2000)      //creates a delay so the two requests are not sent as one
    conn.write(cmds.login(name));
    
    handler = new ChatHandler(conn, name);
})
.on('data', (data) => {
    data = handler.processData(data)
})
.on('error', () => {})