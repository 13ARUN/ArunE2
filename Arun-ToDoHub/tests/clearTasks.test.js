    const fs = require('fs');
    const path = require('path');

    


    beforeEach(() => {
            // Load HTML and CSS
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

    describe('ClearTasks Function', () => {
        
        it('should clear all tasks when filter is "all"', () => {

            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }, { id: 2, text: 'Task 2', completed: true }]));
            localStorage.setItem('statusFilter', 'all');
            
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
            
            expect(localStorage.getItem('tasks')).toBe(null); // All tasks should be cleared
        });

        it('should clear only in-progress tasks when filter is "inprogress"', () => {
            
            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }, { id: 2, text: 'Task 2', completed: true }]));
            localStorage.setItem('statusFilter', 'inprogress');
            
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();

            const remainingTasks = JSON.parse(localStorage.getItem('tasks'));
            expect(remainingTasks.length).toBe(1); // Only completed tasks should remain
            expect(remainingTasks[0].completed).toBe(true);
        });

        it('should clear only completed tasks when filter is "completed"', () => {
            
            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }, { id: 2, text: 'Task 2', completed: true }]));
            localStorage.setItem('statusFilter', 'completed');

            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();

            const remainingTasks = JSON.parse(localStorage.getItem('tasks'));
            expect(remainingTasks.length).toBe(1); // Only in-progress tasks should remain
            expect(remainingTasks[0].completed).toBe(false);
        });

        it('should cancel clear when cancel button is clicked', () => {

            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }, { id: 2, text: 'Task 2', completed: true }]));
            localStorage.setItem('statusFilter', 'all');
            
            clearTasks();

            const cancelButton = document.getElementById('cancel-button');
            cancelButton.click();
            
            expect(localStorage.getItem('tasks')).not.toBe(null); // All tasks should be cleared
        });

        it('should handle case where there are no tasks to clear', () => {
            
            localStorage.setItem('tasks', JSON.stringify([])); // No tasks to clear
            localStorage.setItem('statusFilter', 'all');
            
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();

            expect(localStorage.getItem('tasks')).toBeNull(); // Tasks array should remain empty
        });

        it('should display the correct confirmation message for different filters', () => {
            const filters = ['all', 'inprogress', 'completed'];

            filters.forEach(filter => {
                localStorage.setItem('statusFilter', filter);
                clearTasks();

                const message = document.querySelector('#message-text').textContent;
                switch (filter) {
                    case 'all':
                        expect(message).toBe('Are you sure you want to clear all tasks?');
                        break;
                    case 'inprogress':
                        expect(message).toBe('Are you sure you want to clear all in-progress tasks?');
                        break;
                    case 'completed':
                        expect(message).toBe('Are you sure you want to clear all completed tasks?');
                        break;
                }

            });    
        });
        
        it('should reset taskIdCounter when clearing all tasks', () => {
            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }]));
            localStorage.setItem('taskIdCounter', '5'); // Simulate a task ID counter
            localStorage.setItem('statusFilter', 'all');
            
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();

            expect(localStorage.getItem('taskIdCounter')).toBeNull(); // taskIdCounter should be reset
        });

        
        

        
        



    });