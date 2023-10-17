const {ConnHandler} = require('../src/backend/connHandler');
const {ResFactory} = require('../src/backend/resFactory');
const {Manager} = require('../src/backend/manager');
const {Client} = require('../src/client');


describe('Tests basic ConnHandler functionality', () => {
    let connHandler, client;

    beforeEach(() => { 
        connHandler = new ConnHandler();
        client = connHandler.handleIncoming(null);
    });


    test('Tests default connHandler constructor values', () => {
        expect(connHandler._resFactory instanceof ResFactory);
        expect(connHandler._chats instanceof Manager);
        expect(connHandler._clients instanceof Client);
    });

    test('Tests recieving a new connection', () => {
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe(null);
    
        expect(connHandler._resFactory instanceof ResFactory);
        expect(connHandler._chats instanceof Manager);
        expect(connHandler._clients instanceof Client);
        
        expect(connHandler._chats.numObjects).toBe(0);
        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._clients.objects[0].conn).toBe(null);
        expect(connHandler._clients.objects[0].roomAssigned).toBe(null);
    });

    test('Tests creating a chat room', () => {
        let cmd = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        
        connHandler._processCMD(cmd, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe(null);
    
        expect(connHandler._chats.numObjects).toBe(1);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
    
        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._clients.objects[0].conn).toBe(null);
        expect(connHandler._clients.objects[0].name).toBe(undefined);
        expect(connHandler._clients.objects[0].roomAssigned).toBe(null);
    });

    test('Tests joining a chat room', () => {
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});
        
        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(joinCMD, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe('newRoom');

        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._chats.numObjects).toBe(1);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(1);
    });

    test('Tests leaving a chat room', () => {
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});
        let leaveCMD = JSON.stringify({"cmd": "leaveChatRoom", "msg": "newRoom"}); 
        
        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(joinCMD, client);
        connHandler._processCMD(leaveCMD, client);

        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._chats.numObjects).toBe(1);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
    });

    test('Tests disconnecting from the server', () => {
        connHandler._processDisconnect(client);
        expect(client.roomAssigned).toBe(null);
        expect(connHandler._clients.numObjects).toBe(0);
        expect(connHandler._chats.numObjects).toBe(0);
    });
});


describe('Tests more complex ConnHandler functionality', () => {
    let connHandler, client;

    beforeEach(() => { 
        connHandler = new ConnHandler();
        client = connHandler.handleIncoming(null);
    });


    test('Tests creating multiple chat rooms', () => {
        let cmd = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        
        connHandler._processCMD(cmd, client);
        cmd = JSON.stringify({"cmd": "createChatRoom", "msg": "newNewRoom"});
        connHandler._processCMD(cmd, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe(null);
    
        expect(connHandler._chats.numObjects).toBe(2);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
        expect(connHandler._chats.objects[1].name).toBe('newNewRoom');
        expect(connHandler._chats.objects[1].maxConns).toBe(5);
        expect(connHandler._chats.objects[1].numConnected).toBe(0);
    
        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._clients.objects[0].conn).toBe(null);
        expect(connHandler._clients.objects[0].name).toBe(undefined);
        expect(connHandler._clients.objects[0].roomAssigned).toBe(null);
    });

    test('Tests joining a chat room when there are multiples clients/chats', () => {
        let newClient = connHandler.handleIncoming(null);
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let newCreateCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newNewRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});
    
        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(newCreateCMD, client);
        connHandler._processCMD(joinCMD, client);
        connHandler._processCMD(joinCMD, newClient);

        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe('newRoom');
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe('newRoom');
    
        expect(connHandler._chats.numObjects).toBe(2);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(2);
        expect(connHandler._chats.objects[1].name).toBe('newNewRoom');
        expect(connHandler._chats.objects[1].maxConns).toBe(5);
        expect(connHandler._chats.objects[1].numConnected).toBe(0);
    
        expect(connHandler._clients.numObjects).toBe(2);
        expect(connHandler._clients.objects[0].conn).toBe(null);
        expect(connHandler._clients.objects[0].name).toBe(undefined);
        expect(connHandler._clients.objects[0].roomAssigned).toBe('newRoom');
        expect(connHandler._clients.objects[1].conn).toBe(null);
        expect(connHandler._clients.objects[1].name).toBe(undefined);
        expect(connHandler._clients.objects[1].roomAssigned).toBe('newRoom'); 
    });
    
    test('Tests leaving a chat room when there are multiples clients/chats', () => {
        let secondClient = connHandler.handleIncoming(null);
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let newCreateCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newNewRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});
        let leaveCMD = JSON.stringify({"cmd": "leaveChatRoom", "msg": "newRoom"});
        
        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(newCreateCMD, client);
        connHandler._processCMD(joinCMD, client);
        connHandler._processCMD(joinCMD, secondClient);
        connHandler._processCMD(leaveCMD, client);
        expect(connHandler._clients.numObjects).toBe(2);
        expect(connHandler._chats.numObjects).toBe(2);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(1);
        expect(connHandler._chats.objects[1].name).toBe('newNewRoom');
        expect(connHandler._chats.objects[1].maxConns).toBe(5);
        expect(connHandler._chats.objects[1].numConnected).toBe(0);

        connHandler._processCMD(leaveCMD, secondClient);
        expect(connHandler._clients.numObjects).toBe(2);
        expect(connHandler._chats.numObjects).toBe(2);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
        expect(connHandler._chats.objects[1].name).toBe('newNewRoom');
        expect(connHandler._chats.objects[1].maxConns).toBe(5);
        expect(connHandler._chats.objects[1].numConnected).toBe(0);
    });
        
    test('Tests disconnecting from the server when there are multiple clients/chats', () => {
        let secondClient = connHandler.handleIncoming(null);
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let newCreateCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newNewRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});
        let newJoinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newNewRoom"});
        
        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(joinCMD, client);
        connHandler._processCMD(newCreateCMD, secondClient);
        connHandler._processCMD(newJoinCMD, secondClient);

        connHandler._processDisconnect(client);
        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._chats.numObjects).toBe(2);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
        expect(connHandler._chats.objects[1].name).toBe('newNewRoom');
        expect(connHandler._chats.objects[1].maxConns).toBe(5);
        expect(connHandler._chats.objects[1].numConnected).toBe(1);
    
        connHandler._processDisconnect(secondClient);
        expect(connHandler._clients.numObjects).toBe(0);
        expect(connHandler._chats.numObjects).toBe(2);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
        expect(connHandler._chats.objects[1].name).toBe('newNewRoom');
        expect(connHandler._chats.objects[1].maxConns).toBe(5);
        expect(connHandler._chats.objects[1].numConnected).toBe(0);
    });
});


