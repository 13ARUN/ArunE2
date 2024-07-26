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

describe('displayTaskCounts Function', () => {

    it('should display "You have no tasks here!" for an empty task array with filter "all"', () => {
        
        const countDiv = document.querySelector('.count h3');

        const tasks = [];
        const filter = 'none';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have no tasks here!');
    });

    it('should display "You have no tasks here!" for an empty task array with filter "all"', () => {
        
        const countDiv = document.querySelector('.count h3');

        const tasks = [];
        const filter = 'all';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have no tasks here!');
    });

    it('should display "You have no tasks to do!";" for an empty task array with filter "inprogress"', () => {
        const countDiv = document.querySelector('.count h3');

        const tasks = [];
        const filter = 'inprogress';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have no tasks to do!');
    });

    it('should display "You have not completed any tasks!" for an empty task array with filter "completed"', () => {
        const countDiv = document.querySelector('.count h3');

        const tasks = [];
        const filter = 'completed';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have not completed any tasks!');
    });

    it('should display the correct count for all tasks', () => {
        
        const countDiv = document.querySelector('.count h3');

        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: true },
            { id: 3, text: 'Task 3', completed: false }
        ];
        const filter = 'all';

        
        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have a total of 3 tasks!');
    });

    it('should display the correct count for in-progress tasks', () => {
        const countDiv = document.querySelector('.count h3');

        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: true },
            { id: 3, text: 'Task 3', completed: false }
        ];
        const filter = 'inprogress';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have 2 tasks to do!');
    });

    it('should display the correct count for completed tasks', () => {
        const countDiv = document.querySelector('.count h3');

        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: true },
            { id: 3, text: 'Task 3', completed: true }
        ];
        const filter = 'completed';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have completed 2 tasks!');
    });

    it('should display the correct count text for all tasks with 1 task', () => {

        const countDiv = document.querySelector('.count h3');

        const tasks = [
            { id: 1, text: 'Single Task', completed: false }
        ];
        const filter = 'all';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have a total of 1 task!');
    });

    it('should display the correct count text for in-progress tasks with 1 task', () => {

        const countDiv = document.querySelector('.count h3');

        const tasks = [
            { id: 1, text: 'In-progress Task', completed: false }
        ];
        const filter = 'inprogress';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have 1 task to do!');
    });

    it('should display the correct count text for completed tasks with 1 task', () => {

        const countDiv = document.querySelector('.count h3');

        const tasks = [
            { id: 1, text: 'Completed Task', completed: true }
        ];
        const filter = 'completed';

        displayTaskCounts(tasks, filter);

        expect(countDiv.textContent).toBe('You have completed 1 task!');
    });

});