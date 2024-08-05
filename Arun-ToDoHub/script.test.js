const fs = require('fs');
const path = require('path');
const Chance = require('chance');
const chance = new Chance();

const { fireEvent } = require("@testing-library/dom");

//* Helper Functions

function generateRandomSentence(options) {
    return chance.sentence(options);
}

function generateRandomString(options) {
    return chance.string(options);
}

function generateTasks(param, randomText = true, statuses = false) {

    const tasks = [];
    let count;
    let ids;

    if (Array.isArray(param)) {
        ids = param;
        count = ids.length;
    } else {
        count = param;
    }

    for (let i = 0; i < count; i++) {
        const task = {
            id: ids ? ids[i] : i + 1,
            text: randomText ? generateRandomString({ length: 10 }) : `Task ${i + 1}`,
            completed: Array.isArray(statuses) ? statuses[i] !== undefined ? statuses[i] : false : statuses
        };
        tasks.push(task);    
    }
    return tasks;
}

function objectsOfArray(taskArray) {
    return Object.assign({}, ...taskArray);
}

function notificationTest (text, color){

    let notification = document.querySelector('.notification');

    expect(notification.textContent).toBe(text);
    const style = window.getComputedStyle(notification);
    expect(style.backgroundColor).toBe(color);
    expect(style.visibility).toBe('visible');

    
}

const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, value);
};

const getLocalStorageItem = (key) => {
    switch (key) {
        case 'tasks':
            return JSON.parse(localStorage.getItem(key));
        case 'taskIdCounter':
            return JSON.parse(localStorage.getItem(key));
        case 'statusFilter':
            return localStorage.getItem(key);
        default:
            return null;
    }
};

const clearLocalStorage = () => {
    localStorage.clear();
};



//* Test Cases

describe('HTML', () => {

    function checkElement(selector, attributes) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        Object.keys(attributes).forEach(attr => {
            expect(element.getAttribute(attr)).toBe(attributes[attr]);
        });
        return element;
    }

    function checkStyles(selector, expectedStyles) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        const styles = window.getComputedStyle(element);
        Object.keys(expectedStyles).forEach(style => {
            expect(styles[style]).toBe(expectedStyles[style]);
        });
    }

    function checkContains(containerSelector, childSelectors) {
        const container = document.querySelector(containerSelector);
        expect(container).toBeTruthy();
        childSelectors.forEach(childSelector => {
            const child = document.querySelector(childSelector);
            expect(container.contains(child)).toBe(true);
        });
    }
        
    beforeEach(() => {
        
        const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, './css/style.css'), 'utf8');
        
        document.body.innerHTML = html;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);

        jest.resetModules();

    });

    describe('HTML-File Section', () => {

        it('should have font family as "Arial,sans-serif"', () => {
            checkStyles('*', {
                fontFamily: 'Arial,sans-serif'
            });
        });
    });

    describe('HTML-Body Section', () => {

        it('should have all elements in body', () => {
            checkContains('body', ['.main', '.notification', '#toast-container', 'script']);
            checkStyles('.main', {
                backgroundImage: "url(../img/back2.jpg)"
            });
        });
    });

    describe('HTML-Header Section', () => {

        it('should have all elements in ToDo Div', () => {
            checkContains('.todo', ['header']);
            checkStyles('.todo', {
                backgroundColor: 'rgba(212, 174, 236, 0.801)'
            });
            expect(document.querySelector('header h1').textContent).toBe('To-Do Planner!');
            checkStyles('header', {
                color: 'rgb(63, 20, 119)'
            });
        });
    });

    describe('HTML-Task Input Section', () => {

        it('should have all elements in task input Div', () => {
            
            checkContains('.taskfield', ['.taskinput']);
            checkElement('.taskinput form', {});
            const inputField = checkElement('#input', {
                type: 'text',
                id: 'input',
                placeholder: 'Enter your tasks...',
                autocomplete: 'off',
                maxLength: '150'
            });
            expect(inputField.disabled).toBe(false);

            const addBtn = checkElement('#add', {
                type: 'submit',
                id: 'add',
                title: 'Add'
            });
            expect(addBtn.disabled).toBe(false);

            const addBtnImg = document.querySelector('#add img');
            expect(addBtn.contains(addBtnImg)).toBe(true);
            expect(addBtnImg.src).toContain('img/taskadd.png');
            checkElement('#add img', {
                alt: 'add icon'
            });
        });
    });

    describe('HTML-Task Filter Section', () => {

        it('should have all elements in tasks filter Div', () => {
            checkContains('.taskfilterclr', ['#all', '#labelall', '#inprogress', '#labelinprogress', '#completed', '#labelcompleted']);
            
            const allRadioBtn = checkElement('#all', {value: 'all'});
            expect(allRadioBtn.disabled).toBe(false);
            const allRadioLabel = document.querySelector('#labelall');
            expect(allRadioLabel.textContent).toBe('All');
            checkElement('#labelall', {
                for: 'all',
                title: 'All'
            });

            const inProgressRadioBtn = checkElement('#inprogress', {value: 'inprogress'});
            expect(inProgressRadioBtn.disabled).toBe(false);
            const inprogressRadioLabel = document.querySelector('#labelinprogress');
            expect(inprogressRadioLabel.textContent).toBe('In Progress');
            checkElement('#labelinprogress', {
                for: 'inprogress',
                title: 'In Progress'
            });

            const completedRadioBtn = checkElement('#completed', {value: 'completed'});
            expect(completedRadioBtn.disabled).toBe(false);
            const completedRadioLabel = document.querySelector('#labelcompleted');
            expect(completedRadioLabel.textContent).toBe('Completed');
            checkElement('#labelcompleted', {
                for: 'completed',
                title: 'Completed'
            });
        });
    });

    describe('HTML-No Tasks Section', () => {  
        
        it('should have all elements in no tasks Div', () => {
            checkContains('.notasks', ['.notaskcontent']);
            checkContains('.notaskcontent', ['.notaskcontent img', '.notaskcontent h2']);

            const noTaskImg = document.querySelector('.notaskcontent img');
            expect(noTaskImg.src).toContain('img/notask.png');
            expect(noTaskImg.alt).toBe('notask image'); 
            expect(document.querySelector('.notaskcontent h2').textContent).toBe('Add tasks to begin!!');
        }); 
    });

    describe('HTML-Task List Section', () => {

        it('should have all elements in Task List Div', () => {
            checkContains('.tasklist', ['.taskdisplay']);
            checkContains('.taskdisplay', ['#listtask']);
            expect(document.querySelector('#listtask').textContent).toBe('');

        });
    });

    describe('HTML-Task Count and Clear Section', () => {

        it('should have all elements in Task count and clear Message Div', () => {
            checkContains('.clear', ['#clear', '.count']);
            checkContains('.count', ['h3']);
            expect(document.querySelector('h3').textContent).toBe('You have no tasks here!');

            const clearBtn = document.querySelector('#clear');
            expect(clearBtn.disabled).toBe(false);
            expect(clearBtn.title).toBe('Clear'); 
            expect(clearBtn.textContent).toBe('Clear Tasks');
        });
    });

    describe('HTML-Notification Message Section', () => {

        it('should have all elements in notification Message Div', () => {
            checkElement('body p', {
                class: 'notification'
            });
            checkStyles('body p', {
                visibility: 'hidden'
            });
            expect(document.querySelector('body p').textContent).toBe('');
        });
    });

    describe('HTML-Toast Message Section', () => {
        it('should have all elements in Toast Message Div', () => {
            checkContains('#toast-container', ['.toast-message', '#message-text', '.button-container']);
            checkContains('.button-container', ['#confirm-button', '#cancel-button', '.button-container h3']);

            const confirmBtn = document.querySelector('#confirm-button');
            expect(confirmBtn.textContent).toBe('Yes');
            expect(confirmBtn.disabled).toBe(false);

            const cancelBtn = document.querySelector('#cancel-button') 
            expect(cancelBtn.textContent).toBe('No');
            expect(cancelBtn.disabled).toBe(false);
        });  
    });

    describe('HTML-Script Section', () => {
        it('should have the source file', () => {
            const script = document.querySelector('script');
            expect(script.src).toContain('script.js');
        });
    });

});

