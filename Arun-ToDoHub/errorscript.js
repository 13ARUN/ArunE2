//* 1.Required functional elements 
const inputBox = document.querySelector('#input'), //? Task input field
      addButton = document.querySelector('#add'), //? Add Button
      taskList = document.querySelector('#listtask'), //? List container ul element
      clearButton = document.querySelector('#clear'), //? Clear button
      taskCountText = document.querySelector('.count h3'), //? Task couter display field
      notification = document.querySelector('.notification'); //? Notification message 

//* 2.Global variable for saving task with ID in local storage

let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0; //? ID counter variable for tasks

//* 3.Event listeners

//* 3.1 Event listener for DOMContentLoaded to render tasks from local storage on page load based on filter
document.addEventListener('DOMContentLoaded', () => { // Load existing tasks on page load
    const savedFilter = localStorage.getItem('statusFilter') || 'all';
    document.querySelector(`input[value="${savedFilter}"]`).checked = true;
    renderTasks(savedFilter); // Render tasks from local storage

    inputBox.addEventListener('blur', () => {
        inputBox.style.borderBottom = 'none'; // Remove border style when not focused
    });

    inputBox.addEventListener('input', () => {
        inputBox.style.borderBottom = 'none'; // Remove border style when typed
    });

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('works');
        addTask();
    });
    
    document.querySelectorAll('input[name="taskFilter"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            filterTasks(event.target.value);
        });
    });
    
    document.getElementById('clear').addEventListener('click', clearTasks);
    
});

//* 3.2 Event listner for rendering tasks based on changed filter
document.querySelectorAll('input[name="taskFilter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const filter = e.target.value;
        localStorage.setItem('statusFilter', filter); //? Store filter value in Local Storage
        renderTasks(filter);
    });
});




//* 4.Function to render tasks 

function renderTasks() {
    let allTasks;
    try {
        allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    } catch (e) {
        //console.error('Failed to parse tasks from local storage:',e);
        showNotification('Failed to parse tasks from local storage', '#b80d0d');
        return;
        allTasks = [];
    }

    const filter = localStorage.getItem('statusFilter') || 'all';

    clearTaskList();

    displayTaskCounts(allTasks, filter);
    let filteredTasks = filterTasks(allTasks, filter);

    filteredTasks.forEach(task => {
        try {
            renderEachTask(task);
        } catch (e) {
            console.error('Failed to render task:', e);
        }
    });

    toggleTaskListVisibility(allTasks);
}




function renderEachTask(task) {
    try {
        const taskList = document.querySelector('#listtask');
        let aTask = createTaskElement(task);
        taskList.appendChild(aTask);
        //taskList.prepend(aTask); 
    } catch (e) {
        console.error('Failed to render task:', e);
    }
}


function clearTaskList() {
    try {
        const taskList = document.querySelector('#listtask');
        taskList.innerHTML = '';
    } catch (e) {
        console.error('Failed to clear task list:', e);
    }
}





