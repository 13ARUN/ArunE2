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

describe('ToggleEdit Function', () => {

    it('should enable editing mode for a task', () => {

        const sampleTasks = [
            { id: '1', text: 'Editable Task', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        toggleEdit('1');
    

        const taskInput = document.querySelector('#onetask-1');
        expect(taskInput).toBeTruthy();
        expect(taskInput.hasAttribute('readonly')).toBe(false);
        expect(taskInput.readOnly).toBe(false);
        expect(taskInput.style.borderBottom).toBe('2px solid #461b80');
        expect(document.activeElement).toBe(taskInput);
    });


    it('should restore input border style on input event', () => {

        const sampleTasks = [
            { id: '1', text: 'Task with Border', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        toggleEdit('1');

        const taskInput = document.querySelector('#onetask-1');
        taskInput.dispatchEvent(new Event('input'));

        expect(taskInput.readOnly).toBe(false);
        expect(taskInput.style.borderBottom).toBe('2px solid #461b80');
    });

}); 