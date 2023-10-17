// ----------------------------------
// Class: Client
//
// Represents and holds the content relating to a client in a TCP chat server
// ----------------------------------
class Client {
    constructor(conn, name) {
        this._conn = conn;              //the socket that can reach the client
        this._name = name;              //the name of the client
        this._roomAssigned = null;      //the name of the room the client is inside
    }


// ----------------------------------
// write()
//
// writes data to the client's socket or does nothing if no socket is initalized
//
// Parameters:
// data is the string of data we'd like to send over the socket
// ----------------------------------
    write(data) {
        if(!this.conn) {
            return;
        }

        this._conn.write(data);
    }

    leave() {
        this.roomAssigned = null;
    }

    get conn() {
        return this._conn;
    }

    set name(newName) {
        this._name = newName;
        
        if(newName == '') { //if no name is set use undefined
            this._name = 'undefined';
        }
    }

    get name() {
        return this._name;
    }

    get roomAssigned() {
        return this._roomAssigned;
    }

    set roomAssigned(newRoomStatus) {
        this._roomAssigned = newRoomStatus;
    }
}


module.exports = {
    Client
}