function addTask() {

    const inputBox = document.querySelector('#input');
    const inputValue = inputBox.value;

    

    if (!validateInput(inputValue)) {
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

    let allTasks;
    try {
        allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
        allTasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        localStorage.setItem('taskIdCounter', taskIdCounter);
        localStorage.setItem('statusFilter', 'all');
    } catch (e) {
        console.error('Failed to update tasks or local storage:', e);
        showNotification('Failed to add task. Please try again.', '#b80d0d');
        return;
    }

    showNotification('Task added successfully', 'green');
    const statusFilter = document.querySelector('input[name="taskFilter"][value="all"]');
    statusFilter.checked = true;
    
    renderTasks();

    inputBox.value = "";
    inputBox.focus();
}



function validateInput(taskText, currentId = -1) {
    try {
        if (taskText === '') {
            showNotification('Task cannot be empty!!', '#b80d0d');
            return false;
        } else if (taskText.replace(/\s+/g, ' ') === ' ') {
            showNotification('Task cannot contain only spaces!', '#b80d0d');
            return false;
        } else if (isTaskAlreadyExists(taskText.trim().replace(/\s+/g, ' '), currentId)) {
            showNotification('Task already exists!', '#b80d0d');
            return false;
        }
        return true;
    } catch (e) {
        console.error('Failed to validate input:', e);
        return false;
    }
}




//* 6.Function to create a task element
function createTaskElement(task) {
    let aTask = document.createElement("div"); // Create div for the task
    aTask.classList.add("atask"); // Add class name "atask"
    aTask.style.opacity = task.completed ? '0.6' : '1';

    // Create elements for the task
    let taskHTML = `
        <div class="eachtask">
            <input type="text" id="onetask-${task.id}" value="${task.text}" maxlength="150" readonly="true"> <!-- Task content Default:readonly -->
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
    aTask.querySelector('button[title="Edit Task"]').addEventListener('click', () => {
        if (!task.completed) toggleEdit(task.id);
    });
    aTask.querySelector('button[title="Delete Task"]').addEventListener('click', () => deleteTask(task.id));
    aTask.querySelector('button[title="Save Task"]').addEventListener('click', () => saveTask(task.id));
    aTask.querySelector('button[title="Cancel Edit"]').addEventListener('click', () => cancelEdit(task.id));

    return aTask;
}




//* 7.Function to display task counts text based on filter
//* 7.Function to display task counts text based on filter
function displayTaskCounts(tasks, filter) {
    try {
        //* Count variables for each filter
        const totalTasks = tasks.length;
        const inProgressTasks = tasks.filter(task => !task.completed).length;
        const completedTasks = totalTasks - inProgressTasks;

        const taskCountText = document.querySelector('.count h3');

        //* Display task count text based on filter & filter count
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
    } catch (e) {
        console.error('Failed to display task counts:', e);
    }
}



//* 8.Function to filter tasks based on the selected filter
//* 8.Function to filter tasks based on the selected filter
function filterTasks(tasks, filter) {
    try {
        switch (filter) {
            case 'inprogress':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    } catch (e) {
        console.error('Failed to filter tasks:', e);
        return tasks;
    }
}


//* 9.Function to toggle visibility of task list and no tasks page
function toggleTaskListVisibility(tasks) {
    try {
        //* Elements to change visibility
        const noTasks = document.querySelector('.notasks'); // No tasks page
        const showtask = document.querySelector('.tasklist'); // Tasks page
        const taskActions = document.querySelector('.tasktext'); // Task count & filter
        const countText = document.querySelector('.clear'); // Clear button and count display field
        const taskCountText = document.querySelector('.count h3');

        if (!noTasks || !showtask || !taskActions || !countText || !taskCountText) {
            throw new Error('One or more required DOM elements were not found.');
        }

        if (tasks.length === 0) {
            taskCountText.textContent = `You have no tasks here!`; // Display when all tasks are deleted
            noTasks.style.display = 'flex'; // Show no tasks
            showtask.style.display = 'none'; // Hide tasks
            taskActions.style.display = 'none';
            countText.style.display = 'none';
        } else {
            noTasks.style.display = 'none'; // Hide no tasks
            showtask.style.display = 'flex'; // Show tasks
            taskActions.style.display = 'flex';
            countText.style.display = 'flex';
        }
    } catch (e) {
        console.error('Failed to toggle task list visibility:', e);
    }
}


//* 10.Function to change completed status when checkbox is clicked
function checkBox(taskId) {
    try {
        let allTasks = JSON.parse(localStorage.getItem('tasks'));
        let task = allTasks.find(task => task.id === taskId);
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        renderTasks();
    } catch (e) {
        console.error('Failed to update task status:', e);
        showNotification('Failed to update task status. Please try again.', '#b80d0d');
    }
}


//* 11.Function to delete a task

function deleteTask(taskId) {
    showToast('Are you sure you want to delete this task?', () => {
        let allTasks;
        try {
            allTasks = JSON.parse(localStorage.getItem('tasks'));
            allTasks = allTasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(allTasks));
        } catch (e) {
            //console.error('Failed to delete task or update local storage:', e);
            showNotification('Failed to delete task. Please try again.', '#b80d0d');
            return;
        }

        showNotification('Task deleted successfully', 'green');
        renderTasks();
    }, () => {
        showNotification('Task deletion canceled', 'red');
    });
}



function toggleEdit(taskId) {
    try {
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
    } catch (e) {
        console.error('Failed to toggle edit mode:', e);
    }
}



function toggleSave(taskId) {

    disableOtherElements(false);

    toggleTaskControls(taskId, 'save', 'edit');

    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.setAttribute('readonly', 'true');
    taskText.style.borderStyle = 'none';
}


function disableOtherElements(disabled) {
    try {
        // Query selectors to find elements that need to be disabled or enabled
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
        const clearButton = document.querySelector('#clear');
        const allEditButtons = document.querySelectorAll('.editdel button');
        const radioButtons = document.querySelectorAll('input[name="taskFilter"]');

        if (!inputBox || !addButton || !clearButton || !allEditButtons || !radioButtons) {
            throw new Error('One or more required DOM elements were not found.');
        }

        // Set the disabled property for the main elements
        inputBox.disabled = disabled;
        addButton.disabled = disabled;
        clearButton.disabled = disabled;

        // Set the disabled property for edit buttons
        allEditButtons.forEach(button => {
            button.disabled = disabled;
        });

        // Set the disabled property for radio buttons
        radioButtons.forEach(radio => {
            radio.disabled = disabled;
        });

    } catch (e) {
        console.error('Failed to disable or enable elements:', e);
    }
}



//* 14.Function to toggle between edit/delete and save/cancel
function toggleTaskControls(taskId, from, to) {
    try {
        //* Select the respective div
        let fromDiv = document.querySelector(`#${from}-${taskId}`);
        let toDiv = document.querySelector(`#${to}-${taskId}`);

        //* Check if the elements exist
        if (!fromDiv) {
            throw new Error(`Element with ID #${from}-${taskId} not found.`);
        }
        if (!toDiv) {
            throw new Error(`Element with ID #${to}-${taskId} not found.`);
        }

        //* Toggle display properties
        fromDiv.style.display = 'none';
        toDiv.style.display = 'flex';

    } catch (error) {
        console.error(`Error toggling task controls`);
    }
}


