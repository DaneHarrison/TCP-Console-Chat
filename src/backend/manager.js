// ----------------------------------
// Class: Manager
//
// Holds and manages a list of objects (basically an array wrapper)
// ----------------------------------
class Manager {
    constructor() {
        this._managedObjs = []; //an array of the objects we want to manipulate
    }

    add(obj) {
        this._managedObjs.push(obj);
    }

    remove(obj) {
        let posi = this._managedObjs.indexOf(obj);  //holds the position of the object we'd like to remove

        this._managedObjs.splice(posi, 1);
    }

    get numObjects() {
        return this._managedObjs.length;
    }


    get objects() {
        return this._managedObjs;
    }
}


module.exports = {
    Manager
}