const fs = require('fs');
const path = require('path');


describe('showNotification', () => {
    
    let notification;

    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;
        require('../script.js');

        notification = document.querySelector('.notification');

        jest.useFakeTimers();
    });

    afterEach(() => {
        
        jest.useRealTimers();
    });

    it('should display the notification with the correct text and color', () => {
        const text = 'Test notification';
        const color = 'red';
        
        showNotification(text, color);
        
        expect(notification.textContent).toBe(text);
        expect(notification.style.backgroundColor).toBe(color);
        expect(notification.style.visibility).toBe('visible');
    });

    it('should not hide the notification before the timeout', () => {
        const text = 'Test notification';
        const color = 'red';
        
        showNotification(text, color);
        
        jest.advanceTimersByTime(1999);
        
        expect(notification.textContent).toBe(text);
        expect(notification.style.backgroundColor).toBe(color);
        expect(notification.style.visibility).toBe('visible');
    });

    it('should hide the notification after the timeout', () => {
        const text = 'Test notification';
        const color = 'red';
        
        showNotification(text, color);
        
        jest.advanceTimersByTime(2000);
        
        expect(notification.textContent).toBe('');
        expect(notification.style.visibility).toBe('hidden');
    });

    it('should not throw an error if no notification element is present', () => {
        document.body.innerHTML = '';
        
        expect(() => showNotification('No Element Test', 'green')).not.toThrow();
    });

    it('should display the notification with default text and color when no parameters are provided', () => {
        showNotification();
        
        expect(notification.textContent).toBe('Notification');
        expect(notification.style.backgroundColor).toBe('blue');
        expect(notification.style.visibility).toBe('visible');
    });

    it('should display the notification with default text when color is not provided', () => {
        showNotification('Custom message');
        
        expect(notification.textContent).toBe('Custom message');
        expect(notification.style.backgroundColor).toBe('blue');
        expect(notification.style.visibility).toBe('visible');
    });

    it('should display the notification with default color when text is not provided', () => {
        showNotification(undefined, 'red');
        
        expect(notification.textContent).toBe('Notification');
        expect(notification.style.backgroundColor).toBe('red');
        expect(notification.style.visibility).toBe('visible');
    });

});
