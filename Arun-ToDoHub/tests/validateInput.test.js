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

describe('validateInput function', () => {

        
    
    it('should return false if input is empty', () => {
        // Arrange
        const inputValue = '';
        const existingTasks = [];

        // Act
        const result = validateInput(inputValue, existingTasks);

        // Assert
        expect(result).toBe(false);
        
    });

    it('should return false  if input is only whitespace', () => {
        // Arrange
        const inputValue = '   ';
        const existingTasks = [];

        // Act
        const result = validateInput(inputValue, existingTasks);

        // Assert
        expect(result).toBe(false);
        
    });

    // //TODO
    // it('should return false and show notification if task already exists', () => {

    //     const inputValue = 'Existing Task';
    //     const existingTasks = [{ text: 'Existing Task' }];

    //     // Act
    //     const result = validateInput(inputValue, existingTasks);

    //     // Assert
    //     expect(result).toBe(false);
        
    // });

    it('should return true if input is valid and unique', () => {
        // Arrange
        const inputValue = 'Unique Task';
        const existingTasks = [{ text: 'Other Task' }];

        // Act
        const result = validateInput(inputValue, existingTasks);

        // Assert
        expect(result).toBe(true);
        
    });

});