describe('Unit Tests', () => {

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
        document.body.innerHTML = html;

        ({
        renderTasks,
        renderEachTask,
        addTask,
        validateInput,
        checkBox,
        clearTasks,
        cancelEdit,
        isTaskAlreadyExists,
        filterTasks,
        deleteTask,
        saveTask,
        toggleEdit,
        toggleSave,
        showNotification,
        showToast,
        clearTaskList,
        createTaskElement,
        displayTaskCounts,
        toggleTaskListVisibility,
        disableOtherElements,
        toggleTaskControls,
        toggleToast
        } = require('./script.js'));

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

        localStorage.clear();
        jest.resetModules();
    });
        
    afterEach(() => {
        localStorage.clear();
    });

    describe('DOM content load', () => {

        let allButton, inprogressButton, completedButton

        beforeEach(() => {

            allButton = document.querySelector('input[value="all"]');
            inprogressButton = document.querySelector('input[value="inprogress"]');
            completedButton = document.querySelector('input[value="completed"]')

        })

        it('should render tasks based on saved filter when DOMContentLoaded is fired', () => {
    
            const savedFilterAll = 'all';
            setLocalStorageItem('statusFilter', savedFilterAll);
            
            document.dispatchEvent(new Event('DOMContentLoaded'));
    
            expect(getLocalStorageItem ('statusFilter')).toBe(savedFilterAll);
            expect(allButton.checked).toBe(true);
            expect(inprogressButton.checked).toBe(false);
            expect(completedButton.checked).toBe(false);
    
            const savedFilterCompleted = 'completed';
            setLocalStorageItem('statusFilter', savedFilterCompleted);
            
            document.dispatchEvent(new Event('DOMContentLoaded'));
    
            expect(getLocalStorageItem ('statusFilter')).toBe(savedFilterCompleted);
            expect(allButton.checked).toBe(false);
            expect(inprogressButton.checked).toBe(false);
            expect(completedButton.checked).toBe(true);
    
            const savedFilterInprogress = 'inprogress';
            setLocalStorageItem('statusFilter', savedFilterInprogress);
            
            document.dispatchEvent(new Event('DOMContentLoaded'));
    
            expect(getLocalStorageItem ('statusFilter')).toBe(savedFilterInprogress);
            expect(allButton.checked).toBe(false);
            expect(inprogressButton.checked).toBe(true);
            expect(completedButton.checked).toBe(false);
            
            
        });
    
        it('should set default filter to "all" if no saved filter is found when DOMContentLoaded is fired', () => {
    
            clearLocalStorage();
    
            document.dispatchEvent(new Event('DOMContentLoaded'));
    
            expect(document.querySelector('input[value="all"]').checked).toBe(true);
            expect(document.querySelector('input[value="inprogress"]').checked).toBe(false);
            expect(document.querySelector('input[value="completed"]').checked).toBe(false);
    
            
        });
    
    });


    //*
    describe('RenderTasks', () => {
    
        it('should render tasks from localStorage', () => {
            
            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true }
            ];
            setLocalStorageItem('tasks', JSON.stringify(tasks));
            setLocalStorageItem('statusFilter', 'all');
    
            renderTasks();
           
            const taskElements = document.querySelectorAll('.atask');
            expect(taskElements.length).toBe(tasks.length);
    
        });
    
        it('should render tasks with empty array', () => {
            
            clearLocalStorage();
    
            renderTasks();
    
            const taskElements = document.querySelectorAll('.atask');
            expect(taskElements.length).toBe(0);
        });
    
    });

    //*
    describe('ClearTaskList Function', () => {

        let taskList;

        beforeEach(() => {
            taskList = document.querySelector('#listtask');
        });
    
        it('should clear all tasks from the task list and not other elements', () => {

            document.body.innerHTML = `
                <ul id="listtask">
                    <li>Task 1</li>
                </ul>
                <div id="other-element">This should not be cleared</div>
            `;
    
            clearTaskList();

            expect(taskList.innerHTML).toBe('');
            expect(document.querySelector('#other-element').textContent).toBe('This should not be cleared');
        });
    
        it('should handle an empty task list', () => {

            taskList.innerHTML = ''
            clearTaskList();
            expect(taskList.innerHTML).toBe('');
        });
    
    });

    //*
    describe('DisplayTaskCounts Function', () => {

        let countDiv;

        beforeEach(() => {
            countDiv = document.querySelector('.count h3');
        });

        it('should display "You have no tasks here!" for an empty task array with default filter', () => {
            
            const tasks = [];
    
            displayTaskCounts(tasks, 'none');
    
            expect(countDiv.textContent).toBe('You have no tasks here!');
        });
    
        it('should display "You have no tasks here!" for an empty task array with filter "all"', () => {
            
            const tasks = [];
    
            displayTaskCounts(tasks, 'all');
            expect(countDiv.textContent).toBe('You have no tasks here!');

            displayTaskCounts(tasks, 'inprogress');
            expect(countDiv.textContent).toBe('You have no tasks to do!');

            displayTaskCounts(tasks, 'completed');
            expect(countDiv.textContent).toBe('You have not completed any tasks!');

        });
    
        it('should display the correct count text for all tasks with 1 task', () => {
    
            const tasks = [
                { id: 1, text: 'Single Task', completed: false }
            ];
    
            displayTaskCounts(tasks, 'all');
            expect(countDiv.textContent).toBe('You have a total of 1 task!');
        });

    
        it('should display the correct count text for in-progress tasks with 1 task', () => {

            const tasks = [
                { id: 1, text: 'In-progress Task', completed: false },
                { id: 2, text: 'Completed Task', completed: true }
            ];
    
            displayTaskCounts(tasks, 'inprogress');
            expect(countDiv.textContent).toBe('You have 1 task to do!');

            displayTaskCounts(tasks, 'completed');
            expect(countDiv.textContent).toBe('You have completed 1 task!');
        });
    
        it('should display the correct count for all tasks', () => {
            
            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: true },
                { id: 4, text: 'Task 4', completed: false }
            ];
            
            displayTaskCounts(tasks, 'all');
            expect(countDiv.textContent).toBe('You have a total of 4 tasks!');

            displayTaskCounts(tasks, 'inprogress');
            expect(countDiv.textContent).toBe('You have 2 tasks to do!');

            displayTaskCounts(tasks, 'completed');
            expect(countDiv.textContent).toBe('You have completed 2 tasks!');
        });    
    
    });

    //*
    describe('FilterTasks Function', () => {

        it('should return an empty array for an empty task list', () => {
            const tasks = [];
            const filteredTasks = filterTasks(tasks, 'all');
            expect(filteredTasks).toEqual([]);
        
            const filteredInProgressTasks = filterTasks(tasks, 'inprogress');
            expect(filteredInProgressTasks).toEqual([]);
        
            const filteredCompletedTasks = filterTasks(tasks, 'completed');
            expect(filteredCompletedTasks).toEqual([]);
        });
    
        it('should return an empty array if no tasks match the filter inprogress', () => {

            const tasks = generateTasks(2, false, true);
 
            const filteredTasks = filterTasks(tasks, 'inprogress');
            expect(filteredTasks).toEqual([]);
        });
    
        it('should return an empty array if no tasks match the filter completed', () => {

            const tasks = generateTasks(2, false, false);

            const filteredTasks = filterTasks(tasks, 'completed');
            expect(filteredTasks).toEqual([]);
        });
    
        it('should correctly filter tasks based on completion status', () => {

            const tasks = generateTasks(5, false, [false, true, false, false, true]);
            
    
            const filteredAllTasks = filterTasks(tasks, 'all');
            expect(filteredAllTasks).toEqual(tasks);
        
            const filteredInProgressTasks = filterTasks(tasks, 'inprogress');
            expect(filteredInProgressTasks).toEqual(tasks.filter(task => !task.completed));
        
            const filteredCompletedTasks = filterTasks(tasks, 'completed');
            expect(filteredCompletedTasks).toEqual(tasks.filter(task => task.completed));
        });
    });

    //*
    describe('RenderEachTask', () => {

        let taskList;

        beforeEach(() => {

            taskList = document.querySelector('#listtask');
        });
    
        it('should create and append a task element with correct content', () => {
            
            const task = generateTasks(1, false, false);

            const taskObject = objectsOfArray(task);
            

            renderEachTask(taskObject);

            expect(taskList.children.length).toBe(1);
            expect(taskList.querySelector('.atask')).toBeTruthy();
            expect(taskList.querySelector('.atask').style.opacity).toBe('1');
        });

        it('should create and append a task element with correct content', () => {
            

            const task = generateTasks(1, false, true);

            const taskObject = objectsOfArray(task);

            renderEachTask(taskObject);

            expect(taskList.children.length).toBe(1);
            expect(taskList.querySelector('.atask')).toBeTruthy();
            expect(taskList.querySelector('.atask').style.opacity).toBe('0.6');
        });
    


    });

    //*
    describe('CreateTaskElement Function', () => {

        beforeEach(() => {


        })

        it('should create a task element with the correct structure', () => {

            const tasks = generateTasks(1, true, false);
            
            const randomValue = tasks[0].text;
            const taskObject = objectsOfArray(tasks);
        
            const taskElement = createTaskElement(taskObject);
    
            expect(taskElement).toBeTruthy();
            expect(taskElement.style.opacity).toBe('1');


            expect(taskElement.querySelector('button[title="Status"]')).toBeTruthy();

            expect(taskElement.querySelector('.eachtask')).toBeTruthy();
            expect(taskElement.querySelector('input[type="text"]').id).toBe('onetask-1');
            expect(taskElement.querySelector('#onetask-1').value).toBe(randomValue);
            expect(taskElement.querySelector('#onetask-1').maxLength).toBe(150);
            expect(taskElement.querySelector('#onetask-1').getAttribute('readonly')).toBe('true');

            expect(taskElement.querySelector('.editdel')).toBeTruthy();
            expect(taskElement.querySelector('.editdel').id).toBe('edit-1');

            expect(taskElement.querySelector('#edit-1 button[title="Status"').id).toBe('checkbox-1');
            expect(taskElement.querySelector('#edit-1 #checkbox-1').disabled).toBeFalsy();
            
            expect(taskElement.querySelector('#edit-1 #checkbox-1').querySelector('img').src).toContain('img/notdone.png');
            expect(taskElement.querySelector('#edit-1 #checkbox-1').querySelector('img').alt).toBe('checkbox');
            
            expect(taskElement.querySelector('button[title="Edit Task"]').querySelector('img').src).toContain('img/edit.png');
            expect(taskElement.querySelector('button[title="Edit Task"]').querySelector('img').alt).toBe('edit icon');
            expect(taskElement.querySelector('button[title="Edit Task"]').disabled).toBeFalsy();

            expect(taskElement.querySelector('button[title="Delete Task"]').querySelector('img').src).toContain('img/delete.png');
            expect(taskElement.querySelector('button[title="Delete Task"]').querySelector('img').alt).toBe('delete icon');
            expect(taskElement.querySelector('button[title="Delete Task"]').disabled).toBeFalsy();

            expect(taskElement.querySelector('.savecancel')).toBeTruthy();
            expect(taskElement.querySelector('.savecancel').id).toBe('save-1');
            expect(taskElement.querySelector('.savecancel').style.display).toBe('none');

            expect(taskElement.querySelector('#save-1 button[title="Status"').id).toBe('checkbox-1');
            expect(taskElement.querySelector('#save-1 #checkbox-1').disabled).toBe(true);
            
            expect(taskElement.querySelector('#save-1 button[title="Status"]').querySelector('img').src).toContain('img/notdone.png');
            expect(taskElement.querySelector('#save-1 button[title="Status"]').querySelector('img').alt).toBe('checkbox');
            
            expect(taskElement.querySelector('button[title="Save Task"]').querySelector('img').src).toContain('img/save.png');
            expect(taskElement.querySelector('button[title="Save Task"]').querySelector('img').alt).toBe('save icon');
            expect(taskElement.querySelector('button[title="Save Task"]').disabled).toBeFalsy();


            expect(taskElement.querySelector('button[title="Cancel Edit"]').querySelector('img').src).toContain('img/wrong.png');
            expect(taskElement.querySelector('button[title="Cancel Edit"]').querySelector('img').alt).toBe('cancel icon');
            expect(taskElement.querySelector('button[title="Cancel Edit"]').disabled).toBeFalsy();


            expect(taskElement.querySelector('button[title="Edit Task"]').disabled).toBeFalsy();
            expect(taskElement.querySelector('button[title="Delete Task"]').disabled).toBeFalsy();
            expect(taskElement.querySelector('button[title="Save Task"]').disabled).toBeFalsy();
            expect(taskElement.querySelector('button[title="Cancel Edit"]').disabled).toBeFalsy();

        });

        it('should create a task element with the correct structure', () => {

            const tasks = generateTasks([2], true, true);
            
            const randomValue = tasks[0].text;
            const taskObject = objectsOfArray(tasks);
        
            const taskElement = createTaskElement(taskObject);
    
            expect(taskElement).toBeTruthy();
            expect(taskElement.style.opacity).toBe('0.6');


            expect(taskElement.querySelector('button[title="Status"]')).toBeTruthy();

            expect(taskElement.querySelector('.eachtask')).toBeTruthy();
            expect(taskElement.querySelector('input[type="text"]').id).toBe('onetask-2');
            expect(taskElement.querySelector('#onetask-2').value).toBe(randomValue);
            expect(taskElement.querySelector('#onetask-2').maxLength).toBe(150);
            expect(taskElement.querySelector('#onetask-2').getAttribute('readonly')).toBe('true');

            expect(taskElement.querySelector('.editdel')).toBeTruthy();
            expect(taskElement.querySelector('.editdel').id).toBe('edit-2');

            expect(taskElement.querySelector('#edit-2 button[title="Status"').id).toBe('checkbox-2');
            expect(taskElement.querySelector('#edit-2 button[title="Status"').disabled).toBeFalsy();
            
            expect(taskElement.querySelector('#edit-2 button[title="Status"]').querySelector('img').src).toContain('img/done.png');
            expect(taskElement.querySelector('#edit-2 button[title="Status"]').querySelector('img').alt).toBe('checkbox');
            
            expect(taskElement.querySelector('button[title="Edit Task"]').querySelector('img').src).toContain('img/edit.png');
            expect(taskElement.querySelector('button[title="Edit Task"]').querySelector('img').alt).toBe('edit icon');

            expect(taskElement.querySelector('button[title="Delete Task"]').querySelector('img').src).toContain('img/delete.png');
            expect(taskElement.querySelector('button[title="Delete Task"]').querySelector('img').alt).toBe('delete icon');

            expect(taskElement.querySelector('.savecancel')).toBeTruthy();
            expect(taskElement.querySelector('.savecancel').id).toBe('save-2');
            expect(taskElement.querySelector('.savecancel').style.display).toBe('none');

            expect(taskElement.querySelector('#save-2 button[title="Status"').id).toBe('checkbox-2');
            expect(taskElement.querySelector('#save-2 button[title="Status"').disabled).toBe(true);
            
            expect(taskElement.querySelector('#save-2 button[title="Status"]').querySelector('img').src).toContain('img/done.png');
            expect(taskElement.querySelector('#save-2 button[title="Status"]').querySelector('img').alt).toBe('checkbox');
            
            expect(taskElement.querySelector('button[title="Save Task"]').querySelector('img').src).toContain('img/save.png');
            expect(taskElement.querySelector('button[title="Save Task"]').querySelector('img').alt).toBe('save icon');

            expect(taskElement.querySelector('button[title="Cancel Edit"]').querySelector('img').src).toContain('img/wrong.png');
            expect(taskElement.querySelector('button[title="Cancel Edit"]').querySelector('img').alt).toBe('cancel icon');
    
            expect(taskElement.querySelector('button[title="Edit Task"]').disabled).toBeFalsy();
            expect(taskElement.querySelector('button[title="Delete Task"]').disabled).toBeFalsy();
            expect(taskElement.querySelector('button[title="Save Task"]').disabled).toBeFalsy();
            expect(taskElement.querySelector('button[title="Cancel Edit"]').disabled).toBeFalsy();

        });
    
    });

    //*
    describe('ToggleTaskVisibility Function', () => {
        
        let noTasks, showtask, taskActions, countDiv;
    
        beforeEach(() => {

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

            const tasks = generateTasks(1, false, false);
            toggleTaskListVisibility(tasks);
    
            expect(noTasks.style.display).toBe('none');
            expect(showtask.style.display).toBe('flex');
            expect(taskActions.style.display).toBe('flex');
            expect(countDiv.style.display).toBe('flex');
        });
    
    });


    //*
    describe('AddTask Function', () => {

        beforeEach(() => {

            inputBox = document.querySelector('#input');
            notification = document.querySelector('.notification');

        });

        it('should add a task and update localStorage', () => {
            
            const tasksBefore = getLocalStorageItem('tasks');
            const taskIdCounterBefore = getLocalStorageItem('taskIdCounter');
            const statusFilterBefore= getLocalStorageItem('statusFilter');

            expect(tasksBefore).toBeNull;
            expect(taskIdCounterBefore).toBeNull;
            expect(statusFilterBefore).toBeNull;

            expect(inputBox.value).toBe('');
            expect(document.activeElement).not.toBe(inputBox);
    
            let text = generateRandomString({ length: 10 });
            inputBox.value = text;
            addTask();

            const tasks = getLocalStorageItem('tasks');
            const taskIdCounter = getLocalStorageItem('taskIdCounter');
            const statusFilter= getLocalStorageItem('statusFilter');
    
            expect(tasks).toHaveLength(1);
            expect(tasks[0].id).toBe(1);
            expect(tasks[0].text).toBe(text);
            expect(tasks[0].completed).toBe(false);

            expect(taskIdCounter).toBe(1);
            expect(statusFilter).toBe('all');

            expect(document.querySelector('input[name="taskFilter"][value="all"]').checked).toBeTruthy();
            expect(document.querySelector('input[name="taskFilter"][value="inprogress"]').checked).toBeFalsy();
            expect(document.querySelector('input[name="taskFilter"][value="completed"]').checked).toBeFalsy();

            expect(inputBox.value).toBe('');
            expect(document.activeElement).toBe(inputBox);

            notificationTest("Task added successfully",'green');
            
        });

        it('should add a task and update localStorage when a task already exists', () => {

            const existTask = generateTasks(1, true, true);
            const randomValue1 = existTask[0].text;
            
            setLocalStorageItem('tasks', JSON.stringify(existTask));
            setLocalStorageItem('taskIdCounter', 1);
        

            let text = generateRandomString({ length: 10 });
            inputBox.value = text;
            addTask();

            const tasks = getLocalStorageItem('tasks');
            const statusFilter= getLocalStorageItem('statusFilter');
    
            expect(tasks).toHaveLength(2);

            expect(tasks[0].id).toBe(1);
            expect(tasks[0].text).toBe(randomValue1);
            expect(tasks[0].completed).toBe(true);

            
            expect(tasks[1].text).toBe(text);
            expect(tasks[1].completed).toBe(false);

            expect(statusFilter).toBe('all');

            expect(inputBox.value).toBe('');
            
        });
    
        it('should handle tasks with special characters correctly', () => {

            setLocalStorageItem('taskIdCounter', 1);

            inputBox.value = 'Task with @special #characters!';
            addTask();
    
            const tasks = getLocalStorageItem('tasks');

            expect(tasks).toHaveLength(1);
            expect(tasks[0].text).toBe('Task with @special #characters!');
        });
    
        it('should not add a duplicate task', () => {
    
            inputBox.value = 'Duplicate Task';
            addTask(); 
    
            inputBox.value = 'Duplicate Task'; 
            addTask(); 
    
            const tasks = getLocalStorageItem('tasks');

    
            expect(tasks).toHaveLength(1); 
            expect(tasks[0].text).toBe('Duplicate Task');

            expect(inputBox.value).toBe('');
            const styleInputBox = window.getComputedStyle(inputBox);
            expect(styleInputBox.borderBottom).toBe('2px solid red');

            notificationTest("Task already exists!",'rgb(184, 13, 13)');
        });
    
        it('should treat tasks with different cases as duplicates', () => {

            inputBox.value = 'Case Insensitive Task';
            addTask(); 
            
            inputBox.value = 'case insensitive task'; 
            addTask();
            
            const tasks = getLocalStorageItem('tasks');

            expect(tasks).toHaveLength(1);

            notificationTest("Task already exists!",'rgb(184, 13, 13)');

        });
    
        it('should not add a task if input is empty', () => {
    
            inputBox.value = '';
            addTask();
    
            const tasks = getLocalStorageItem('tasks');

            expect(tasks).toBeNull();

            expect(inputBox.value).toBe('');
            const styleInputBox = window.getComputedStyle(inputBox);
            expect(styleInputBox.borderBottom).toBe('2px solid red');

            notificationTest("Task cannot be empty!!",'rgb(184, 13, 13)');
            
        });
    
        it('should not add a task if input contains only spaces', () => {
    
            inputBox.value = '   ';
    
            addTask();
    
            const tasks = getLocalStorageItem('tasks');

            expect(tasks).toBeNull();
            notificationTest("Task cannot contain only spaces!",'rgb(184, 13, 13)');
            
        });
    
    
    });

    //*
    describe('ValidateInput function', () => {

        it('should return false if input is empty', () => {

            const inputValue = '';
            const result = validateInput(inputValue);
    
            expect(result).toBe(false);

            notificationTest("Task cannot be empty!!",'rgb(184, 13, 13)');
            
        });
    
        it('should return false if input is only whitespace', () => {
           
            const inputValue = '    ';

            const result = validateInput(inputValue);   
            expect(result).toBe(false);

            notificationTest("Task cannot contain only spaces!",'rgb(184, 13, 13)');
            
        });

        it('should return false if input is valid but not unique', () => {

            const tasks = [
                { id: 1, text: 'Task 1' }
              ];
            setLocalStorageItem('tasks', JSON.stringify(tasks));

            const inputValue = 'Task 1';
            const result = validateInput(inputValue,-1);
    
            expect(result).toBe(false);

            notificationTest("Task already exists!",'rgb(184, 13, 13)');
            
        });

        it('should return false if input is valid but not unique after trim', () => {

            const tasks = [
                { id: 1, text: 'Task 1' }
              ];
            setLocalStorageItem('tasks', JSON.stringify(tasks));

            const inputValue = '   Task 1    ';
    
            const result = validateInput(inputValue,-1);
    
            expect(result).toBe(false);
            
        });

        it('should return false if input is valid but not unique after space characters replace', () => {

            const tasks = [
                { id: 1, text: 'Task 1' }
              ];
            setLocalStorageItem('tasks', JSON.stringify(tasks));

            const inputValue = 'Task           1';
    
            const result = validateInput(inputValue,-1);
    
            expect(result).toBe(false);
            
        });


        it('should return true if input is valid and unique', () => {
            
            const inputValue = 'Valid Task';

            const result = validateInput(inputValue);
    
            expect(result).toBe(true);
            
        });
    
    });

    //*
    describe('IsTaskAlreadyExists Function', () => {

        it('should return false when there are no tasks', () => {
    
            setLocalStorageItem('tasks', JSON.stringify([]));
    
            expect(isTaskAlreadyExists('New Task', -1)).toBeFalsy();
        });

        it('should return false when localStorage does not contain the "tasks" key', () => {
            
            localStorage.removeItem('tasks');
        
            expect(isTaskAlreadyExists('Task 1', -1)).toBeFalsy();
        });
        
        it('should return false when task does not exist', () => {
    
            const tasks = [
              { id: 1, text: 'Task 1' },
              { id: 2, text: 'Task 2' }
            ];
            setLocalStorageItem('tasks', JSON.stringify(tasks));
            
            expect(isTaskAlreadyExists('New Task', -1)).toBeFalsy();
    
        });
        
        it('should return true when task already exists', () => {
    
            const tasks = [
              { id: 1, text: 'Task 1' },
              { id: 2, text: 'Task 2' }
            ];
            setLocalStorageItem('tasks', JSON.stringify(tasks));
            
            expect(isTaskAlreadyExists('Task 1', -1)).toBeTruthy();
    
        });
    
        it('should return true when task already exists but in different case', () => {
            
            const tasks = [
              { id: 1, text: 'tAsK 1' },
              { id: 2, text: 'Task 2' }
            ];
            setLocalStorageItem('tasks', JSON.stringify(tasks));
            
            expect(isTaskAlreadyExists('Task 1', -1)).toBeTruthy();
    
        });
    
        it('should return false when task exists but has the same id', () => {
        
            const tasks = [
              { id: 1, text: 'Task 1' },
              { id: 2, text: 'Task 2' }
            ];
    
            setLocalStorageItem('tasks', JSON.stringify(tasks));
            
            expect(isTaskAlreadyExists('Task 1', 1)).toBeFalsy();
    
        });

        it('should return false when task exists but has the different id', () => {
        
            const tasks = [
              { id: 1, text: 'Task 1' },
              { id: 2, text: 'Task 2' }
            ];
    
            setLocalStorageItem('tasks', JSON.stringify(tasks));
            
            expect(isTaskAlreadyExists('Task 1', 2)).toBeTruthy();
    
        });
    
    });

 

    //*
    describe('CheckBox function', () => {

    
        it('should change the completion status of a task and re-render tasks', () => {

            const taskId = 1;
        
            const initialTask = generateTasks(1, true, false);
            setLocalStorageItem('tasks', JSON.stringify(initialTask));
    
            checkBox(taskId);
    
            const updatedTasks = getLocalStorageItem('tasks');
            const updatedTask = updatedTasks.find(task => task.id === taskId);
            expect(updatedTask.completed).toBe(true); 

            expect(document.querySelector('.atask').style.opacity).toBe('0.6');
            expect(document.querySelector('#edit-1 button[title="Status"]').querySelector('img').src).toContain('img/done.png');
            expect(document.querySelector('#save-1 button[title="Status"]').querySelector('img').src).toContain('img/done.png');
        });

        it('should change the completion status of a task and re-render tasks', () => {
            const taskId = 1;
            const initialTask = generateTasks([taskId], true, true);
            setLocalStorageItem('tasks', JSON.stringify(initialTask));
    
            checkBox(taskId);
    
            const updatedTasks = getLocalStorageItem('tasks');
            const updatedTask = updatedTasks.find(task => task.id === taskId);
            expect(updatedTask.completed).toBe(false); 

            expect(document.querySelector('.atask').style.opacity).toBe('1');
            expect(document.querySelector('#edit-1 button[title="Status"]').querySelector('img').src).toContain('img/notdone.png');
            expect(document.querySelector('#save-1 button[title="Status"]').querySelector('img').src).toContain('img/notdone.png');
        });
        it('should toggle the completion status of a task and re-render tasks', () => {

            const taskId = 1;
            const initialTask = generateTasks([taskId], true, false);
            setLocalStorageItem('tasks', JSON.stringify(initialTask));
    
            checkBox(taskId);
    
            const updatedTasks = getLocalStorageItem('tasks');
            const updatedTask = updatedTasks.find(task => task.id === taskId);
            expect(updatedTask.completed).toBe(true); 

            checkBox(taskId);
    
            const updatedTasks2 = getLocalStorageItem('tasks');
            const updatedTask2 = updatedTasks2.find(task => task.id === taskId);
            expect(updatedTask2.completed).toBe(false); 
        
        });
    
        it('should toggle the completion status of the correct task when multiple tasks exist', () => {
            
            const taskId = 2;
            const initialTask = generateTasks([1,taskId,3], true, false);
            setLocalStorageItem('tasks', JSON.stringify(initialTask));
        
            checkBox(taskId);
        
            const updatedTasks = getLocalStorageItem('tasks');
            const updatedTask = updatedTasks.find(task => task.id === taskId);
            const unUpdatedTask1 = updatedTasks.find(task => task.id === 1);
            const unUpdatedTask3 = updatedTasks.find(task => task.id === 3);

            expect(updatedTask.completed).toBe(true);
            expect(unUpdatedTask1.completed).toBe(false);
            expect(unUpdatedTask3.completed).toBe(false);

        });
    });



    //* 
    describe('Delete Task Function', () => {

        let confirmButton, cancelButton

        beforeEach(() => {

            confirmButton = document.getElementById('confirm-button');
            
            cancelButton = document.getElementById('cancel-button');

            const initialTask = generateTasks(1, true, false);

            setLocalStorageItem('tasks', JSON.stringify(initialTask));
            setLocalStorageItem('taskIdCounter', '1');

            renderTasks();

        });


        it('should delete a task and update localStorage and UI on confirmation', () => {
    
            deleteTask(1);

            confirmButton.click();
    
            const tasks = getLocalStorageItem('tasks');
            expect(tasks).toBeNull;

            
            expect(document.querySelector('#listtask').children.length).toBe(0);
            expect(document.querySelector('#onetask-1')).toBeNull(); 

            notificationTest("Task deleted successfully",'green');
    
        });
    
        it('should cancel deletion and show cancellation message on cancel', () => {
    
            deleteTask(1);

            cancelButton.click();
    
            const tasks = getLocalStorageItem('tasks');
            expect(tasks).toHaveLength(1); 

            expect(document.querySelector('#listtask').children.length).toBe(1);
            expect(document.querySelector('#onetask-1')).toBeTruthy(); 

            notificationTest("Task deletion canceled",'red');
    
    
        });
    
        it('should delete a task correctly when there are multiple tasks', () => {

            const initialTask = generateTasks(3, true, false);
       
            setLocalStorageItem('tasks', JSON.stringify(initialTask));
            setLocalStorageItem('taskIdCounter', '3');
    
            renderTasks();
    
            deleteTask(2);

            confirmButton.click();

            const tasks = getLocalStorageItem('tasks');
            expect(tasks).toHaveLength(2);
            expect(tasks.some(task => task.id === 2)).toBeFalsy(); 
            expect(tasks.some(task => task.id === 1)).toBeTruthy(); 
            expect(tasks.some(task => task.id === 3)).toBeTruthy(); 

            expect(document.querySelector('#listtask').children.length).toBe(2);
            expect(document.querySelector('#onetask-1')).toBeTruthy(); 
            expect(document.querySelector('#onetask-3')).toBeTruthy(); 
            expect(document.querySelector('#onetask-2')).toBeFalsy(); 
        });
      
    });

    

    //*
    describe('ClearTasks Function', () => {

        let confirmButton, cancelButton

        beforeEach(() => {

            const initialTask = generateTasks(2, false, [false,true]);
            
            setLocalStorageItem('tasks', JSON.stringify(initialTask));

            renderTasks();

            confirmButton = document.getElementById('confirm-button');
            cancelButton = document.getElementById('cancel-button');
        });

        it('should display the correct confirmation message for different filters', () => {
            const filters = ['all', 'inprogress', 'completed'];

            filters.forEach(filter => {
                setLocalStorageItem('statusFilter', filter);
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
        
        it('should clear all tasks when filter is "all"', () => {

            setLocalStorageItem('statusFilter', 'all');
            
            clearTasks();

            confirmButton.click();
            
            expect(getLocalStorageItem('tasks')).toBe(null); 

            expect(document.querySelector('#listtask').children.length).toBe(0);
            expect(document.querySelector('#onetask-1')).toBeNull();
            expect(document.querySelector('#onetask-2')).toBeNull();

            notificationTest("All tasks cleared!",'green');

        });

        it('should clear only in-progress tasks when filter is "inprogress"', () => {
            
            setLocalStorageItem('statusFilter', 'inprogress');
            
            clearTasks();

            confirmButton.click();

            const remainingTasks = getLocalStorageItem('tasks');
            expect(remainingTasks.length).toBe(1); 
            expect(remainingTasks[0].completed).toBe(true);
            expect(remainingTasks[0].text).toBe('Task 2');

            setLocalStorageItem('statusFilter', 'all');
            renderTasks();

            expect(document.querySelector('#listtask').children.length).toBe(1);
            expect(document.querySelector('#onetask-2').value).toBe('Task 2');

            notificationTest("Inprogress tasks cleared!",'green');

        });

        it('should clear only completed tasks when filter is "completed"', () => {
            
            setLocalStorageItem('statusFilter', 'completed');

            clearTasks();

            confirmButton.click();

            const remainingTasks = getLocalStorageItem('tasks');
            expect(remainingTasks.length).toBe(1); 
            expect(remainingTasks[0].completed).toBe(false);
            expect(remainingTasks[0].text).toBe('Task 1');

            setLocalStorageItem('statusFilter', 'all');
            renderTasks();

            expect(document.querySelector('#listtask').children.length).toBe(1);
            expect(document.querySelector('#onetask-1').value).toBe('Task 1');

            notificationTest("Completed tasks cleared!",'green');
        });

        it('should cancel clear when cancel button is clicked', () => {

            setLocalStorageItem('statusFilter', 'all');
            
            clearTasks();

            cancelButton.click();
            
            expect(getLocalStorageItem('tasks')).not.toBe(null);

            expect(document.querySelector('#listtask').children.length).toBe(2);
            expect(document.querySelector('#onetask-1').value).toBe('Task 1');
            expect(document.querySelector('#onetask-2').value).toBe('Task 2');

            notificationTest("Task clearing canceled",'red');
        });

        it('should handle case where there are no tasks to clear', () => {
            
            setLocalStorageItem('tasks', JSON.stringify([])); 
            setLocalStorageItem('statusFilter', 'all');
            
            clearTasks();

            confirmButton.click();

            expect(getLocalStorageItem('tasks')).toBeNull();
        });

        
        
        it('should reset taskIdCounter when clearing all tasks', () => {
            setLocalStorageItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }]));
            setLocalStorageItem('taskIdCounter', '5');
            setLocalStorageItem('statusFilter', 'all');
            
            clearTasks();

            confirmButton.click();

            expect(getLocalStorageItem('taskIdCounter')).toBeNull(); 
            expect(getLocalStorageItem('tasks')).toBeNull(); 
        });

    });




    //*
    describe('ToggleEdit Function', () => {

        let inputBox, addButton, clearButton, allEditButtons, radioButtons


        beforeEach(() => {

            inputBox = document.getElementById('input');
            addButton = document.getElementById('add');
            clearButton = document.getElementById('clear');
            allEditButtons = document.querySelectorAll('.editdel button');
            radioButtons = document.querySelectorAll('input[name="taskFilter"]');

            const sampleTasks = generateTasks(1, false, false);
            setLocalStorageItem('tasks', JSON.stringify(sampleTasks));
            setLocalStorageItem('taskIdCounter', '1');
    
            renderTasks();

        })

        it('should enable editing mode for a task', () => {
    
            toggleEdit(1);

            const taskInput = document.querySelector('#onetask-1');
            expect(taskInput).toBeTruthy();
            expect(taskInput.hasAttribute('readonly')).toBe(false);
            expect(taskInput.readOnly).toBe(false);
            expect(taskInput.style.borderBottom).toBe('2px solid #461b80');
            expect(document.activeElement).toBe(taskInput);

            expect(document.querySelector('#save-1').style.display).toBe('flex');
            expect(document.querySelector('#edit-1').style.display).toBe('none');

            expect(inputBox.disabled).toBe(true);
            expect(addButton.disabled).toBe(true);
            expect(clearButton.disabled).toBe(true);
    
            allEditButtons.forEach(button => {
                expect(button.disabled).toBe(true);
            });
    
            radioButtons.forEach(radio => {
                expect(radio.disabled).toBe(true);
            });
        });
    
    
        it('should restore input border style on input event', () => {
    
            toggleEdit(1);
    
            const taskInput = document.querySelector('#onetask-1');
            taskInput.dispatchEvent(new Event('input'));
    
            expect(taskInput.readOnly).toBe(false);
            expect(taskInput.style.borderBottom).toBe('2px solid #461b80');
        });
    
    }); 

    //*
    describe('DisableOtherElements Function', () => {

        let inputBox, addButton, clearButton, allEditButtons, radioButtons

        beforeEach(() => {

            inputBox = document.getElementById('input');
            addButton = document.getElementById('add');
            clearButton = document.getElementById('clear');
            allEditButtons = document.querySelectorAll('.editdel button');
            radioButtons = document.querySelectorAll('input[name="taskFilter"]');

            const sampleTasks = generateTasks(1, false, false);

            setLocalStorageItem('tasks', JSON.stringify(sampleTasks));
    
            renderTasks();


        })

        it('should disable all elements when passed true', () => {
    
            disableOtherElements(true);
    
            expect(inputBox.disabled).toBe(true);
            expect(addButton.disabled).toBe(true);
            expect(clearButton.disabled).toBe(true);
    
            allEditButtons.forEach(button => {
                expect(button.disabled).toBe(true);
            });
    
            radioButtons.forEach(radio => {
                expect(radio.disabled).toBe(true);
            });
        });
    
        it('should enable all elements when passed false', () => {
    
            disableOtherElements(false);
    
            expect(inputBox.disabled).toBe(false);
            expect(addButton.disabled).toBe(false);
            expect(clearButton.disabled).toBe(false);
    
            allEditButtons.forEach(button => {
                expect(button.disabled).toBe(false);
            });
    
            radioButtons.forEach(radio => {
                expect(radio.disabled).toBe(false);
            });
        });
    
    });

    //*
    describe('SaveTask Function', () => {

        let confirmButton, cancelButton,randomValue

        beforeEach(() => {

            confirmButton = document.getElementById('confirm-button');
            cancelButton = document.getElementById('cancel-button');
            

            const sampleTasks = generateTasks(1, true, false);
            randomValue = sampleTasks[0].text;

            setLocalStorageItem('tasks', JSON.stringify(sampleTasks));
            setLocalStorageItem('taskIdCounter', '1');
    
            renderTasks();

        });

        it('should update task text and re-render tasks', () => {
            
    
            const taskInput = document.querySelector('#onetask-1');
            const toEdit = generateRandomString({ length: 10 })
            taskInput.value = toEdit;
            saveTask(1); 
    
            confirmButton.click();
    
            const updatedTasks = getLocalStorageItem('tasks');

            expect(updatedTasks).toHaveLength(1);
            expect(updatedTasks[0].text).toBe(toEdit);
            expect(taskInput.value).toBe(toEdit); 

            expect(document.querySelector('#listtask').children.length).toBe(1);
            expect(document.querySelector('#onetask-1').value).toBe(toEdit); 

            notificationTest("Task updated successfully!",'green');

        });
    
        it('should cancel saving of task text and re-render tasks', () => {
            
    
            const taskInput = document.querySelector('#onetask-1');
            const toEdit = generateRandomString({ length: 10 })
            taskInput.value = randomValue;
            saveTask(1); 
    
            cancelButton.click();
    
            const updatedTasks = getLocalStorageItem('tasks');
            expect(updatedTasks).toHaveLength(1);
            expect(updatedTasks[0].text).toBe(randomValue);
            expect(taskInput.value).toBe(randomValue); 

            expect(document.querySelector('#listtask').children.length).toBe(1);
            expect(document.querySelector('#onetask-1').value).toBe(randomValue); 

            notificationTest("Task saving canceled",'red');

        });
    
        
        it('should not update task text when input empty and re-render tasks', () => {
    
            const taskInput = document.querySelector('#onetask-1');

            taskInput.value = '';
            saveTask(1);
    
            const updatedTasks = getLocalStorageItem('tasks');
            expect(updatedTasks).toHaveLength(1);
            expect(updatedTasks[0].text).toBe(randomValue);
            expect(taskInput.value).toBe(''); 

            notificationTest("Task cannot be empty!!",'rgb(184, 13, 13)');

        });
    
        it('should not update task text when input empty and re-render tasks', () => {
 
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = '     ';
            saveTask(1); 
    
            const updatedTasks = getLocalStorageItem('tasks');
            expect(updatedTasks).toHaveLength(1);
            expect(updatedTasks[0].text).toBe(randomValue);

            notificationTest("Task cannot contain only spaces!",'rgb(184, 13, 13)');
    
        });
    
        it('should not allow saving a task with text that already exists', () => {
     
            const sampleTasks = generateTasks(2, true, false);
            const randomValue1 = sampleTasks[0].text;
            const randomValue2 = sampleTasks[1].text;
            
            setLocalStorageItem('tasks', JSON.stringify(sampleTasks));
            setLocalStorageItem('taskIdCounter', '1');
    
            renderTasks();

            const taskInput1 = document.querySelector('#onetask-1');
            taskInput1.value = randomValue2;
            saveTask(1); 

            confirmButton.click();

            notificationTest("Task already exists!",'rgb(184, 13, 13)');
    
            expect(getLocalStorageItem('tasks')).toEqual(sampleTasks);

            const taskInput2 = document.querySelector('#onetask-2');
            taskInput2.value = randomValue1;
            saveTask(2); 

            confirmButton.click();

            notificationTest("Task already exists!",'rgb(184, 13, 13)');
    
            expect(getLocalStorageItem('tasks')).toEqual(sampleTasks);


    
        });
    
        
        
    });

    //*
    describe('CancelEdit Function', () => {

        let randomValue;

        beforeEach(() => {

            
            const sampleTasks = generateTasks(2, true, false);
            randomValue = sampleTasks[0].text
            setLocalStorageItem('tasks', JSON.stringify(sampleTasks));
            setLocalStorageItem('taskIdCounter', '2');
    
            renderTasks();

        });
    
        it('should restore original task text on cancel edit', () => {
    
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = 'Updated Task Text';
    
            cancelEdit(1); 
            
            expect(taskInput.value).toBe(randomValue);
            expect(document.querySelector('#save-1').style.display).toBe('none');
            expect(document.querySelector('#edit-1').style.display).toBe('flex'); 
        });
    
        it('should not affect other tasks when canceling edit', () => {
            
    
            const taskInput1 = document.querySelector('#onetask-1');
            const taskInput2 = document.querySelector('#onetask-2');
            taskInput1.value = 'Updated Task 1 Text';
            taskInput2.value = 'Updated Task 2 Text';
    
            cancelEdit(1); 
            
            expect(taskInput1.value).toBe(randomValue); 
            expect(taskInput2.value).toBe('Updated Task 2 Text'); 
        });
    
    });

    //*
    describe('ToggleSave function', () => {

        let inputBox, addButton, clearButton, allEditButtons, radioButtons

        beforeEach(() => {

            inputBox = document.getElementById('input');
            addButton = document.getElementById('add');
            clearButton = document.getElementById('clear');
            allEditButtons = document.querySelectorAll('.editdel button');
            radioButtons = document.querySelectorAll('input[name="taskFilter"]');

        });

        it('toggleSave sets task text to readonly and border style to none', () => {

            const sampleTasks = generateTasks(1, true, false);

            setLocalStorageItem('tasks', JSON.stringify(sampleTasks));
            setLocalStorageItem('taskIdCounter', '1');
        
            renderTasks();
        
            const taskText = document.querySelector(`#onetask-1`);
        
            expect(taskText.readOnly).toBe(true);
            
            toggleEdit('1');
        
            expect(taskText.readOnly).toBe(false);
        
            toggleSave('1');
        
            expect(taskText.readOnly).toBe(true);
            expect(taskText.style.borderStyle).toBe('none');

            expect(document.querySelector('#save-1').style.display).toBe('none');
            expect(document.querySelector('#edit-1').style.display).toBe('flex');

            expect(inputBox.disabled).toBe(false);
            expect(addButton.disabled).toBe(false);
            expect(clearButton.disabled).toBe(false);
    
            allEditButtons.forEach(button => {
                expect(button.disabled).toBe(false);
            });
    
            radioButtons.forEach(radio => {
                expect(radio.disabled).toBe(false);
            });

        });
    });

    //*
    describe('ToggleTaskControls function', () => {

        beforeEach(() => {

            const sampleTasks = generateTasks(2, true, false);
            setLocalStorageItem('tasks', JSON.stringify(sampleTasks));
            renderTasks();

        });


        it('should hide the edit div and show the save div', () => {

            toggleTaskControls(1, 'edit', 'save');

            const fromDiv = document.querySelector('#edit-1');
            const toDiv = document.querySelector('#save-1');

            expect(fromDiv.style.display).toBe('none');
            expect(toDiv.style.display).toBe('flex');

        });

    
        it('should hide the save div and show the edit div', () => {
            
            toggleTaskControls(1, 'save', 'edit');
    
            const fromDiv = document.querySelector('#save-1');
            const toDiv = document.querySelector('#edit-1');

            expect(fromDiv.style.display).toBe('none');
            expect(toDiv.style.display).toBe('flex');
        });
    
        it('should handle cases where both elements are initially not visible', () => {

            const fromDiv = document.querySelector('#edit-1');
            fromDiv.style.display = 'none';
            const toDiv = document.querySelector('#save-1');
            toDiv.style.display = 'none';
        
            toggleTaskControls(1, 'edit', 'save');
        
            expect(fromDiv.style.display).toBe('none');
            expect(toDiv.style.display).toBe('flex');
        });
    
        it('should handle cases where both elements are initially visible', () => {
            
        
            const fromDiv = document.querySelector('#edit-1');
            fromDiv.style.display = 'flex';
            const toDiv = document.querySelector('#save-1');
            toDiv.style.display = 'flex';
        
            toggleTaskControls(1, 'edit', 'save');
        
            expect(fromDiv.style.display).toBe('none');
            expect(toDiv.style.display).toBe('flex');
        });

        it('should hide the edit element and show the save element of multiple tasks', () => {

            toggleTaskControls(1, 'edit', 'save');
            toggleTaskControls(1, 'save', 'edit');
            toggleTaskControls(2, 'edit', 'save');
            

            const fromDiv = document.querySelector('#edit-1');
            const toDiv = document.querySelector('#save-1');

            const fromDiv2 = document.querySelector('#edit-2');
            const toDiv2 = document.querySelector('#save-2');
    

            expect(fromDiv.style.display).toBe('flex');
            expect(toDiv.style.display).toBe('none');

            expect(fromDiv2.style.display).toBe('none');
            expect(toDiv2.style.display).toBe('flex');
        });
    });



    //*
    describe('ShowNotification', () => {
    
        let notification;
    
        beforeEach(() => {
            const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
            document.body.innerHTML = html;
            require('./script.js');
    
            notification = document.querySelector('.notification');
    
            jest.useFakeTimers();
        });
    
        afterEach(() => {
            
            jest.useRealTimers();
        });
    
        it('should display the notification with the correct text and color', () => {
            const text = 'Test notification';
            const color = 'red';
            
            showNotification(text, color);
            
            expect(notification.textContent).toBe(text);
            expect(notification.style.backgroundColor).toBe(color);
            expect(notification.style.visibility).toBe('visible');
        });
    
        it('should not hide the notification before the timeout', () => {
            const text = 'Test notification';
            const color = 'red';
            
            showNotification(text, color);
            
            jest.advanceTimersByTime(2999);
            
            expect(notification.textContent).toBe(text);
            expect(notification.style.backgroundColor).toBe(color);
            expect(notification.style.visibility).toBe('visible');
        });
    
        it('should hide the notification after the timeout', () => {
            const text = 'Test notification';
            const color = 'red';
            
            showNotification(text, color);
            
            jest.advanceTimersByTime(3000);
            
            expect(notification.textContent).toBe('');
            expect(notification.style.visibility).toBe('hidden');
        });
       
        it('should display the notification with default text and color when no parameters are provided', () => {
            showNotification();
            
            expect(notification.textContent).toBe('Notification');
            expect(notification.style.backgroundColor).toBe('blue');
            expect(notification.style.visibility).toBe('visible');
        });
    
        it('should display the notification with default text when color is not provided', () => {
            showNotification('Custom message');
            
            expect(notification.textContent).toBe('Custom message');
            expect(notification.style.backgroundColor).toBe('blue');
            expect(notification.style.visibility).toBe('visible');
        });
    
        it('should display the notification with default color when text is not provided', () => {
            showNotification(undefined, 'red');
            
            expect(notification.textContent).toBe('Notification');
            expect(notification.style.backgroundColor).toBe('red');
            expect(notification.style.visibility).toBe('visible');
        });
    
    });

    //*
    describe('ShowToast', () => {

        let mockOnConfirm, mockOnCancel, toastContainer, messageText, confirmButton, cancelButton;

        beforeEach(() => {
            
            mockOnConfirm = jest.fn();
            mockOnCancel = jest.fn();
            toastContainer = document.getElementById('toast-container');
            messageText = document.getElementById('message-text');
            confirmButton = document.getElementById('confirm-button');
            cancelButton = document.getElementById('cancel-button');
    
            jest.useFakeTimers();
    
        });
    
        afterEach(() => {
            jest.useRealTimers();
        });
    
        it('should display toast with correct message', () => {

            showToast('Test message', mockOnConfirm, mockOnCancel);
    
            expect(toastContainer.style.display).toBe('flex');
            expect(messageText.textContent).toBe('Test message');
        });
    
        it('should call onConfirm and hide toast when confirm button is clicked', () => {

            showToast('Test message', mockOnConfirm, mockOnCancel);

            confirmButton.click();
    
            expect(mockOnConfirm).toHaveBeenCalled();
            expect(toastContainer.style.display).toBe('none');
        });
    
        it('should call onCancel and hide toast when cancel button is clicked', () => {
            showToast('Test message', mockOnConfirm, mockOnCancel);
    
            cancelButton.click();
    
            expect(mockOnCancel).toHaveBeenCalled();
            expect(toastContainer.style.display).toBe('none');
        });
    
        it('should keep the toast visible if no interaction occurs', () => {
            const mockOnConfirm = jest.fn();
            const mockOnCancel = jest.fn();
        
            showToast('Test message', mockOnConfirm, mockOnCancel);
        
            const toastContainer = document.getElementById('toast-container');
            expect(toastContainer.style.display).toBe('flex');
        
            jest.advanceTimersByTime(5000);
            expect(toastContainer.style.display).toBe('flex');
        });
    
    });

    //*
    describe('ToggleToast Function', () => {

        let toastContainer

        beforeEach(() => {

            toastContainer = document.querySelector('#toast-container');

        });

        it('should show the toast container when visible is true', () => {
    
            toggleToast(true);
    
            expect(toastContainer.style.display).toBe('flex');
        });
    
        it('should hide the toast container when visible is false', () => {
    
            toggleToast(false);
    
            expect(toastContainer.style.display).toBe('none');
        });
    
        it('should handle toggling between visible and hidden states correctly', () => {
    
            toggleToast(true);
            expect(toastContainer.style.display).toBe('flex');
    
            toggleToast(false);
            expect(toastContainer.style.display).toBe('none');
    
            toggleToast(true);
            expect(toastContainer.style.display).toBe('flex');
        });
    
        it('should handle undefined and null input gracefully', () => {
            
            toggleToast(undefined);
            expect(toastContainer.style.display).toBe('none');
            
            toggleToast(null);
            expect(toastContainer.style.display).toBe('none');
        });
        
    
    });

    

});

