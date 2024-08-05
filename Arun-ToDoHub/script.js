const inputBox = document.querySelector('#input') //? Task input field

let taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 0; //? ID counter variable for tasks

document.addEventListener('DOMContentLoaded', () => { 
    const savedFilter = localStorage.getItem('statusFilter') || 'all';
    document.querySelector(`input[value="${savedFilter}"]`).checked = true;
    renderTasks(savedFilter); 
});

document.querySelectorAll('input[name="taskFilter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const filter = e.target.value;
        localStorage.setItem('statusFilter', filter); //? Store filter value in Local Storage
        renderTasks(filter);
    });
});

inputBox.addEventListener('blur', () => {
    inputBox.style.borderBottom = 'none'; // Remove border style when not focused
});

inputBox.addEventListener('input', () => {
    inputBox.style.borderBottom = 'none'; // Remove border style when typed
});

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

document.querySelectorAll('input[name="taskFilter"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        filterTasks(event.target.value);
    });
});

document.getElementById('clear').addEventListener('click', clearTasks);


//* Render Cluster

//!
function renderTasks() {

    const allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    const filter = localStorage.getItem('statusFilter') || 'all';

    clearTaskList(); //! Fn\
    toggleTaskListVisibility(allTasks); //! Fn
    displayTaskCounts(allTasks, filter); //! Fn

    let filteredTasks = filterTasks(allTasks, filter); //! Fn
    
    filteredTasks.forEach(task => {
        renderEachTask(task); //! Fn
    });   
}

//?
function clearTaskList() {

    const taskList = document.querySelector('#listtask');
    taskList.innerHTML = '';
}

//?
function displayTaskCounts(tasks, filter) {

    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = totalTasks - inProgressTasks;

    const taskCountText = document.querySelector('.count h3');

    switch (filter) {
        case 'inprogress':
            if (inProgressTasks === 0) {
                taskCountText.textContent = "You have no tasks to do!";
            } else {
                taskCountText.textContent = inProgressTasks === 1 ? `You have ${inProgressTasks} task to do!` : `You have ${inProgressTasks} tasks to do!`;
            }
            break;
        case 'completed':
            if (completedTasks === 0) {
                taskCountText.textContent = "You have not completed any tasks!";
            } else {
                taskCountText.textContent = completedTasks === 1 ? `You have completed ${completedTasks} task!` : `You have completed ${completedTasks} tasks!`;
            }
            break;
        case 'all':
            if (totalTasks === 0) {
                taskCountText.textContent = "You have no tasks here!";
            } else {
                taskCountText.textContent = totalTasks === 1 ? `You have a total of ${totalTasks} task!` : `You have a total of ${totalTasks} tasks!`;
            }
            break;
        default:
            taskCountText.textContent = "You have no tasks here!";
    }
}

