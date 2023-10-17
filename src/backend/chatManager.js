// ----------------------------------
// Class: ChatManager
//
// Manages a list of chat rooms
// ----------------------------------
const {Manager} = require('./manager');
const {Chat} = require('./chat');

class ChatManager extends Manager {    
// ----------------------------------
// add()
// 
// adds a chat to the list of chats 
//
// Parameters:
// newChatName is the name of the chatroom we'd like to create
// ----------------------------------
    add(newChatName) {
        let currChats = super.objects.filter(chat => chat.name == newChatName); //holds any chat rooms that hold the same name
        
        if(currChats.length == 0) {     //if no chat rooms by that name exist then we can create one
            super.add(new Chat(newChatName))
        }
    }
}


module.exports = {
    ChatManager
}