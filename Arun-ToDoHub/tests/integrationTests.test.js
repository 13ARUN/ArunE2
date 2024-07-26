const fs = require('fs');
const path = require('path');
const { fireEvent } = require("@testing-library/dom");


let inputBox;
let form;
let addButton;
let taskList;
let countText;

beforeEach(() => {

    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/style.css'), 'utf8');

    document.body.innerHTML = html;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = cssContent;
    document.head.appendChild(styleElement);

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
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    jest.resetModules();
    localStorage.clear();

    inputBox = document.querySelector('#input');
    form = document.querySelector('form');
    addButton = document.querySelector('#add');
    taskList = document.querySelector('#listtask');
    countText = document.querySelector('.count h3')

    
});

afterEach(() => {
    localStorage.clear();
});

describe('DOM content load', () => {

    it('should render tasks based on saved filter when DOMContentLoaded is fired', () => {
        const savedFilter = 'completed';
        localStorage.setItem('statusFilter', savedFilter);
        localStorage.setItem('taskIdCounter', '0');
        
        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(localStorage.getItem('statusFilter')).toBe(savedFilter);
        expect(document.querySelector('input[value="completed"]').checked).toBe(true);
        
    });

    it('should increment taskIdCounter when a task is added', () => {
        
    
        inputBox.value = 'Test Task 1';
        addButton.click();
    
        expect(localStorage.getItem('taskIdCounter')).toBe('1');
    
        inputBox.value = 'Test Task 2';
        addButton.click();
    
        expect(localStorage.getItem('taskIdCounter')).toBe('2');
      });

    it('should set default filter to "all" if no saved filter is found when DOMContentLoaded is fired', () => {
        localStorage.setItem('taskIdCounter', '0');

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(localStorage.getItem('statusFilter')).toBeNull();
        expect(document.querySelector('input[value="all"]').checked).toBe(true);
        
    });



    it('should initialize taskIdCounter from localStorage value', () => {
        localStorage.setItem('taskIdCounter', '10');
        
        
        expect(taskIdCounter).toBe(0);
        expect(localStorage.getItem('taskIdCounter')).toBe('10');
    });
})

describe('Adding a Task', () => {

    it('should add a task and display in UI', () => {

        expect(document.activeElement).not.toBe(inputBox);

        expect(inputBox.value).toBe('');
        expect(taskList.textContent).toBe('');

        inputBox.value = 'New Task';
        form.dispatchEvent(new Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const filter = localStorage.getItem('statusFilter');
        const taskIdCounter =localStorage.getItem('taskIdCounter');

        expect(tasks).toHaveLength(1);
        expect(filter).toBe('all');
        expect(taskIdCounter).toBe('1');

        expect(tasks[0].id).toBe(1);
        expect(tasks[0].text).toBe('New Task');
        expect(tasks[0].completed).toBe(false);

        taskId = tasks[0].id;
        const aTask = document.querySelector(`#onetask-1`)

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('New Task');
        expect(aTask.getAttribute('readonly')).toBe('true');

        expect(countText.textContent).toBe('You have a total of 1 task!');
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task added successfully');

        expect(document.activeElement).toBe(inputBox);
        expect(inputBox.value).toBe('');

    });

    

    it('should add two new tasks and display in UI ', () => {

        expect(document.activeElement).not.toBe(inputBox);

        expect(inputBox.value).toBe('');
        expect(taskList.textContent).toBe('');
        
    
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        inputBox.value = 'Task 2';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const filter = localStorage.getItem('statusFilter');
        const taskIdCounter =localStorage.getItem('taskIdCounter');

        expect(tasks).toHaveLength(2);
        expect(filter).toBe('all');
        expect(taskIdCounter).toBe('2');

        expect(tasks[0].id).toBe(1);
        expect(tasks[0].text).toBe('Task 1');
        expect(tasks[0].completed).toBe(false);

        expect(tasks[1].id).toBe(2);
        expect(tasks[1].text).toBe('Task 2');
        expect(tasks[1].completed).toBe(false);

        taskId1 = tasks[0].id;
        taskId2 = tasks[1].id;

        const aTask1 = document.querySelector(`#onetask-${taskId1}`);
        const aTask2= document.querySelector(`#onetask-${taskId2}`);
        

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(2);

        expect(aTask1.value).toBe('Task 1');
        expect(aTask1.getAttribute('readonly')).toBe('true');

        expect(aTask2.value).toBe('Task 2');
        expect(aTask2.getAttribute('readonly')).toBe('true');

        expect(countText.textContent).toBe('You have a total of 2 tasks!');
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task added successfully');

        expect(document.activeElement).toBe(inputBox);
        expect(inputBox.value).toBe('');
    
       

    });

    it('should add a new task with leading spaces after trimming', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '    Task';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('Task');
    });

    it('should add a new task with trailing spaces after trimming', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = 'Task     ';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('Task');
    });

    it('should add a new task with leading and trailing spaces after trimming', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '    Task     ';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('Task');
    });

    it('should not add an empty task', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull();
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot be empty!!');

    });

    // TODO
    it('should not add an empty task', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '';
        form.dispatchEvent(new Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull();
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot be empty!!');

        inputBox.dispatchEvent(new Event('input'));
        // const style = window.getComputedStyle(inputBox);
        //expect(inputBox.borderBottom).toBe('none');

    });

    it('should not add a task with only spaces', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '     ';
        form.dispatchEvent(new Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull();
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot contain only spaces!');
    });

    it('should not add an existing task', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task already exists!');

        const displayedTasks = document.querySelectorAll('.eachtask input[type="text"]');
        expect(displayedTasks).toHaveLength(1);
        expect(displayedTasks[0].value).toBe('Task 1');
    });
});