describe('Integration Tests', () => {


    let form,addButton,taskList,countText,inputBox;

    const addTask = (taskText) => {
        inputBox.value = taskText;
        fireEvent.submit(form);
    };

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, './css/style.css'), 'utf8');

        document.body.innerHTML = html;

        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);

        require('./script.js');

        inputBox = document.querySelector('#input');
        form = document.querySelector('form');
        addButton = document.querySelector('#add');
        taskList = document.querySelector('#listtask');
        countText = document.querySelector('.count h3');

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
    });

    afterEach(() => {
        localStorage.clear();
    });



describe('Adding a Task', () => {

    it('should add a task and display in UI', () => {

        expect(document.activeElement).not.toBe(inputBox);

        expect(inputBox.value).toBe('');
        expect(taskList.textContent).toBe('');

        addTask('New Task');
    
        const tasks = getLocalStorageItem('tasks');
        const filter = getLocalStorageItem('statusFilter');
        const taskIdCounter =getLocalStorageItem('taskIdCounter');

        expect(tasks).toHaveLength(1);
        expect(filter).toBe('all');
        expect(taskIdCounter).toBe(1);

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

        notificationTest("Task added successfully",'green');

        expect(document.activeElement).toBe(inputBox);
        expect(inputBox.value).toBe('');

    });

    

    it('should add two new tasks and display in UI ', () => {

        expect(document.activeElement).not.toBe(inputBox);

        expect(inputBox.value).toBe('');
        expect(taskList.textContent).toBe('');

        addTask('Task 1');

        addTask('Task 2');

        const tasks = getLocalStorageItem('tasks');
        const filter = getLocalStorageItem('statusFilter');
        const taskIdCounter =getLocalStorageItem('taskIdCounter');

        expect(tasks).toHaveLength(2);
        expect(filter).toBe('all');
        expect(taskIdCounter).toBe(2);

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

        notificationTest("Task added successfully",'green');

        expect(document.activeElement).toBe(inputBox);
        expect(inputBox.value).toBe('');
    });


    it('should add a new task with leading and trailing spaces after trimming', () => {
    
        addTask('    Task     ');
    
        const tasks = getLocalStorageItem('tasks');
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('Task');
    });

    it('should not add an empty task', () => {

        addTask('');
    
        const tasks = getLocalStorageItem('tasks');
        expect(tasks).toBeNull();

        notificationTest("Task cannot be empty!!",'rgb(184, 13, 13)');

        inputBox.dispatchEvent(new Event('input'));
        const style = window.getComputedStyle(inputBox);
        expect(style.borderBottom).toBe('');

    });

    it('should not add a task with only spaces', () => {
    
        addTask('   ');
    
        const tasks = getLocalStorageItem('tasks');
        expect(tasks).toBeNull();

        notificationTest("Task cannot contain only spaces!",'rgb(184, 13, 13)');

        inputBox.dispatchEvent(new Event('input'));
        const style = window.getComputedStyle(inputBox);
        expect(style.borderBottom).toBe('');
    });

    it('should not add an existing task', () => {

        addTask('Task 1');

        addTask('Task 1');

        const tasks = getLocalStorageItem('tasks');
        expect(tasks).toHaveLength(1);
        
        notificationTest("Task already exists!",'rgb(184, 13, 13)');

        const displayedTasks = document.querySelectorAll('.eachtask input[type="text"]');
        expect(displayedTasks).toHaveLength(1);
        expect(displayedTasks[0].value).toBe('Task 1');

        inputBox.dispatchEvent(new Event('input'));
        const style = window.getComputedStyle(inputBox);
        expect(style.borderBottom).toBe('');
    });
});


