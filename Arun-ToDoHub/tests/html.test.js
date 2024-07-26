const fs = require('fs');
const path = require('path');



beforeEach(() => {
        // Load HTML and CSS
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/style.css'), 'utf8');
        
        document.body.innerHTML = html;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
        
        
        
        jest.resetModules();
        
        // Mock localStorage
        const mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => (store[key] = value.toString()),
                clear: () => (store = {}),
                removeItem: (key) => delete store[key],
            };
        })();
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
        });
        
        // Clear any previous tasks
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

describe('HTML-File Section', () => {

    it('should have font family as "Arial,sans-serif"', () => {
        const file = document.querySelector('*');
        const style = window.getComputedStyle(file);

        expect(file).toBeTruthy();
        expect(style.fontFamily).toBe('Arial,sans-serif'); 
    });
});

describe('HTML-Body Section', () => {

    it('should have a body tag', () => {
        const body = document.querySelector('body');
        expect(body).toBeTruthy();
    });
    
    it('should have a main div', () => {
        const body = document.querySelector('body');
        const mainDiv = document.querySelector('.main');

        expect(body.contains(mainDiv)).toBe(true);
    });

    it('should have a notification message', () => {
        const body = document.querySelector('body');
        const noti = document.querySelector('p');

        expect(body.contains(noti)).toBe(true);
    });

    it('should have a toast div', () => {
        const body = document.querySelector('body');
        const toastDiv = document.querySelector('#toast-container');

        expect(body.contains(toastDiv)).toBe(true);
    });

    it('should have a script tag', () => {
        const body = document.querySelector('body');
        const script = document.querySelector('script');

        expect(body.contains(script)).toBe(true);
    });
});

describe('HTML-Main Section', () => {

    it('should have a div with class name "main"', () => {
        const mainDiv = document.querySelector('.main');
        const styles = window.getComputedStyle(mainDiv);

        expect(mainDiv).toBeTruthy();
        expect(styles.backgroundImage).toBe("url(../img/back2.jpg)");
    });
});

describe('HTML-ToDo Section', () => {

    it('should have a div with class name "todo"', () => {
        const todoDiv = document.querySelector('.todo');
        const styles = window.getComputedStyle(todoDiv);

        expect(todoDiv).toBeTruthy();
        expect(styles.backgroundColor).toBe('rgba(212, 174, 236, 0.801)');      
    });
});

describe('HTML-Header Section', () => {

    it('should have a header', () => {
        const header = document.querySelector('header');

        expect(header).toBeTruthy();
    });

    it('should have a h1 inside header', () => {
        const header = document.querySelector('header');
        const h1Element = header.querySelector('h1');

        expect(header.contains(h1Element)).toBe(true);
    });

    it('should have a header with text "To-Do Planner!"', () => {
        const header = document.querySelector('header');
        const h1Element = document.querySelector('header h1');
        const styles = window.getComputedStyle(header);

        expect(h1Element.textContent).toBe('To-Do Planner!');
        expect(styles.color).toBe('rgb(63, 20, 119)');
    
    });
});

