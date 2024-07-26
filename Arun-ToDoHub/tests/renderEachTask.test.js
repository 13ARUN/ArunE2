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

describe('renderEachTask', () => {
    
    test('should create and append a task element with correct content', () => {
        // Create a sample task
        const task = {
            id: 1,
            text: 'Sample Task',
            completed: false
        };

        // Call the function to render the task
        renderEachTask(task);

        // Assertions
        const taskElement = document.querySelector('.atask');
        expect(taskElement).not.toBeNull();

        const inputElement = taskElement.querySelector('input');
        expect(inputElement).not.toBeNull();
        expect(inputElement.value).toBe(task.text);

        const editButton = taskElement.querySelector('button[title="Edit Task"]');
        expect(editButton).not.toBeNull();

        const deleteButton = taskElement.querySelector('button[title="Delete Task"]');
        expect(deleteButton).not.toBeNull();
        
        const checkboxButton = taskElement.querySelector('button[title="Status"]');
        expect(checkboxButton).not.toBeNull();
        expect(checkboxButton.querySelector('img').src).toContain('img/notdone.png');
    });

    test('should apply the correct opacity based on the task completion status', () => {
        // Create a completed task
        const task = {
            id: 2,
            text: 'Completed Task',
            completed: true
        };

        // Call the function to render the task
        renderEachTask(task);

        // Assertions
        const taskElement = document.querySelector('.atask');
        expect(taskElement.style.opacity).toBe('0.6');
    });

    test('should render the save/cancel buttons only when editing', () => {
        // Create a sample task
        const task = {
            id: 3,
            text: 'Editable Task',
            completed: false
        };

        // Call the function to render the task
        renderEachTask(task);

        // Assertions
        const saveCancelDiv = document.querySelector(`#save-${task.id}`);
        expect(saveCancelDiv.style.display).toBe('none');
    });
});
