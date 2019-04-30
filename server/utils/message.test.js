const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage' , () => {
    
    it('should generate correct message object', () => {
        
        const from = 'Jen';
        const text = 'Good Times';
        const message = generateMessage(from, text);
        
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from, 
            text
        });
        
    });
    
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'Admin';
        const latitude = '-73.9624571';
        const longitude = '40.6510634';
        
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`
        
        const locationMessage = generateLocationMessage(from, latitude, longitude);
        
        expect(typeof locationMessage.createdAt).toBe('number');
        expect(locationMessage).toMatchObject({
            from,
            url
        });
        
    });
});