describe('HTML-Task Input Section', () => {

    
    it('should have a div with class name "taskfield"', () => {
        const taskFieldDiv = document.querySelector('.taskfield');
        expect(taskFieldDiv).toBeTruthy();
    });

    it('should have a div with class name "taskinput"', () => {
        const taskInputDiv = document.querySelector('.taskinput');
        expect(taskInputDiv).toBeTruthy();
    });

    it('should have a form tag inside taskinput', () => {
        const taskInputDiv = document.querySelector('.taskinput');
        const form= taskInputDiv.querySelector('form');

        expect(taskInputDiv.contains(form)).toBe(true);
    });


    it('should have a input and button tag inside form', () => {
        const form= document.querySelector('form');
        const inputField = form.querySelector('#input');
        const addBtn= form.querySelector('#add');

        expect(form.contains(inputField) && form.contains(addBtn)).toBe(true);
    });

    it('should have a input field with attributes "type:text, id:input" ', () => {
        const inputField = document.querySelector('form input');
        
        expect(inputField.getAttribute('type')).toBe('text');
        expect(inputField.getAttribute('id')).toBe('input');
        
    });

    it('should have a placeholder as "Enter your tasks..."', () => {
        const inputField = document.querySelector('form input');
    
        expect(inputField.getAttribute('placeholder')).toBe('Enter your tasks...');   
    });

    it('should have autocomplete off and maximum length 150 for input field', () => {
        const inputField = document.querySelector('form input');

        expect(inputField.getAttribute('autocomplete')).toBe('off');  
        expect( inputField.getAttribute('maxlength')).toBe('150'); 
    });

    it('should have a empty value "" in input field ', () => {
        const inputField = document.querySelector('form input');

        expect(inputField.textContent).toBe('');
        
    });

    it('should have a add button with attributes "type:submit, id:add, title:Add" ', () => {
        const addBtn = document.querySelector('#add');
        
        expect(addBtn.getAttribute('type')).toBe('submit');
        expect(addBtn.getAttribute('id')).toBe('add');
        expect(addBtn.getAttribute('title')).toBe('Add');
    });

    it('should have a image for add button', () => {
        const addBtn= document.querySelector('#add');
        const addBtnImg = addBtn.querySelector('img');
        

        expect(addBtn.contains(addBtnImg)).toBe(true);
    });

    it('should have a add button image with attributes "source alt:add icon" ', () => {
        
        const addBtnImg= document.querySelector('#add img');

        expect(addBtnImg.getAttribute('src')).toBe('img/taskadd.png');
        expect(addBtnImg.getAttribute('alt')).toBe('add icon'); 
    });

});

describe('HTML-Task Filter Section', () => {

    it('should have a div with class name "tasktext"', () => {
        const taskTextDiv = document.querySelector('.tasktext');
        expect(taskTextDiv).toBeTruthy();
    });

    it('should have a div with class name "taskfilterclr"', () => {
        const taskFilterClr = document.querySelector('.taskfilterclr');
        expect(taskFilterClr).toBeTruthy();
    });

    it('should have input type as radio buttons with name "taskFilter" ', () => {
        const taskFilterInputs = document.querySelectorAll('.taskfilterclr input')

        taskFilterInputs.forEach((input) => {
    
            expect(input.getAttribute('type')).toBe('radio');
            expect(input.getAttribute('name')).toBe('taskFilter');
        });
    });

    //? All Button
    it('should have all button and label inside taskfilterclr', () => {
        const taskFilterClr = document.querySelector('.taskfilterclr');
        const allRadioBtn = taskFilterClr.querySelector('#all');
        const allRadioLabel= taskFilterClr.querySelector('#labelall');

        expect(allRadioBtn).toBeTruthy();
        expect(allRadioLabel).toBeTruthy();
        expect(taskFilterClr.contains(allRadioBtn) && taskFilterClr.contains(allRadioLabel)).toBe(true);
    });

    it('should have `all` input button with the attributes "value:all" and onchange parameter as "all"', () =>{
        const allRadioBtn = document.querySelector('#all'); 

        expect(allRadioBtn.getAttribute('value')).toBe('all');
    });

    it('should have `all` label text content as "All" and attributes as "for:all, title:All" ', () => {
        const allRadioLabel= document.querySelector('#labelall');
        
        expect(allRadioLabel.textContent).toBe('All');
        expect(allRadioLabel.getAttribute('for')).toBe('all');
        expect(allRadioLabel.getAttribute('title')).toBe('All');
    });

    //? In Progress Button
    it('should have In Progress button and label inside taskfilterclr', () => {
        const taskFilterClr = document.querySelector('.taskfilterclr');
        const inprogressRadioBtn = taskFilterClr.querySelector('#inprogress');
        const inprogressRadioLabel= taskFilterClr.querySelector('#labelinprogress');

        expect(inprogressRadioBtn).toBeTruthy();
        expect(inprogressRadioLabel).toBeTruthy();
        expect(taskFilterClr.contains(inprogressRadioBtn) && taskFilterClr.contains(inprogressRadioLabel)).toBe(true);
    });

    it('should have `in progress` input button with the attributes "value:inprogress" and onchange parameter as "inprogress"', () =>{
        const inprogressRadioBtn = document.querySelector('#inprogress'); 

        expect(inprogressRadioBtn.getAttribute('value')).toBe('inprogress');
    });

    it('should have `inprogress` label text content as "inprogress" and attributes as "for:inprogress, title:inprogress" ', () => {
        const inprogressRadioLabel= document.querySelector('#labelinprogress');
        
        expect(inprogressRadioLabel.textContent).toBe('In Progress');
        expect(inprogressRadioLabel.getAttribute('for')).toBe('inprogress');
        expect(inprogressRadioLabel.getAttribute('title')).toBe('In Progress');
    });

    //? Completed Button
    it('should have complete button and label inside taskfilterclr', () => {
        const taskFilterClr = document.querySelector('.taskfilterclr');
        const completedRadioBtn = taskFilterClr.querySelector('#completed');
        const completedRadioLabel= taskFilterClr.querySelector('#labelcompleted');

        expect(completedRadioBtn).toBeTruthy();
        expect(completedRadioLabel).toBeTruthy();
        expect(taskFilterClr.contains(completedRadioBtn) && taskFilterClr.contains(completedRadioLabel)).toBe(true);
    });

    it('should have `in progress` input button with the attributes "value:completed" and onchange parameter as "completed"', () =>{
        const completedRadioBtn = document.querySelector('#completed'); 

        expect(completedRadioBtn.getAttribute('value')).toBe('completed');   
    });

    it('should have `completed` label text content as "completed" and attributes as "for:completed, title:completed" ', () => {
        const completedRadioLabel= document.querySelector('#labelcompleted');
        
        expect(completedRadioLabel.textContent).toBe('Completed');
        expect(completedRadioLabel.getAttribute('for')).toBe('completed');
        expect(completedRadioLabel.getAttribute('title')).toBe('Completed');
    });
});

