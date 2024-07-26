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

describe('Toggle task controls function', () => {


    it('should hide the edit element and show the save element', () => {
        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        toggleTaskControls('1', 'edit', 'save');

        const fromDiv = document.querySelector('#edit-1');
        const toDiv = document.querySelector('#save-1');
        expect(fromDiv.style.display).toBe('none');
        expect(toDiv.style.display).toBe('flex');
    });

    it('should hide the save element and show the edit element', () => {
        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        toggleTaskControls('1', 'save', 'edit');

        const fromDiv = document.querySelector('#save-1');
        const toDiv = document.querySelector('#edit-1');
        expect(fromDiv.style.display).toBe('none');
        expect(toDiv.style.display).toBe('flex');
    });

    it('should toggle visibility from hidden to visible for both elements', () => {
        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');
    
        renderTasks();
    
        // Set both elements to hidden
        const fromDiv = document.querySelector('#edit-1');
        fromDiv.style.display = 'none';
        const toDiv = document.querySelector('#save-1');
        toDiv.style.display = 'none';
    
        toggleTaskControls('1', 'edit', 'save');
    
        expect(fromDiv.style.display).toBe('none');
        expect(toDiv.style.display).toBe('flex');
    });

    it('should handle cases where both elements are initially visible', () => {
        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');
    
        renderTasks();
    
        // Set both elements to visible
        const fromDiv = document.querySelector('#edit-1');
        fromDiv.style.display = 'flex';
        const toDiv = document.querySelector('#save-1');
        toDiv.style.display = 'flex';
    
        toggleTaskControls('1', 'edit', 'save');
    
        expect(fromDiv.style.display).toBe('none');
        expect(toDiv.style.display).toBe('flex');
    });
    
    


});