//* 15.Function to save edited task
function saveTask(taskId) {
    let allTasks;

    try {
        allTasks = JSON.parse(localStorage.getItem('tasks'));
    } catch (e) {
        console.error('Failed to parse tasks from local storage:', e);
        showNotification('Failed to save task. Please try again.', '#b80d0d');
        return;
    }

    let taskText = document.querySelector(`#onetask-${taskId}`);
    let editedText = taskText.value.trim().replace(/\s+/g, ' ');

    if (!validateInput(editedText, taskId)) {
        taskText.focus();
        return;
    }

    const confirmSave = () => {
        try {
            let task = allTasks.find(task => task.id === taskId);
            task.text = editedText;
            localStorage.setItem('tasks', JSON.stringify(allTasks));
            showNotification('Task updated successfully!', 'green');
            toggleSave(taskId);
            renderTasks();
        } catch (e) {
            console.error('Failed to save task:', e);
            showNotification('Failed to save task. Please try again.', '#b80d0d');
        }
    };

    const cancelSave = () => {
        cancelEdit(taskId);
        showNotification('Task saving canceled', 'red');
    };

    showToast('Are you sure you want to save changes to this task?', confirmSave, cancelSave);
}






//* 16.Function to cancel editing task
function cancelEdit(taskId) {
    try {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        let task = tasks.find(task => task.id === taskId);

        let taskText = document.querySelector(`#onetask-${taskId}`);

        taskText.value = task.text; 
        toggleSave(taskId); 

    } catch (error) {
        console.error('Error canceling task edit:');
    }
}