describe('HTML-No Tasks Section', () => {    

    it('should have a div with class name "notasks" with display as none', () => {
        const noTasksDiv = document.querySelector('.notasks');
        expect(noTasksDiv).toBeTruthy();
        
    });

    it('should have a div with class name "notasks"', () => {
        const noTaskContentDiv = document.querySelector('.notaskcontent');
        expect(noTaskContentDiv).toBeTruthy();
    });

    it('should have a image and h2 tag inside notaskcontent', () => {
        const noTaskContentDiv = document.querySelector('.notaskcontent');
        const noTaskImg = noTaskContentDiv.querySelector('img');
        const noTaskText = noTaskContentDiv.querySelector('h2');

        expect(noTaskContentDiv.contains(noTaskImg)).toBe(true);
        expect(noTaskContentDiv.contains(noTaskText)).toBe(true);
    });

    it('should have a no task image with attributes "source alt:notask image" ', () => {
        
        const noTaskImg = document.querySelector('.notaskcontent img');

        expect(noTaskImg.getAttribute('src')).toBe('img/notask.png');
        expect(noTaskImg.getAttribute('alt')).toBe('notask image'); 
    });


    it('should have a content with text "Add tasks to begin!!"', () => {
        const noTaskText = document.querySelector('.notaskcontent h2');
        expect(noTaskText.textContent).toBe('Add tasks to begin!!');
    });

    
});

describe('HTML-Task List Section', () => {

    it('should have a div with class name "tasklist"', () => {
        const taskListDiv = document.querySelector('.tasklist');
        expect(taskListDiv).toBeTruthy();
    });

    it('should have a div with class name "tasklist"', () => {
        const taskDisplayDiv = document.querySelector('.taskdisplay');
        expect(taskDisplayDiv).toBeTruthy();
    });

    it('should have a ul with id "listtask"', () => {
        const ul = document.querySelector('#listtask');
        expect(ul).toBeTruthy();
    });

    it('should have a ul as child of taskdisplay', () => {
        const taskDisplayDiv = document.querySelector('.taskdisplay');
        const ul = document.querySelector('ul');
        
        expect(taskDisplayDiv.contains(ul)).toBe(true);
    });


});

