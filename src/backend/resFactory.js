// ----------------------------------
// Class: ResFactory
//
// Creates responses for chatroom responses for a chatroom server
// ----------------------------------
class ResFactory {
// ----------------------------------
// genChatDetails()
//
// Generates a details response for the current chat rooms on the server
// 
// Parameters:
// chats is an object that represents a chat room with the following parameters:
//      _name         - holds the name of the chat room
//      _MAX_CONNS    - holds the maximum number of connections
//      _numConnected - holds the current number of connections 
//      users         - holds the names of the users currently in that chat room
//
// Returns: 
// a details response for the current chat rooms on the server
// ----------------------------------
    genChatDetails(chats, clients) {
        let sameRoomClients;
        let clientNames;

        if(clients && chats) { //if we have chats and clients check if any are in them
            for(let i = 0; i < chats.length; i++) {
                sameRoomClients = clients.filter(client => client._roomAssigned == chats[i]._name);
                clientNames = ''

                for(let j = 0; j < sameRoomClients.length; j++) {   //list all clients, seperated by newlines
                    clientNames += sameRoomClients[j]._name + '\n';
                }

                chats[i].users = clientNames;   //save then go on to the next chat roon
            }
        }

        return JSON.stringify({
            'cmd': 'chatDetails',
            'msg': chats
        });
    }

// ----------------------------------
// tryJoiningChat()
//
// Creates a response for trying to connect to a chatroom
//
// Parameters:
// chatRoom is a string that refers to the name of the room if the user was able to join the room or null if they werent
//
// Returns: 
// a response for trying to connect to a chatroom
// ----------------------------------
    tryJoiningChat(chatRoom) {
        return JSON.stringify({
            'cmd': 'joinChat',
            'msg': chatRoom
        });
    }

// ----------------------------------
// tryLeavingChat()
//
// Creates a responses for trying to leave a chatroom
//
// Parameters:
// valid represents a boolean of whether or not the client was able to leave the room (if they were even in one)
//
// Returns: 
// a response for trying to leave a chat room
// ----------------------------------
    tryLeavingChat(valid) {
        return JSON.stringify({
            'cmd': 'leaveChat',
            'msg': valid
        });
    }

// ----------------------------------
// forwardMsg()
//
// Creates a forward message response  
//
// Parameters:
// data corresponds to the message currently being forwarded to other chat room members, prepended by the name of the sender
//
// Returns: a forward message response
// ----------------------------------
    forwardMsg(data) {
        return JSON.stringify({
            'cmd': 'newMessage',
            'msg': data
        })
    }
}


module.exports = {
    ResFactory
}