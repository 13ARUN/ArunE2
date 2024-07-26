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

test('toggleSave sets task text to readonly and border style to none', () => {
    const sampleTasks = [
        { id: '1', text: 'Old Task Text', completed: false }
    ];
    localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    localStorage.setItem('taskIdCounter', '1');

    renderTasks();

    toggleEdit('1');

    toggleSave('1');

    const taskText = document.querySelector(`#onetask-1`);
    expect(taskText.readOnly).toBe(true);
    expect(taskText.style.borderStyle).toBe('none');
});