describe('Tests Edge case ConnHandler functionality', () => {
    let connHandler, client;

    beforeEach(() => { 
        connHandler = new ConnHandler();
        client = connHandler.handleIncoming(null);
    });


    test('Tests joining a room the client is already inside that room', () => {
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});
        
        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(joinCMD, client);
        connHandler._processCMD(joinCMD, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe('newRoom');
        
        expect(connHandler._chats.numObjects).toBe(1);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(1);
        
        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._clients.objects[0].conn).toBe(null);
        expect(connHandler._clients.objects[0].name).toBe(undefined);
        expect(connHandler._clients.objects[0].roomAssigned).toBe('newRoom');
    });

    test('Tests joining a room when the client is already in another room', () => {
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let newCreateCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newNewRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});
        let newJoinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newNewRoom"});

        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(newCreateCMD, client);
        connHandler._processCMD(joinCMD, client);
        connHandler._processCMD(newJoinCMD, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe('newNewRoom');
        expect(connHandler._clients.numObjects).toBe(1);

        expect(connHandler._chats.numObjects).toBe(2);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
        expect(connHandler._chats.objects[1].name).toBe('newNewRoom');
        expect(connHandler._chats.objects[1].maxConns).toBe(5);
        expect(connHandler._chats.objects[1].numConnected).toBe(1);
    });

    test('Tests leaving a chat room when the client is not inside a chat room', () => {
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let leaveCMD = JSON.stringify({"cmd": "leaveChatRoom", "msg": "newRoom"});    

        connHandler._processCMD(createCMD, client);
        connHandler._processCMD(leaveCMD, client);
        expect(client.roomAssigned).toBe(null);
        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._chats.numObjects).toBe(1);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);
    });
});


describe('Tests Invalid ConnHandler functionality', () => {
    let connHandler, client;

    beforeEach(() => { 
        connHandler = new ConnHandler();
        client = connHandler.handleIncoming(null);
    });


    test('Tests creating chat rooms with the same name', () => {
        let cmd = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});

        connHandler._processCMD(cmd, client);
        connHandler._processCMD(cmd, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe(null);

        expect(connHandler._chats.numObjects).toBe(1);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(0);

        expect(connHandler._clients.numObjects).toBe(1);
        expect(connHandler._clients.objects[0].conn).toBe(null);
        expect(connHandler._clients.objects[0].name).toBe(undefined);
        expect(connHandler._clients.objects[0].roomAssigned).toBe(null);
    });

    test('Tests joining a chat room that does not yet exist', () => {
        let cmd = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});

        connHandler._processCMD(cmd, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe(null);
        expect(connHandler._clients.numObjects).toBe(1);
 
        expect(connHandler._chats.numObjects).toBe(0);
    });

    test('Tests trying to join a chat room that is already full', () => {
        let createCMD = JSON.stringify({"cmd": "createChatRoom", "msg": "newRoom"});
        let joinCMD = JSON.stringify({"cmd": "joinChatRoom", "msg": "newRoom"});

        connHandler._processCMD(createCMD, client);
        connHandler._chats.objects[0].numConnected = 5;
        connHandler._processCMD(joinCMD, client);
        expect(client.conn).toBe(null);
        expect(client.name).toBe(undefined)
        expect(client.roomAssigned).toBe(null);
        expect(connHandler._clients.numObjects).toBe(1);

        expect(connHandler._chats.numObjects).toBe(1);
        expect(connHandler._chats.objects[0].name).toBe('newRoom');
        expect(connHandler._chats.objects[0].maxConns).toBe(5);
        expect(connHandler._chats.objects[0].numConnected).toBe(5);
    });
});