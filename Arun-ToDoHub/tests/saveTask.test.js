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

describe('SaveTask Function', () => {

    it('should update task text and re-render tasks', () => {
        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        const taskInput = document.querySelector('#onetask-1');
        taskInput.value = 'Updated Task Text';
        saveTask('1'); 

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].text).toBe('Updated Task Text');
        expect(taskInput.value).toBe('Updated Task Text'); 
    });

    it('should cancel saving of task text and re-render tasks', () => {
        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        const taskInput = document.querySelector('#onetask-1');
        taskInput.value = 'Updated Task Text';
        saveTask('1'); 

        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();

        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].text).toBe('Old Task Text');
        expect(taskInput.value).toBe('Old Task Text'); 
    });

    
    it('should not update task text when input empty and re-render tasks', () => {

        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        const taskInput = document.querySelector('#onetask-1');
        taskInput.value = '';
        saveTask('1');


        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].text).toBe('Old Task Text');
        expect(taskInput.value).toBe(''); // Ensure UI reflects updated text

        const notificationElement = document.querySelector('.notification');
        expect(notificationElement.textContent).toBe('Task cannot be empty!!'); // Example error message
    });

    it('should not update task text when input empty and re-render tasks', () => {

        const sampleTasks = [
            { id: '1', text: 'Old Task Text', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();


        const taskInput = document.querySelector('#onetask-1');
        taskInput.value = '     ';
        saveTask('1'); 

        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].text).toBe('Old Task Text');
        //expect(taskInput.value).toBe('');

        const notificationElement = document.querySelector('.notification');
        expect(notificationElement.textContent).toBe('Task cannot be empty!!'); // Example error message
    });

    test('should not allow saving a task with text that already exists', () => {
 
        const sampleTasks = [
            { id: 1, text: 'Existing Task', completed: false },
            { id: 2, text: 'Another Task', completed: false }
        ];
        

        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        const taskInput = document.querySelector('#onetask-1');
        taskInput.value = 'Another Task';
        saveTask('1'); 

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
    
        const notificationElement = document.querySelector('.notification');
        expect(notificationElement.textContent).toBe('Task already exists!');

        expect(localStorage.getItem('tasks')).toBe(JSON.stringify([
            { id: 1, text: 'Existing Task', completed: false },
            { id: 2, text: 'Another Task', completed: false }
        ]));

    });

    
    
});