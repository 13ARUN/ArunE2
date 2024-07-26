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

describe('checkBox function', () => {

    
    it('should toggle the completion status of a task and re-render tasks', () => {
        const taskId = 1;
        const initialTasks = [
            { id: taskId, text: 'Sample Task', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(initialTasks));

        checkBox(taskId);

        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        const updatedTask = updatedTasks.find(task => task.id === taskId);
        expect(updatedTask.completed).toBe(true); // Status should be toggled to true
    
    });

    it('should toggle the completion status of a task and re-render tasks', () => {
        const taskId = 1;
        const initialTasks = [
            { id: taskId, text: 'Sample Task', completed: true }
        ];
        localStorage.setItem('tasks', JSON.stringify(initialTasks));

        checkBox(taskId);

        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        const updatedTask = updatedTasks.find(task => task.id === taskId);
        expect(updatedTask.completed).toBe(false); // Status should be toggled to true
    
    });

    it('should toggle the completion status of the correct task when multiple tasks exist', () => {
        const taskId = 2;
        const initialTasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: taskId, text: 'Task 2', completed: false },
            { id: 3, text: 'Task 3', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(initialTasks));
    
        checkBox(taskId);
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        const updatedTask = updatedTasks.find(task => task.id === taskId);
        expect(updatedTask.completed).toBe(true); // Task with ID 2 should be toggled
    });
    

    // it('should handle an empty task list', () => {
    //     const taskId = 1; // Any ID
    //     localStorage.clear(); // Ensure the task list is empty
    
    //     checkBox(taskId);
    
    //     const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
    //     expect(updatedTasks).toBeNull(); // No tasks should be present
    // });
    

    // it('should handle a non-existent task gracefully', () => {
    //     const taskId = 999; // Non-existent task
    //     const initialTasks = [
    //         { id: 1, text: 'Sample Task', completed: false }
    //     ];
    //     localStorage.setItem('tasks', JSON.stringify(initialTasks));
    
    //     checkBox(taskId);
    
    //     const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
    //     expect(updatedTasks).toEqual(initialTasks); // Tasks should remain unchanged
    // });
    

    

});

