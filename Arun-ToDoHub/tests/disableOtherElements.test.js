const fs = require('fs');
const path = require('path');




beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        
        document.body.innerHTML = html;

        require('../script.js');

        const mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => (store[key] = value.toString()),
                clear: () => (store = {}),
                removeItem: (key) => delete store[key],
            };
        })();
        Object.defineProperty(window, 'localStorage', {value: mockLocalStorage,});
        
        // Clear any previous tasks
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

describe('DisableOtherElements Function', () => {

    it('should disable all elements when passed true', () => {

        const inputBox = document.getElementById('input');
        const addButton = document.getElementById('add');
        const clearButton = document.getElementById('clear');
        const allEditButtons = document.querySelectorAll('.editdel button');
        const radioButtons = document.querySelectorAll('input[name="taskFilter"]');

        disableOtherElements(true);

        expect(inputBox.disabled).toBe(true);
        expect(addButton.disabled).toBe(true);
        expect(clearButton.disabled).toBe(true);

        allEditButtons.forEach(button => {
            expect(button.disabled).toBe(true);
        });

        radioButtons.forEach(radio => {
            expect(radio.disabled).toBe(true);
        });
    });

    it('should enable all elements when passed false', () => {

        const inputBox = document.getElementById('input');
        const addButton = document.getElementById('add');
        const clearButton = document.getElementById('clear');
        const allEditButtons = document.querySelectorAll('.editdel button');
        const radioButtons = document.querySelectorAll('input[name="taskFilter"]');

        disableOtherElements(false);

        expect(inputBox.disabled).toBe(false);
        expect(addButton.disabled).toBe(false);
        expect(clearButton.disabled).toBe(false);

        allEditButtons.forEach(button => {
            expect(button.disabled).toBe(false);
        });

        radioButtons.forEach(radio => {
            expect(radio.disabled).toBe(false);
        });
    });

});