describe('filter a Task', () => {


    it('should filter tasks based on status', () => {

        addTask('Task 1');

        addTask('Task 2');
        
        addTask('Task 3');

        const tasks = getLocalStorageItem('tasks');
        tasks[1].completed = true;
        setLocalStorageItem('tasks', JSON.stringify(tasks));
    
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

        addTask('Task to be deleted');
    
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;
    
        const deleteButton = document.querySelector(`#edit-${taskId} button[title="Delete Task"]`);
        deleteButton.click();
    
        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
    
        const updatedTasks = getLocalStorageItem('tasks');
        expect(updatedTasks).toHaveLength(0);
    });

    it('should cancel deletion of task', () => {
    
        addTask('Task to be deleted');
    
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;
    
        const deleteButton = document.querySelector(`#edit-${taskId} button[title="Delete Task"]`);
        deleteButton.click();
    
        
        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();
    
        const updatedTasks = getLocalStorageItem('tasks');
        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].text).toBe('Task to be deleted');
    });







});

describe('Editing a Task', () => {


    it('should edit a task', () => {
    
        addTask('Task to be edited');
    
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;

        const aTask = document.querySelector(`#onetask-1`)

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('Task to be edited');
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editBox =  document.querySelector(`#onetask-${taskId}`);
        editBox.value = 'Task edited';

        fireEvent.input(editBox);

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
        
    
        const updatedTasks = getLocalStorageItem('tasks');
        expect(updatedTasks[0].text).toBe('Task edited');

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('Task edited');

        
    });


    it('should cancel edit a task after editing', () => {

    
        addTask('Task to be edited');
    
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Task edited';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();

        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();
    
        const updatedTasks = getLocalStorageItem('tasks');
        expect(updatedTasks[0].text).toBe('Task to be edited');

        const aTask = document.querySelector(`#onetask-1`);

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('Task to be edited');

        
    });

    it('should not edit a task that is empty', () => {
    
        addTask('Task to be edited');
    
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = '';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot be empty!!');
    
        const updatedTasks = getLocalStorageItem('tasks');
        expect(updatedTasks[0].text).toBe('Task to be edited');

        const aTask = document.querySelector(`#onetask-1`)

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('');

        
    });

    it('should not edit a task to a task that already exists', () => {

        addTask('Existing Task');

        addTask('Task to be edited');
    
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[1].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Existing Task';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task already exists!');
    
        const updatedTasks = getLocalStorageItem('tasks');
        expect(updatedTasks[0].text).toBe('Existing Task');

        const aTask = document.querySelector(`#onetask-1`)

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(2);
        expect(aTask.value).toBe('Existing Task');

        
    });

    it('should not be able to edit completed task', () => {

        addTask('Task 1');
        
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click();

        
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Cannot edit completed task!');

        const aTask = document.querySelector(`#onetask-1`)

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('Task 1');


         
    });



});