describe('HTML-Task Count and Clear Section', () => {

    it('should have a div with class name "clear"', () => {
        const clearDiv = document.querySelector('.clear');
        expect(clearDiv).toBeTruthy();
    });

    it('should have a div with class name "count"', () => {
        const countDiv = document.querySelector('.count');
        expect(countDiv).toBeTruthy();
    });

    it('should have a h3 as child of count', () => {
        const countDiv = document.querySelector('.count');
        const h3Element = document.querySelector('h3');
        
        expect(countDiv.contains(h3Element)).toBe(true);
    });

    it('should have a text content of h3 as "You have no tasks here!"', () => {
        const h3Element = document.querySelector('h3');
        expect(h3Element.textContent).toBe('You have no tasks here!');
    });

    it('should have a button with id "clear"', () => {
        const clearBtn = document.querySelector('.clear #clear');
        expect(clearBtn).toBeTruthy();
    });

    it('should have a clear button with attributes "title:Clear, onclick function: clearTask" ', () => {
        const clearBtn = document.querySelector('.clear #clear');

        expect(clearBtn.getAttribute('title')).toBe('Clear'); 
    });

    it('should have a text content of clear button as "Clear Tasks"', () => {
        const clearBtn = document.querySelector('.clear #clear');
        expect(clearBtn.textContent).toBe('Clear Tasks');
    });
});

describe('HTML-Notification Message Section', () => {

    it('should have a paragraph tag', () => {
        const notiTag = document.querySelector('body p');
        const style = window.getComputedStyle(notiTag);

        expect(notiTag).toBeTruthy();
        expect(notiTag.getAttribute('class')).toBe('notification');
        expect(style.visibility).toBe('hidden');
    });

    it('should not contain any text content', () => {
        const notiTag = document.querySelector('body p');
        expect(notiTag.textContent).toBe('');
    })

});

describe('HTML-Toast Message Section', () => {

    it('should have a div with class name "toast-container"', () => {
        const toastDiv = document.querySelector('#toast-container');
        expect(toastDiv).toBeTruthy();
    });

    it('should have a div with class name "toast-message"', () => {
        const toastMsgDiv = document.querySelector('.toast-message');
        expect(toastMsgDiv).toBeTruthy();
    });

    it('should have span and button container as child of toast-message', () => {
        const toastMsgDiv = document.querySelector('.toast-message');
        const toastSpan = document.querySelector('#message-text');
        const toastBtn = document.querySelector('.button-container');
        
        expect(toastMsgDiv.contains(toastSpan)).toBe(true);
        expect(toastMsgDiv.contains(toastBtn)).toBe(true);
    });

    it('should have confirm and cancel button in toast-message', () => {
        const toastBtn = document.querySelector('.button-container');
        const confirmBtn = document.querySelector('#confirm-button');
        const CancelBtn = document.querySelector('#cancel-button');
        
        expect(toastBtn.contains(confirmBtn)).toBe(true);
        expect(toastBtn.contains(CancelBtn)).toBe(true);
    });

    it('should have h3 tags inside button', () => {
        const toastBtn = document.querySelector('.button-container button');
        const h3 = document.querySelector('.button-container h3')

        expect(toastBtn.contains(h3)).toBe(true);
        expect(toastBtn.contains(h3)).toBe(true);
    
    });

    it('should have confirm and cancel button content as yes and no', () => {
        const confirmBtn = document.querySelector('#confirm-button');
        const CancelBtn = document.querySelector('#cancel-button');
        
        expect(confirmBtn.textContent).toBe('Yes');
        expect(CancelBtn.textContent).toBe('No');
    });  
});

describe('HTML-Script Section', () => {

    it('should have the source file', () => {
        const script = document.querySelector('script');
        expect(script.getAttribute('src')).toBe('script.js');
    });
});