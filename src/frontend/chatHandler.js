// ----------------------------------
// Class: Client
//
// Represents and holds the content relating to a client in a TCP chat server
// ----------------------------------
const {CLIInterpretor} = require('./cliInterpretor');
const {ReqFactory} = require('./reqFactory');
const {Client} = require('../client');

class ChatHandler {
    constructor(conn, name) {
        this._cmds = new ReqFactory();                          //creates and generates requests for the client to send to the server
        this._client = new Client(conn, name);                  //the user currently operating the client
        this._interpretor = new CLIInterpretor(this._client);   //Interpretes the CLI to send messages and read commands
    }


// ----------------------------------
// processData()
//
// Processes a response from the TCP client
//
// Parameters:
// data is a JSON object containing the cmd and content the server wanted to send to the client
// ----------------------------------
    processData(data) {
        data = JSON.parse(data);

        switch(data.cmd) {
            case 'chatDetails':
                console.log(this._formatChatDetails(data)); //when too long repeats every time a key is entere
                break;

            case 'joinChat':
                if(data.msg) { //they were able to join
                    console.log('[SUCCESS] Joining chat room now...');
                    console.log('To leave please enter !leave');
                }
                else {
                    console.log('[ERROR] could not join chat room.  Please double check the rooms name and or capacity');
                    this._client.write(this._cmds.requestChatDetails());
                }
                break;

            case 'leaveChat':
                if(data.msg) {
                    this._client.roomAssigned = null;
                    this._client.write(this._cmds.requestChatDetails());
                }
                break;

            case 'newMessage':
                this._interpretor.cutAndStopIO(); //interrupt user IO
                console.log(data.msg);
                this._interpretor.pasteAndResumeIO(); //resume user IO
                break;
                
            default:
                console.log(`[ERROR] ${data} not implemented`)
                break
        }
    }

// ----------------------------------
// _formatChatDetails()
//
// Prints the server details to the client neatly
//
// Parameters:
// data is a list of chat objects that each represent a chat room with the following parameters:
//      _name         - holds the name of the chat room
//      _MAX_CONNS    - holds the maximum number of connections
//      _numConnected - holds the current number of connections 
//      users         - holds the names of the users currently in that chat room
// ----------------------------------
    _formatChatDetails(data) {
        let msg = 'Which chat room would you like to join?\n';

        for(let i = 0; i < data.msg.length; i++) {
            msg += `${data.msg[i]._name} \t\t\t ${data.msg[i]._numConnected}/${data.msg[i]._MAX_CONNS}\n`
            
            if(data.msg[i].users) {
                msg += data.msg[i].users + '\n';
            }
        }

        if(data.msg.length <= 0) {
            msg += 'no chat rooms currently exist...\n'
        }

        msg += '\n';
        msg += 'Alternatively, please type !create to create a chatroom followed by the name you would give it\n';
        msg += 'For example \"!create newRoom\" would create a chat room called newRoom\n\n'

        return msg;
    }
}


module.exports = {
    ChatHandler
}