describe('filter a Task', () => {

    

   

    
    

    //? Integration tests

    it('should filter tasks based on status', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new  Event('submit'));
        
        inputBox.value = 'Task 2';
        form.dispatchEvent(new  Event('submit'));

        inputBox.value = 'Task 3';
        form.dispatchEvent(new  Event('submit'));
        
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks[1].completed = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    
        const inProgressFilter = document.querySelector('input[name="taskFilter"][value="inprogress"]');
        inProgressFilter.click();
    
        const displayedInProgressTasks = document.querySelectorAll('.eachtask input[type="text"]');
        expect(displayedInProgressTasks).toHaveLength(2);
        expect(displayedInProgressTasks[0].value).toBe('Task 1');
        expect(displayedInProgressTasks[1].value).toBe('Task 3');

        const completedFilter = document.querySelector('input[name="taskFilter"][value="completed"]');
        completedFilter.click();
    
        const displayedCompletedTasks = document.querySelectorAll('.eachtask input[type="text"]');
        expect(displayedCompletedTasks).toHaveLength(1);
        expect(displayedCompletedTasks[0].value).toBe('Task 2');
    });

});

describe('Deleting a Task', () => {

    it('should delete a task after adding a task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be deleted';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const deleteButton = document.querySelector(`#edit-${taskId} button[title="Delete Task"]`);
        deleteButton.click();
    
        // Simulate user confirming the deletion
        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(0);
    });

    it('should cancel deletion of task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be deleted';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const deleteButton = document.querySelector(`#edit-${taskId} button[title="Delete Task"]`);
        deleteButton.click();
    
        // Simulate user confirming the deletion
        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].text).toBe('Task to be deleted');
    });







});

describe('Editing a Task', () => {


    it('should edit a task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editBox =  document.querySelector(`#onetask-${taskId}`);
        editBox.value = 'Task edited';


        //editBox.dispatchEvent(new Event('input'));
        fireEvent.input(editBox);

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
        
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task edited')

        
    });


    it('should not do anything when other keys are pressed', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editBox =  document.querySelector(`#onetask-${taskId}`);
        editBox.value = 'Task edited';


        fireEvent.keyDown(editBox, { key: 'Space' });

        
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });

    it('should cancel edit a task after editing', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Task edited';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();


        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });

    it('should not edit a task that is empty', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = '';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot be empty!!');
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });

    it('should edit a task to a task that already exists', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Existing Task';
        addButton.click();

        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[1].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Existing Task';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task already exists!');
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Existing Task')

        
    });

    it('should not be able to edit completed task', () => {

        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));
        
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click();

        
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Cannot edit completed task!');


         
    });



});

describe('Cancel editing of Task', () => {

    it('should cancel edit a task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Task edited';

        const cancelButton = document.querySelector(`#save-${taskId} button[title="Cancel Edit"]`);
        cancelButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });


});

describe('Change completed status', () => {


    it('should change completed status when clicked', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks[0].completed).toBeFalsy();
        
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()

        const tasksComplete = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksComplete[0].completed).toBeTruthy();  
    });

    it('should change completed status when clicked', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()
        checkButton.click()

        const tasksComplete = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksComplete[0].completed).toBeFalsy();  
    });

});

describe('Clear tasks', () => {

    it('should clear all tasks', () => {

        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));
        

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull()

    });

    it('should not clear all tasks when canceled', () => {

        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));
        

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks[0].text).toBe('Task 1')

    });

    it('should clear In Progress tasks', () => {

        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');

        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        inputBox.value = 'Task 2';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()
        
        const inProgressFilter = document.querySelector('input[name="taskFilter"][value="inprogress"]');
        inProgressFilter.click();

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasksclear = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksclear).toHaveLength(1);
        expect(tasksclear[0].text).toBe('Task 1')
        
        

    });

    it('should clear Completed tasks', () => {
        
        
        
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
       
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        inputBox.value = 'Task 2';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()

        const completedFilter = document.querySelector('input[name="taskFilter"][value="completed"]');
        completedFilter.click();

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasksclear = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksclear).toHaveLength(1);
        expect(tasksclear[0].text).toBe('Task 2')
        
        

    });





});