describe('Cancel editing of Task', () => {

    it('should cancel edit a task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');

        addTask('Task to be edited');
    
        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Task edited';

        const cancelButton = document.querySelector(`#save-${taskId} button[title="Cancel Edit"]`);
        cancelButton.click();
    
        const updatedTasks = getLocalStorageItem('tasks');
        expect(updatedTasks[0].text).toBe('Task to be edited');

        const aTask = document.querySelector(`#onetask-1`)

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('Task to be edited');
    
    });


});

describe('Change completed status', () => {


    it('should change completed status when clicked', () => {

        addTask('Task 1');

        const tasks = getLocalStorageItem('tasks');
        expect(tasks[0].completed).toBeFalsy();
        
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()

        const tasksComplete = getLocalStorageItem('tasks');
        expect(tasksComplete[0].completed).toBeTruthy();  
    });

    it('should change completed status when clicked', () => {

        addTask('Task 1');

        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()
        checkButton.click()

        const tasksComplete = getLocalStorageItem('tasks');
        expect(tasksComplete[0].completed).toBeFalsy();  
    });

});

describe('Clear tasks', () => {

    it('should clear all tasks', () => {

        addTask('Task 1');
        
        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasks = getLocalStorageItem('tasks');
        expect(tasks).toBeNull();
        expect(taskList.textContent).toBe('');
        

    });

    it('should not clear all tasks when canceled', () => {

        addTask('Task 1');
        
        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();

        const tasks = getLocalStorageItem('tasks');
        expect(tasks[0].text).toBe('Task 1');

        const aTask = document.querySelector(`#onetask-1`)

        expect(taskList.textContent).not.toBeNull();
        expect(taskList.children).toHaveLength(1);
        expect(aTask.value).toBe('Task 1');



    });

    it('should clear In Progress tasks', () => {

        addTask('Task 1');

        addTask('Task 2');

        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()
        
        const inProgressFilter = document.querySelector('input[name="taskFilter"][value="inprogress"]');
        inProgressFilter.click();

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasksclear = getLocalStorageItem('tasks');
        expect(tasksclear).toHaveLength(1);
        expect(tasksclear[0].text).toBe('Task 1')

    });

    it('should clear Completed tasks', () => {    
        
        addTask('Task 1');

        addTask('Task 2');

        const tasks = getLocalStorageItem('tasks');
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()

        const completedFilter = document.querySelector('input[name="taskFilter"][value="completed"]');
        completedFilter.click();

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasksclear = getLocalStorageItem('tasks');
        expect(tasksclear).toHaveLength(1);
        expect(tasksclear[0].text).toBe('Task 2')
        
        

    });

});

});




