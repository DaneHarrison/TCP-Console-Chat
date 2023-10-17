const {Chat} = require('../src/backend/chat');


describe('Tests basic Chat functionality', () => {

    test('Tests default chat constructor values', () => {
        let chat = new Chat();
    
        expect(chat.name).toBe('undefined');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(0);
        expect(chat.sufficientSpace).toBe(true);
    });

    test('Tests setting the name', () => {
        let chat = new Chat('name');
        
        expect(chat.name).toBe('name');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(0);
        expect(chat.sufficientSpace).toBe(true);
    });

    test('Tests adjusting the number of connections', () => {
        let chat = new Chat();
    
        expect(chat.name).toBe('undefined');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(0);
        expect(chat.sufficientSpace).toBe(true);

        chat.numConnected++;
        expect(chat.name).toBe('undefined');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(1);
        expect(chat.sufficientSpace).toBe(true);
        
        chat.numConnected += 3;
        expect(chat.name).toBe('undefined');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(4);
        expect(chat.sufficientSpace).toBe(true);
        
        chat.numConnected--;
        expect(chat.name).toBe('undefined');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(3);
        expect(chat.sufficientSpace).toBe(true);

        chat.numConnected -= 2;
        expect(chat.name).toBe('undefined');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(1);
        expect(chat.sufficientSpace).toBe(true);
    });
});


describe('Edge case Chat functionality', () => {
    
    test('Tests setting the name', () => {
        let chat = new Chat(null);
        
        expect(chat.name).toBe('null');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(0);
        expect(chat.sufficientSpace).toBe(true);
    });
    
    test('Tests setting the number of connections too the cut off values', () => {
        let chat = new Chat('chat');
        
        chat.numConnected += 5;
        expect(chat.name).toBe('chat');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(5);
        expect(chat.sufficientSpace).toBe(false);
        
        chat.numConnected -= 5;
        expect(chat.name).toBe('chat');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(0);
        expect(chat.sufficientSpace).toBe(true);
    });
});

describe('Invalid basic chat functionality', () => {
    let chat;

    beforeEach(() => { chat = new Chat('chat'); });


    test('Tests setting the number of connections too high', () => {
        chat.numConnected++;
        expect(chat.name).toBe('chat');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(1);
        expect(chat.sufficientSpace).toBe(true);

        chat.numConnected += 5;
        expect(chat.name).toBe('chat');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(1);
        expect(chat.sufficientSpace).toBe(true);
    });

    test('Tests setting the number of connections too low', () => {
        chat.numConnected++;
        expect(chat.name).toBe('chat');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(1);
        expect(chat.sufficientSpace).toBe(true);

        chat.numConnected -= 5;
        expect(chat.name).toBe('chat');
        expect(chat.maxConns).toBe(5);
        expect(chat.numConnected).toBe(1);
        expect(chat.sufficientSpace).toBe(true);
    });
});