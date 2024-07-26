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

describe('Cancel Edit Function', () => {
    
    it('should restore original task text on cancel edit', () => {

        const sampleTasks = [
            { id: '1', text: 'Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        const taskInput = document.querySelector('#onetask-1');
        taskInput.value = 'Updated Task Text';

        cancelEdit('1'); 
        
        expect(taskInput.value).toBe('Task Text'); // Ensure the value is restored
        expect(document.querySelector('#save-1').style.display).toBe('none'); // Save/Cancel should be hidden
        expect(document.querySelector('#edit-1').style.display).toBe('flex'); // Edit/Delete should be visible
    });

    it('should not affect other tasks when canceling edit', () => {
        const sampleTasks = [
            { id: '1', text: 'Task 1', completed: false },
            { id: '2', text: 'Task 2', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '2');

        renderTasks();

        const taskInput1 = document.querySelector('#onetask-1');
        const taskInput2 = document.querySelector('#onetask-2');
        taskInput1.value = 'Updated Task 1 Text';
        taskInput2.value = 'Updated Task 2 Text';

        cancelEdit('1'); 
        
        expect(taskInput1.value).toBe('Task 1'); // Ensure original text of task 1 is restored
        expect(taskInput2.value).toBe('Updated Task 2 Text'); // Ensure task 2 remains unchanged
    });

    it('should handle task not found', () => {

        // localStorage.setItem('tasks', JSON.stringify([])); // No tasks in localStorage

        // cancelEdit('1');
        
        // const taskInput = document.querySelector('#onetask-1');
        // expect(taskInput).toBe(null); 

        // const sampleTasks = [
        //     { id: '1', text: 'Task Text', completed: false }
        // ];
        // localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        // localStorage.setItem('taskIdCounter', '1');

        // renderTasks();

        // const taskInput = document.querySelector('#onetask-1');
        // taskInput.value = 'Updated Task Text';

        // cancelEdit('2'); 


    });


});