//?
function filterTasks(tasks, filter) {

    switch (filter) {
        case 'inprogress':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

//!
function renderEachTask(task) {

    const taskList = document.querySelector('#listtask');
    let aTask = createTaskElement(task); //! Fn
    taskList.appendChild(aTask);
    //taskList.prepend(aTask); 

}

//?
function createTaskElement(task) {
    let aTask = document.createElement("div"); 
    aTask.classList.add("atask"); 
    aTask.style.opacity = task.completed ? '0.6' : '1';

    let taskHTML = `
        <div class="eachtask">
            <input type="text" id="onetask-${task.id}" value="${task.text}" maxlength="150" readonly="true"> 
        </div>
        <div class="editdel" id="edit-${task.id}">
            <button id="checkbox-${task.id}" title="Status">
                <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
            </button>
            <button title="Edit Task">
                <img src="img/edit.png" alt="edit icon">
            </button> <!-- Edit button -->
            <button title="Delete Task">
                <img src="img/delete.png" alt="delete icon">
            </button> <!-- Delete button -->
        </div>
        <div class="savecancel" id="save-${task.id}" style="display:none">
            <button id="checkbox-${task.id}" title="Status" disabled="true">
                <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
            </button>
            <button title="Save Task">
                <img src="img/save.png" alt="save icon">
            </button> <!-- Save button -->
            <button title="Cancel Edit">
                <img src="img/wrong.png" alt="cancel icon">
            </button> <!-- Cancel button -->
        </div>
    `;
    
    aTask.innerHTML = taskHTML;

    aTask.querySelector(`#checkbox-${task.id}`).addEventListener('click', () => checkBox(task.id));
    aTask.querySelector('button[title="Delete Task"]').addEventListener('click', () => deleteTask(task.id));
    aTask.querySelector('button[title="Save Task"]').addEventListener('click', () => saveTask(task.id));
    aTask.querySelector('button[title="Cancel Edit"]').addEventListener('click', () => cancelEdit(task.id));
    aTask.querySelector('button[title="Edit Task"]').addEventListener('click', () => {
        if (!task.completed){
            toggleEdit(task.id)
        }else{
            showNotification('Cannot edit completed task!')
        }
    });

    return aTask;
}

//?
function toggleTaskListVisibility(tasks) {

    const noTasks = document.querySelector('.notasks'); 
    const showtask = document.querySelector('.tasklist'); 
    const taskActions = document.querySelector('.tasktext'); 
    const countText = document.querySelector('.clear'); 
    const taskCountText = document.querySelector('.count h3');


    if (tasks.length === 0) {
        noTasks.style.display = 'flex'; 
        showtask.style.display = 'none'; 
        taskActions.style.display = 'none';
        countText.style.display = 'none';
    } else {
        noTasks.style.display = 'none'; 
        showtask.style.display = 'flex'; 
        taskActions.style.display = 'flex';
        countText.style.display = 'flex';
    }

}

//* Add Cluster

//!
function addTask() {

    const inputBox = document.querySelector('#input');
    const inputValue = inputBox.value;

    if (!validateInput(inputValue)) { //! Fn
        inputBox.value = "";
        inputBox.style.borderBottom = '2px solid red';
        inputBox.focus();
        return;
    }

    let task = {
        id: ++taskIdCounter,
        text: inputBox.value.trim().replace(/\s+/g, ' '),
        completed: false
    };

    let allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    allTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    localStorage.setItem('taskIdCounter', taskIdCounter);
    localStorage.setItem('statusFilter', 'all');

    showNotification('Task added successfully', 'green'); //! Fn
    const statusFilter = document.querySelector('input[name="taskFilter"][value="all"]');
    statusFilter.checked = true;
    
    renderTasks(); //! Fn

    inputBox.value = "";
    inputBox.focus();
}

//?
function validateInput(taskText, currentId = -1) {

    if (taskText === '') {
        showNotification('Task cannot be empty!!', '#b80d0d'); //! Fn
        return false;
    } else if (taskText.replace(/\s+/g, ' ') === ' ') {
        showNotification('Task cannot contain only spaces!', '#b80d0d'); //! Fn
        return false;
    } else if (isTaskAlreadyExists(taskText.trim().replace(/\s+/g, ' '), currentId)) {
        showNotification('Task already exists!', '#b80d0d'); //! Fn
        return false;
    }
    return true;
}

//?
function isTaskAlreadyExists(taskText, currentId) { 

    let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return allTasks.some(task => task.text.toLowerCase() === taskText.toLowerCase() && task.id !== currentId); //? Return true if exists
}

//* Status Cluster

//!
function checkBox(taskId) {

    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let task = allTasks.find(task => task.id === taskId);

    task.completed = !task.completed;

    localStorage.setItem('tasks', JSON.stringify(allTasks));
    renderTasks();
}

//* Delete Cluster

//!
function deleteTask(taskId) {

    showToast('Are you sure you want to delete this task?', () => {
        

        let allTasks = JSON.parse(localStorage.getItem('tasks'));
        allTasks = allTasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(allTasks));

        showNotification('Task deleted successfully', 'green');
        renderTasks();
    }, () => {
        showNotification('Task deletion canceled', 'red');
    });
}

//* Clear Cluster

//!
function clearTasks() {
    const filter = localStorage.getItem('statusFilter');
    let message = '';

    //* Message for confirmation dialog
    switch (filter) {
        case 'all':
            message = 'Are you sure you want to clear all tasks?';
            break;
        case 'inprogress':
            message = 'Are you sure you want to clear all in-progress tasks?';
            break;
        case 'completed':
            message = 'Are you sure you want to clear all completed tasks?';
            break;
    }

    showToast(message, () => { //! Function call: To ask for clear confirmation
        let allTasks;
        allTasks = JSON.parse(localStorage.getItem('tasks'));
        

        //* Clear tasks based on filter

        switch (filter) {
            case 'all':
                localStorage.removeItem('tasks');
                localStorage.removeItem('taskIdCounter');
                taskIdCounter = 0;
                break;
            case 'inprogress':
                const inProgressTasks = allTasks.filter(task => task.completed);
                localStorage.setItem('tasks', JSON.stringify(inProgressTasks));
                break;
            case 'completed':
                const completedTasks = allTasks.filter(task => !task.completed);
                localStorage.setItem('tasks', JSON.stringify(completedTasks));
                break;
        }

        showNotification(`${filter.charAt(0).toUpperCase() + filter.slice(1)} tasks cleared!`, 'green'); //! Function call: To show tasks cleared message
        renderTasks();

    }, () => {
        showNotification('Task clearing canceled', 'red'); //! Function call: To show task cleared cancel message
    });
}

//* Edit Cluster

//!
function toggleEdit(taskId) {

    const inputBox = document.querySelector('#input');
    inputBox.style.borderBottom = 'none';

    disableOtherElements(true);
    toggleTaskControls(taskId, 'edit', 'save');

    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.removeAttribute('readonly');
    taskText.focus();
    taskText.setSelectionRange(taskText.value.length, taskText.value.length);
    taskText.style.borderBottom = '2px solid #461b80';

    taskText.addEventListener('input', () => {
        taskText.style.borderBottom = '2px solid #461b80';
    });

}

//?
function disableOtherElements(disabled) {

    const inputBox = document.querySelector('#input');
    const addButton = document.querySelector('#add');
    const clearButton = document.querySelector('#clear');
    const allEditButtons = document.querySelectorAll('.editdel button');
    const radioButtons = document.querySelectorAll('input[name="taskFilter"]');

    inputBox.disabled = disabled;
    addButton.disabled = disabled;
    clearButton.disabled = disabled;

    allEditButtons.forEach(button => {
        button.disabled = disabled;
    });

    radioButtons.forEach(radio => {
        radio.disabled = disabled;
    });

}


//!
function saveTask(taskId) {

    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let taskText = document.querySelector(`#onetask-${taskId}`);
    let editedText = taskText.value;

    if (!validateInput(editedText, taskId)) {
        taskText.focus();
        return;
    }

    const confirmSave = () => {

    let task = allTasks.find(task => task.id === taskId);
    task.text = editedText;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    showNotification('Task updated successfully!', 'green');
    toggleSave(taskId);
    renderTasks();

    };

    const cancelSave = () => {
        cancelEdit(taskId);
        showNotification('Task saving canceled', 'red');
    };

    showToast('Are you sure you want to save changes to this task?', confirmSave, cancelSave);
}

//!
function cancelEdit(taskId) {

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let task = tasks.find(task => task.id === taskId);

    let taskText = document.querySelector(`#onetask-${taskId}`);

    taskText.value = task.text; 
    toggleSave(taskId); 
}

//!
function toggleSave(taskId) {

    disableOtherElements(false);

    toggleTaskControls(taskId, 'save', 'edit');

    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.setAttribute('readonly', 'true');
    taskText.style.borderStyle = 'none';
}

//?
function toggleTaskControls(taskId, from, to) {

    let fromDiv = document.querySelector(`#${from}-${taskId}`);
    let toDiv = document.querySelector(`#${to}-${taskId}`);

    fromDiv.style.display = 'none';
    toDiv.style.display = 'flex';


}

//* Notification and Toast Cluster

//?
function showNotification(text = 'Notification', color = 'blue') {
    const notification = document.querySelector('.notification');

    notification.textContent = text;
    notification.style.backgroundColor = color;
    notification.style.visibility = 'visible';

    setTimeout(() => {
        notification.textContent = "";
        notification.style.visibility = 'hidden';
    }, 3000);
}

//!
function showToast(message, onConfirm, onCancel) {

    const messageText = document.getElementById('message-text');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');

    toggleToast(true);
    messageText.textContent = message;

    confirmButton.onclick = () => {
        onConfirm();
        toggleToast(false);
    };

    cancelButton.onclick = () => {
        onCancel();
        toggleToast(false);
    };
}

//?
function toggleToast(visible) {
    const toastContainer = document.getElementById('toast-container');
    toastContainer.style.display = visible ? 'flex' : 'none';
}


//* Exports
module.exports = {
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
};


















