const {ChatManager} = require('../src/backend/chatManager');


describe('Tests basic ChatManager functionality', () => {
    let chatManager;

    beforeEach(() => { chatManager = new ChatManager(); });


    test('Tests default chatManager constructor values', () => {
        expect(Array.isArray(chatManager.objects)).toBe(true);
        expect(chatManager.numObjects).toBe(0);
    });

    test('Tests adding new chat rooms', () => {
        chatManager.add('chat');
        expect(chatManager.objects[0]._name).toBe('chat');
        expect(chatManager.objects[0]._MAX_CONNS).toBe(5);
        expect(chatManager.objects[0].numConnected).toBe(0);
        expect(chatManager.numObjects).toBe(1);

        chatManager.add('otherChat');
        expect(chatManager.objects[0]._name).toBe('chat');
        expect(chatManager.objects[0]._MAX_CONNS).toBe(5);
        expect(chatManager.objects[0].numConnected).toBe(0);
        expect(chatManager.objects[1]._name).toBe('otherChat');
        expect(chatManager.objects[1]._MAX_CONNS).toBe(5);
        expect(chatManager.objects[1].numConnected).toBe(0);
        expect(chatManager.numObjects).toBe(2);
    });
});


describe('Tests invalid ChatManager functionality', () => {
    let chatManager;

    beforeEach(() => { chatManager = new ChatManager(); });


    test('Tests adding a second chat with the same name', () => {
        chatManager.add('chat');
        expect(chatManager.objects[0]._name).toBe('chat');
        expect(chatManager.objects[0]._MAX_CONNS).toBe(5);
        expect(chatManager.objects[0].numConnected).toBe(0);
        expect(chatManager.numObjects).toBe(1);

        chatManager.add('chat');
        expect(chatManager.objects[0]._name).toBe('chat');
        expect(chatManager.objects[0]._MAX_CONNS).toBe(5);
        expect(chatManager.objects[0].numConnected).toBe(0);
        expect(chatManager.numObjects).toBe(1);
    });
});