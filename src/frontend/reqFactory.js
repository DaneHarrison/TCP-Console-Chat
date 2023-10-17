// ----------------------------------
// Class: ReqFactory
//
// Creates responses for chatroom requests for a chatroom server
// ----------------------------------
class ReqFactory {
// ----------------------------------
// requestChatDetails()
//
// Creates a request to view the current chatroom details
//
// Returns:
// a request to view the current chatroom details
// ----------------------------------
    requestChatDetails() {
        return JSON.stringify({
            'cmd': 'requestChatDetails'
        });
    }

// ----------------------------------
// joinChatRoom()
//
// Creates a request to try and join a chatroom
//
// Parameters:
// userRequestChat is a string representing the name of the chatroom the user would like to try and join
//
// Returns:
// a request to try and join a chatroom
// ----------------------------------
    joinChatRoom(userRequestChat) {
        return JSON.stringify({
            'cmd': 'joinChatRoom',
            'msg': userRequestChat
        })
    }

// ----------------------------------
// leaveChatRoom()
//
// Creates a request to try and leave a chatroom
//
// Returns
//
// ----------------------------------
    leaveChatRoom() {
        return JSON.stringify({
            'cmd': 'leaveChatRoom'
        })
    }

// ----------------------------------
// sendMsg()
//
// Sends a message to the server
//
// Parameters:
// clientName is a string of the user's name
// msg is a string corresponding to the message the user would like to send
//
// Returns:
// a request to send a message to the server
// ----------------------------------
    sendMsg(clientName, msg) {
        return JSON.stringify({
            'cmd': 'sendMsg', 
            'msg': clientName + ':' + msg
        })
    }

// ----------------------------------
// createChat()
//
// Creates a request to create a chatroom
//
// Parameters:
// name is a string representing the name of the chatroom to create
//
// Returns:
// a request to create a chatroom
// ----------------------------------
    createChat(name) {
        return JSON.stringify({
            'cmd': 'createChatRoom',
            'msg': name
        })
    }

// ----------------------------------
// login()
//
// Creates a request to create a chatroom
//
// Parameters:
// name is a string representing the name of the chatroom to create
//
// Returns:
// a request to create a chatroom
// ----------------------------------
    login(name) {
        return JSON.stringify({
            'cmd': 'login',
            'msg': name
        })
    }
}


module.exports = {
    ReqFactory
}