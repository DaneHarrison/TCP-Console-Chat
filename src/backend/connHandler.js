// ----------------------------------
// Class: ConnHandler
//
// Serves as the server logic for the backend of a TCP chatroom server
// ----------------------------------
const {ChatManager} = require('./chatManager');
const {ResFactory} = require('./resFactory');
const {Manager} = require('./manager');
const {Client} = require('../client');

class ConnHandler {
    constructor() {
        this._resFactory = new ResFactory();    //creates responses for client requests
        this._chats = new ChatManager();        //manages a list of user-generated chatrooms
        this._clients = new Manager();          //manages a list of all connected users
    }


// ----------------------------------
// handleIncoming()
// Handles incoming connections by setting them up to interact properly with the server
//
// Parameters:
// conn is the TCP socket that was just connected and needs to be set up
//
// Returns:
// The client object that was just established
// ----------------------------------
    handleIncoming(conn) {
        let client;     //the current client that is attempting to connect
        
        client = new Client(conn);
        this._clients.add(client);

        //creates event listeners for the incoming connection
        if(conn) {
            conn.setEncoding('utf8');
            conn.on('data', (data) => {
                this._processCMD(data, client);
            })
            .on('close', (client) => {
                this._processDisconnect(client);
            });
        }

        return client;
    }

// ----------------------------------
// _processCMD()
// 
// Process client requests or indicates failure if it does not recognize it
//
// Parameters:
// data is a JSON object with fields cmd as the request type and msg as the request parameters/content
// client is a client object that refers to the client currently making the request
// ----------------------------------
    _processCMD(data, client) {
        console.log('[SUCCESS] command recieved:');
        console.log(data);
        console.log();

        data = JSON.parse(data);
        switch(data.cmd) {
            case 'login':
                client.name = data.msg;
                break;

            case 'requestChatDetails':
                client.write(this._resFactory.genChatDetails(this._chats.objects, this._clients.objects));
                break;

            case 'joinChatRoom':
                client.write(this._resFactory.tryJoiningChat(this._processJoinChatRoom(client, data.msg)));
                break;

            case 'sendMsg':
                this._processSendMsgs(client, data.msg);
                break;

            case 'leaveChatRoom':
                client.write(this._resFactory.tryLeavingChat(this._processLeaveChatRoom(client)));
                break;

            case 'createChatRoom':   
                this._chats.add(data.msg.replace('!create ', ''));
                client.write(this._resFactory.genChatDetails(this._chats.objects, this._clients.objects));
                break;

            default:
                console.log('[ERROR] this is not implemented yet...')
                console.log(data);
                break;
        }
    }

// ----------------------------------
// _processJoinChatRoom()
//
// Houses the logic for when a new user attempts to join a chat room
//
// Parameters:
// client is a client object that refers to the client that is trying to join the chat room
// roomName refers to a string that represents the name of the chat room the user would like to join
//
// Returns:
// the name of the room if the user was able to join the room or null if they werent
// ----------------------------------
    _processJoinChatRoom(client, roomName) {
        let userRequestedChat = this._chats.objects.filter(room => room.name == roomName); //the chat room the client would like to connect to
        
        if(userRequestedChat.length > 0) {  //checks if the room exists
            userRequestedChat = userRequestedChat[0];

            //either the user is in the room and they want to reconnect or we need to check if sufficient space is available
            if(userRequestedChat.sufficientSpace || userRequestedChat.name == client.roomAssigned) {
                if(client.roomAssigned) {
                    this._decreaseRoomCount(client);
                }
                
                userRequestedChat.numConnected += 1; 
                client.roomAssigned = userRequestedChat.name
            }
            else {
                userRequestedChat = null;
            }
        }
        else {                              //else no room exists and we could not remove the client
            userRequestedChat = null;
        }

        return userRequestedChat;
    }

// ----------------------------------
// _processLeaveChatRoom()
//
// Houses the logic for when a user attempts to leave a chat room
//
// Parameters:
// client is a client object that refers to the client that is trying to leave
//
// Returns:
// left is a boolean that indicates whether the client left a room or not
// ----------------------------------
    _processLeaveChatRoom(client) {
        let left = false;   //if the client was able to leave

        if(client.roomAssigned) { //if the current user is in a room
            this._decreaseRoomCount(client);
            client.roomAssigned = null;
            left = true;
        }

        return left;
    }

// ----------------------------------
// _processSendMsgs()
//
// Houses the logic for forwarding messages to other clients
//
// Parameters:
// client is a client object that refers to the client currently connected that sent the message
// msg refers to the msg recieved from the client to be forwarded - is prepended with the user's name
// ----------------------------------
    _processSendMsgs(client, msg) { 
        //chatRoomClients refers to a list of other clients in the current chat room (not including the current client)
        let chatRoomClients = this._clients.objects.filter(clients => clients.roomAssigned == client.roomAssigned && clients != client);
        
        for(let i = 0; i < chatRoomClients.length; i++) { //forward the message to each user
            chatRoomClients[i].write(this._resFactory.forwardMsg(msg));
        }
    }

// ----------------------------------
// _processDisconnect()
//
// Processes client disconnects
//
// Parameters:
// client is a client object that represents the client who would like to disconnect
// ----------------------------------
    _processDisconnect(client) {
        this._clients.remove(client);
        if(client.roomAssigned) {
            this._decreaseRoomCount(client)
        }
    }

// ----------------------------------
// _decreaseRoomCount()
//
// Decreases the room count whenever a user leaves a chat - whether that be because you disconnect, join a new chat room, leave etc...
//
// Parameters:
// Client represents a client object of the client that would like to disconnect
// ----------------------------------
    _decreaseRoomCount(client) {
        let usersRoom = this._chats.objects.filter(room => room.name == client.roomAssigned);
        
        if(client.roomAssigned && usersRoom.length > 0) {  //if the current chat room could be found
            usersRoom = usersRoom[0];
            usersRoom.numConnected -= 1;
        }
    }
}


module.exports = {
    ConnHandler
}