//* 17.Function to clear all tasks from screen and local storage based on filter
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
        try {
            switch (filter) {
                case 'all':
                    localStorage.removeItem('tasks');
                    localStorage.removeItem('taskIdCounter');
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
        } catch (e) {
            console.error('Failed to update local storage during task clearing:', e);
            showNotification('Failed to clear tasks. Please try again.', '#b80d0d');
        }
    }, () => {
        showNotification('Task clearing canceled', 'red'); //! Function call: To show task cleared cancel message
    });
}


//* 18.Function to check if task is already present
function isTaskAlreadyExists(taskText, currentId) { 
    try {
        let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return allTasks.some(task => task.text.toLowerCase() === taskText.toLowerCase() && task.id !== currentId); //? Return true if exists
    } catch (e) {
        console.error('Failed to check if task already exists:', e);
        return false;
    }
}


//* 19.Function to display notification
function showNotification(text = 'Notification', color = 'blue') {
    const notification = document.querySelector('.notification');
    if (!notification) return;

    notification.textContent = text;
    notification.style.backgroundColor = color;
    notification.style.visibility = 'visible';

    setTimeout(() => {
        notification.textContent = "";
        notification.style.visibility = 'hidden';
    }, 2000);
}




// Function to show toast message with confirmation and cancellation
function showToast(message, onConfirm, onCancel) {
    const toastContainer = document.getElementById('toast-container');
    const messageText = document.getElementById('message-text');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');

    if (!toastContainer || !messageText || !confirmButton || !cancelButton) return;

    // Show the toast
    toggleToast(true);
    messageText.textContent = message;

    // Function to handle key presses
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            onConfirm();
            toggleToast(false);
            document.removeEventListener('keydown', handleKeyPress);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
            toggleToast(false);
            document.removeEventListener('keydown', handleKeyPress);
        }else {
            //console.log(`Unhandled key press: ${event.key}`);
            return;
        }
    }

    // Add key press event listener
    document.addEventListener('keydown', handleKeyPress);

    // Set click handlers for confirm and cancel buttons
    confirmButton.onclick = () => {
        onConfirm();
        toggleToast(false);
        document.removeEventListener('keydown', handleKeyPress);
    };

    cancelButton.onclick = () => {
        onCancel();
        toggleToast(false);
        document.removeEventListener('keydown', handleKeyPress);
    };
}

function toggleToast(visible) {
    const toastContainer = document.getElementById('toast-container');
    toastContainer.style.display = visible ? 'flex' : 'none'; // Toggle toast visibility
}





// window.taskIdCounter = taskIdCounter;
// window.renderTasks = renderTasks;
// window.renderEachTask = renderEachTask;
// window.addTask = addTask;
// window.checkBox = checkBox;
// window.clearTasks = clearTasks;
// window.cancelEdit = cancelEdit;
// window.isTaskAlreadyExists = isTaskAlreadyExists;
// window.filterTasks = filterTasks;
// window.deleteTask = deleteTask;
// window.saveTask = saveTask;
// window.toggleEdit = toggleEdit;

// window.toggleSave = toggleSave;
// window.showNotification = showNotification;
// window.showToast = showToast;
// window.clearTaskList = clearTaskList;
// window.createTaskElement = createTaskElement;
// window.displayTaskCounts = displayTaskCounts;
// window.toggleTaskListVisibility = toggleTaskListVisibility;
// window.disableOtherElements = disableOtherElements;
// window.toggleTaskControls = toggleTaskControls;
// window.cancelEdit = cancelEdit;
// window.validateInput = validateInput;
// window.toggleToast = toggleToast;

module.exports = {
    taskIdCounter,
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