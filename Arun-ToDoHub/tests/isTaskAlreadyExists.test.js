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

        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

describe('isTaskAlreadyExists Function', () => {

    it('should return false when there are no tasks', () => {

        localStorage.setItem('tasks', JSON.stringify([]));

        expect(isTaskAlreadyExists('New Task', -1)).toBeFalsy();

      });
    
      it('should return false when task does not exist', () => {

        const tasks = [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        expect(isTaskAlreadyExists('New Task', -1)).toBeFalsy();

      });
    
      it('should return true when task already exists', () => {

        const tasks = [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        expect(isTaskAlreadyExists('Task 1', -1)).toBeTruthy();

      });

      it('should return true when task already exists but in different case', () => {
        
        const tasks = [
          { id: 1, text: 'tAsK 1' },
          { id: 2, text: 'Task 2' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        expect(isTaskAlreadyExists('Task 1', -1)).toBeTruthy();

      });

      it('should return false when task exists but has the same id', () => {
    
        const tasks = [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' }
        ];

        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        expect(isTaskAlreadyExists('Task 1', 1)).toBeFalsy();

      });

      it('should return false when localStorage does not contain the "tasks" key', () => {
        
        localStorage.removeItem('tasks');
    
        expect(isTaskAlreadyExists('Task 1', -1)).toBeFalsy();
    });

    // it('should return false and log an error if JSON parsing fails', () => {

    //   jest.spyOn(localStorage, 'getItem').mockReturnValue('invalid JSON string');

    //   // Optionally, mock console.error to verify it was called
    //   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    //   expect(isTaskAlreadyExists('Task 1', -1)).toBeFalsy();
    //   expect(consoleErrorSpy).toHaveBeenCalled();

    //   consoleErrorSpy.mockRestore(); 
    // });
});