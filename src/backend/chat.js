// ----------------------------------
// Class: Chat
//
// Represents and holds the content relating to a chatroom
// ----------------------------------
class Chat {
    constructor(name) {
        this._name = String(name);  //the name of the chat room 
        this._MAX_CONNS = 5;        //the maximum number of connections
        this._numConnected = 0;     //the current number of connections
    }

    
    get name() {
        return this._name;
    }

    get maxConns() {
        return this._MAX_CONNS;
    }

    get numConnected() {
        return this._numConnected;
    }

    get sufficientSpace() {
        return this._numConnected < this._MAX_CONNS;
    }

    set numConnected(newNumConns) {
        if(Number.isInteger(newNumConns) && newNumConns >= 0 && newNumConns <= this._MAX_CONNS) { //ensures we have 0 - 5 connections
            this._numConnected = newNumConns;
        }
    }
}


module.exports = {
    Chat
}