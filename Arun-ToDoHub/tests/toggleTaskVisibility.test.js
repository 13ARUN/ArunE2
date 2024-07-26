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

describe('toggleTaskVisibility Function', () => {
        
    let noTasks, showtask, taskActions, countDiv;

    beforeEach(() => {
        // Set up the DOM elements
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        document.body.innerHTML = html;

        noTasks = document.querySelector('.notasks');
        showtask = document.querySelector('.tasklist');
        taskActions = document.querySelector('.tasktext');
        countDiv = document.querySelector('.clear');
    });

    it('should hide task list and display no tasks message when there are no tasks', () => {
        const tasks = [];
        toggleTaskListVisibility(tasks);

        expect(noTasks.style.display).toBe('flex');
        expect(showtask.style.display).toBe('none');
        expect(taskActions.style.display).toBe('none');
        expect(countDiv.style.display).toBe('none');
    });

    it('should show task list and hide no tasks message when there are tasks', () => {
        const tasks = [{ id: 1, text: 'Sample Task', completed: false }];
        toggleTaskListVisibility(tasks);

        expect(noTasks.style.display).toBe('none');
        expect(showtask.style.display).toBe('flex');
        expect(taskActions.style.display).toBe('flex');
        expect(countDiv.style.display).toBe('flex');
    });

});