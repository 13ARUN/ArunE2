
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

describe('createTaskElement Function', () => {

    it('should create a task element with the correct structure', () => {
       
        taskList = document.querySelector('#listtask');

        const task = {
            id: 1,
            text: 'Sample Task',
            completed: false
        };

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

        expect(taskElement).toBeTruthy();
        expect(taskElement.querySelector('input[type="text"]').value).toBe('Sample Task');
        expect(taskElement.querySelector('input[type="text"]').getAttribute('readonly')).toBe('true');
        expect(taskElement.querySelector('button[title="Status"]').querySelector('img').src).toContain('img/notdone.png');

        
        const saveDiv = taskElement.querySelector(`#save-${task.id}`);
        const style = window.getComputedStyle(saveDiv);
        expect(style.display).toBe("none");

        expect(taskElement.querySelector('button[title="Edit Task"]')).toBeTruthy();
        expect(taskElement.querySelector('button[title="Delete Task"]')).toBeTruthy();
        expect(taskElement.querySelector('button[title="Save Task"]')).toBeTruthy();
        expect(taskElement.querySelector('button[title="Cancel Edit"]')).toBeTruthy();
    });

    it('should create a task element with the correct structure for a completed task', () => {
     
        const task = {
            id: 2,
            text: 'Completed Task',
            completed: true
        };

    
        const taskElement = createTaskElement(task);
        const taskList = document.querySelector('#listtask');

   
        taskList.appendChild(taskElement);


        expect(taskElement).toBeTruthy();
        expect(taskElement.querySelector('input[type="text"]').value).toBe('Completed Task');
        expect(taskElement.querySelector('input[type="text"]').getAttribute('readonly')).toBe('true');
        expect(taskElement.querySelector('button[title="Status"]')).toBeTruthy();
        expect(taskElement.querySelector('button[title="Status"]').querySelector('img').src).toContain('img/done.png');
    });

    it('should correctly display Save and Cancel buttons when toggled', () => {
        
        const task = {
            id: 4,
            text: 'Task to be edited',
            completed: false
        };
       
        const taskElement = createTaskElement(task);
        const taskList = document.querySelector('#listtask');

        taskList.appendChild(taskElement);


        const editButton = taskElement.querySelector('button[title="Edit Task"]');
        editButton.click();

        expect(taskElement.querySelector('button[title="Save Task"]')).toBeTruthy();
        expect(taskElement.querySelector('button[title="Cancel Edit"]')).toBeTruthy();
        
        const saveDiv = taskElement.querySelector(`#save-${task.id}`);
        const style = window.getComputedStyle(saveDiv);
        expect(style.display).toBe("flex");
    });

});