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

describe('Delete Function', () => {

    it('should delete a task and update localStorage and UI on confirmation', () => {
        
        const sampleTasks = [
            { id: '1', text: 'Task to Delete', completed: false },
            { id: '2', text: 'Another Task', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '2');


        renderTasks();

        deleteTask('1');

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].id).toBe('2'); // Only the second task should remain

        expect(document.querySelector('#onetask-1')).toBeNull(); // The task should be removed from the UI
        expect(document.querySelector('#onetask-2')).toBeTruthy(); // The remaining task should still be there


    });

    it('should cancel deletion and show cancellation message on cancel', () => {
   
        const sampleTasks = [
            { id: '1', text: 'Task to Cancel', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();


        deleteTask('1');

        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1); // The task should still be present in the localStorage
        expect(document.querySelector('#onetask-1')).toBeTruthy(); // The task should still be in the UI


    });

    it('should delete a task correctly when there are multiple tasks', () => {
        const sampleTasks = [
            { id: '1', text: 'Task 1', completed: false },
            { id: '2', text: 'Task 2', completed: false },
            { id: '3', text: 'Task 3', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '3');

        renderTasks();

        deleteTask('2');

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(2);
        expect(tasks.some(task => task.id === '2')).toBeFalsy(); // Task 2 should be removed
        expect(tasks.some(task => task.id === '1')).toBeTruthy(); // Task 1 should remain
        expect(tasks.some(task => task.id === '3')).toBeTruthy(); // Task 3 should remain
    });

    it('should delete the last task and update the UI correctly', () => {
        const sampleTasks = [
            { id: '1', text: 'Last Task', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        localStorage.setItem('taskIdCounter', '1');

        renderTasks();

        deleteTask('1');

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(0); // No tasks should remain
        expect(document.querySelector('#onetask-1')).toBeNull(); // The task should be removed from the UI
    });

    // it('should handle errors gracefully during deletion', () => {
    //     const allTasks = '{"id": 1, "text": "Task 1",'; // Simulate corrupt JSON
    //     localStorage.setItem('tasks', allTasks);

    //     renderTasks();

    //     deleteTask('2'); //invalid Id

    //     const confirmButton = document.getElementById('confirm-button');
    //     confirmButton.click();

    //     const notification = document.querySelector('.notification');
    //     expect(notification.textContent).toBe('Failed to delete task. Please try again.');
    //     expect(notification.style.backgroundColor).toBe('rgb(184, 13, 13)');

    //     const tasks = localStorage.getItem('tasks');
    //     expect(tasks).toBe(allTasks); 
    // });
    
});