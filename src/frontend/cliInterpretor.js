// ----------------------------------
// Class: CLIInterpretor
//
// Interpretes the command line interface the client sees send messages and read commands a client in a TCP chat server
// Its commands are:
//      !details              - grabs all chat details'
//      !create [chatName]    - creates a chat room
//      !join   [chatName]    - joins a chat room
//      !leave                - leaves the current chat room
//      !disconnect           - call before terminating the program to disconnect from the server
// ----------------------------------
const readline = require('node:readline');
const {ReqFactory} = require('./reqFactory')

class CLIInterpretor {
    constructor(client) {
        this._saved = null;             //saves the current line when printing to the console
        this._client = client;          //the user using the CLIInteerpretor
        this._cmds = new ReqFactory();  //creates and generates requests for a client to send to a TCP server
        
        this._interpretor = readline.createInterface({      //Makes the command line interface writable and reads its input
            input: process.stdin,
            output: process.stdout
        }).on('line', (input) => { this.processCLI(input) });
    }


    get interpretor() {
        return this._interpretor;
    }

    get currLine() {
        return this._interpretor.line
    }
    
// ----------------------------------
// processCLI()
//
// Processes input from the client on the command line interface once the enter button is pressed
//
// Parameters:
// input is a string corresponding to whatever the user entered
// ----------------------------------
    processCLI(input) {
        if(input[0] == '!') {   //! means that the user is trying to enter a command
            this._processCMD(input);
        }
        else {
            this._processMsg(input);
        }
    }

// ----------------------------------
// cutAndStopIO()
//
// Saves the user entered input from the command line interface, clears it and pauses it until its resumed once again
// ----------------------------------
    cutAndStopIO() {
        this._saved = this._interpretor.line;
        this._interpretor.pause()
        this._interpretor.write(undefined, { ctrl: true, name: 'u' });   //clear the current line
    }

// ----------------------------------
// pasteAndResumeIO()
//
// Pastes the saved user entered input back to the command line interface and resumes its processing
// ----------------------------------
    pasteAndResumeIO() {
        if(this._saved) {   //if there was anything of value saved, add it back to the command line interface
            this._interpretor.write(this._saved);
            this._saved = null;
        }
        
        this._interpretor.resume()
    }

// ----------------------------------
// displayHelp()
//
// Displays information containing to all currently available and implemented commands
// ----------------------------------
    displayHelp() {
        console.log('These are the currently implemented commands:');
        console.log('   !details              - grabs all chat details')
        console.log('   !create [chatName]    - creates a chat room');
        console.log('   !join   [chatName]    - joins a chat room');
        console.log('   !leave                - leaves the current chat room');
        console.log('   !disconnect           - call before terminating the program to disconnect from the server')
    }

// ----------------------------------
// _processCMD()
//
// Processes a command entered by the user on the command line interface
//
// Parameters:
// input is the user entered message that corresponds to a command
// ----------------------------------
    _processCMD(input) {
        let cmd = input.split(' ')[0];              //the command the user would like to use
        let param = input.replace(cmd + ' ', '');   //the parameters the user entered for the command

        switch(cmd) {
            case '!create':
                this._client.write(this._cmds.createChat(param));
                break;

            case '!join':
                this._client.write(this._cmds.joinChatRoom(param));
                break;

            case '!leave':
                this._client.write(this._cmds.leaveChatRoom());
                break;

            case '!details':
                this._client.write(this._cmds.requestChatDetails());
                break;

            case '!help':
                this.displayHelp();
                break;

            case '!disconnect':
                this._client.write(this._cmds.leaveChatRoom());
                this._client.conn.end(() => { 
                    console.log('Type CTLR-C to terminate the program'); 
                    console.log('Also, Goodbye!');
                })
                break;

            default:
                console.log('[ERROR] command unrecognized please use !help for for more information');
        }
    }

// ----------------------------------
// _processMsg()
//
// Processes user entered messages from the command line interface
//
// Parameters:
// input is the user entered message
// ----------------------------------
    _processMsg(input) {
        this._client.write(this._cmds.sendMsg(this._client.name, input));
    }

// ----------------------------------
// stop()
//
// stops reading/allowing the user to enter input on the command line interface
// ----------------------------------
    stop() {
        this._interpretor.close();
    }
}


module.exports = {
    CLIInterpretor
}