//* 1.Required functional elements 
const inputBox = document.querySelector('#input'), //? Task input field
      addButton = document.querySelector('#add'), //? Add Button
      taskList = document.querySelector('#listtask'), //? List container ul element
      clearButton = document.querySelector('#clear'), //? Clear button
      taskCountText = document.querySelector('.count h3'), //? Task couter display field
      notification = document.querySelector('.notification'); //? Notification message 

//* 2.Elements to toggle no tasks and task list
const noTasks = document.querySelector('.notasks'), //? No tasks page
      showtask = document.querySelector('.tasklist'), //? Tasks page
      taskActions = document.querySelector('.tasktext'); //? Task count & filter
      countText = document.querySelector('.clear') //? clear button and count display field

//* 3.Global variable for saving task with ID in local storage
let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0; //? ID counter variable for tasks

//* 4.1 Event listener for DOMContentLoaded to render tasks from local storage on page load based on filter
document.addEventListener('DOMContentLoaded', () => { // Load existing tasks on page load
    const savedFilter = localStorage.getItem('statusFilter') || 'all';
    document.querySelector(`input[value="${savedFilter}"]`).checked = true;
    renderTasks(savedFilter); // Render tasks from local storage
});

//* 4.2 Event listner for rendering tasks based on changed filter
document.querySelectorAll('input[name="taskFilter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const filter = e.target.value;
        localStorage.setItem('statusFilter', filter);
        renderTasks(filter);
    });
});

//* 4.3 Event listner for removing focus on task input on typing
inputBox.addEventListener('input', () => {
    inputBox.style.borderBottom = 'none';
});

inputBox.addEventListener('blur', () => {
    inputBox.style.borderBottom = 'none'; // Remove border style when not focused
});

//* 5.Function to render tasks 
function renderTasks() {

    inputBox.disabled = false;
    clearButton.disabled = false;
    addButton.disabled = false;

    //* Get existing tasks and filter value from local storage
    let allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []; //Get tasks if it exists in local storage else empty
    const filter = localStorage.getItem('statusFilter'); // Get filter value
    taskList.innerHTML = ''; // Clear all the contents in tasks list

    displayTaskCounts(allTasks,filter); //! Function call: To display the count with text

    let filteredTasks = filterTasks(allTasks, filter); //! Function call: To Filter tasks based on filter chosen

    //* Create and display tasks based on filter selected
    filteredTasks.forEach(task => { 
        let aTask = createTaskElement(task); //! Function call: To create a task under ul 
        taskList.appendChild(aTask); //append as aTask div as child of ul
    });
   
    toggleTaskListVisibility(allTasks);  //! Function call: To toggle visibility of task list and no tasks page
}
//* 6.Function to add a new task
function addTask(){

    //* Input task validation
    // Validate a empty task 
    if (inputBox.value === '') { 
        showNotification('Task cannot be empty!!','#b80d0d'); //! Function call: To display empty task error message
        inputBox.focus();
        inputBox.style.borderBottom = '2px solid red';
    }
    // Validate for only Spaces
    else if (inputBox.value.replace(/\s+/g, ' ') === ' '){
        showNotification('Task cannot contain only spaces!','#b80d0d'); //! Function call: To display only space characters error message
        inputBox.focus();
        inputBox.style.borderBottom = '2px solid red';
    }
    // Validate a existing task
    else if (isTaskAlreadyExists(inputBox.value.trim().replace(/\s+/g, ' '), -1)) { //! Function call: To check the task content already exists
        showNotification('Task already exists!','#b80d0d'); //! Function call: To display existing task error message
        inputBox.focus();
        inputBox.style.borderBottom = '2px solid red';
    }else{ 
        // Create a new task as object to add to DOM
        let task = {
            id: taskIdCounter++, //? Task ID
            text: inputBox.value.trim().replace(/\s+/g, ' '), //? Task text content
            completed: false //? Task status
        };
        // Add new task to local storage
        let allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
        allTasks.push(task); // Add the new task
        localStorage.setItem('tasks', JSON.stringify(allTasks)); // Save the updated tasks
        localStorage.setItem('taskIdCounter', taskIdCounter); // Save the updated counter
        localStorage.setItem('statusFilter', 'all');
        showNotification('Task added sucessfully','green'); //! Function call: To show task added message
        const statusFilter = document.querySelector('input[name="taskFilter"][value="all"]');
        statusFilter.checked = true;
        renderTasks(); //! Function call: To Re-render tasks
    }
    inputBox.value = ""; //? Empty contents of input field 
    inputBox.focus();
}



//* 7.Function to display task counts text based on filter
function displayTaskCounts(tasks, filter) {

    //* Count variables for each filter
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = totalTasks - inProgressTasks;

    //* Display task count text based on filter & filter count
    switch (filter) {
        case 'inprogress':
            taskCountText.textContent = inProgressTasks === 1 ? `You have ${inProgressTasks} task to do!` : `You have ${inProgressTasks} tasks to do!`;
            break;
        case 'completed':
            taskCountText.textContent = completedTasks === 1 ? `You have completed ${completedTasks} task!` : `You have completed ${completedTasks} tasks!`;
            break;
        default:
            taskCountText.textContent = totalTasks === 1 ? `You have a total of ${totalTasks} task!` : `You have a total of ${totalTasks} tasks!`;
    }
}

//* 8.Function to filter tasks based on the selected filter
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



//* 9.Function to create a task element
function createTaskElement(task) {
    let aTask = document.createElement("div"); //? Create div atask to add elements for each task
    aTask.classList.add("atask"); // Add a class name "atask"
    aTask.style.opacity = task.completed ? '0.4' : '1';
    aTask.innerHTML = ` 
                        <div class="eachtask">
                            <input type="text" id="onetask-${task.id}" value="${task.text}" maxlength="150" readonly> <!--//? Task content Default:readonly-->
                        </div>
                        
                        <div class="editdel" id="edit-${task.id}">
                            <button id="checkbox-${task.id}" title="Status" onclick="checkBox(${task.id})" ${task.completed ? 'checked' : ''}>
                            <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
                            </button>
                            <button title="Edit Task" onclick="toggleEdit(${task.id})"> <!--//! Function call: To enable editing of task content-->
                            <img src="img/edit.png" alt="edit icon">
                            </button>  <!--//? Edit button-->
                            <button title="Delete Task" onclick="deleteTask(${task.id})"> <!--//! Function call: To delete a task from task list-->
                            <img src="img/delete.png" alt="delete icon">
                            </button>  <!--//? Delete button-->
                        </div>
                        <div class="savecancel" id="save-${task.id}" style="display:none">
                            <button id="checkbox-${task.id}" title="Status"  disabled="true" onclick="checkBox(${task.id})" ${task.completed ? 'checked' : ''}>
                            <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
                            </button>
                            <button  title="Save Task" onclick="saveTask(${task.id})">  <!--//! Function call: To save edited task-->
                            <img src="img/save.png" alt="save icon">
                            </button>  <!--//? Save button-->
                            <button  title="Cancel Edit" onclick="cancelEdit(${task.id})"> <!--//! Function call: To cancel editing a task-->
                            <img src="img/wrong.png" alt="cancel icon">
                            </button>  <!--//? Cancel button-->
                        </div>`;
    return aTask; // Return the aTask to append in ul as a child
}

//* 10.Function to toggle visibility of task list and no tasks page
function toggleTaskListVisibility(tasks) {
    if (tasks.length === 0) {
        taskCountText.textContent = `You have no tasks here!`; // display when all tasks are deleted
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
}

//* 11.Function to delete a task
function deleteTask(taskId) {
    showToast('Are you sure you want to delete this task?', () => { //! Function call: To show Delete confirmation message
        let allTasks = JSON.parse(localStorage.getItem('tasks')); //? Get the tasks from local storage
        allTasks = allTasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        showNotification('Task deleted successfully', 'green'); //! Function call: To show task deleted message
        renderTasks(); //! Function call: To Re-render tasks after deletion
    }, () => {
        showNotification('Task deletion canceled', 'red'); //! Function call: To show deletion canceled message
    });
}

//* 12.Function to toggle from edit/delete to save/cancel
function toggleEdit(taskId) {

    inputBox.disabled = true;
    addButton.disabled = true;
    clearButton.disabled = true;

    inputBox.style.borderBottom = 'none';

    //* Function to disable other task buttons
    const allEditButtons = document.querySelectorAll('.editdel button');
    allEditButtons.forEach(button => {
        button.disabled = true; // Disables edit and delete buttons of other tasks
    });

     //* Disable radio buttons
     const radioButtons = document.querySelectorAll('input[name="taskFilter"]');
     radioButtons.forEach(radio => {
         radio.disabled = true; // Disable radio buttons
     });

    //* Display save and cancel buttons
    toggleTaskControls(taskId, 'edit', 'save'); //! Function call: To toggle to save and cancel buttons

    //* Make task editable
    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.removeAttribute('readonly');
    
    //* Visual cues for edit enable
    taskText.focus();
    taskText.setSelectionRange(taskText.value.length, taskText.value.length); // Display cursor at end of existing text
    taskText.style.borderBottom = '2px solid #461b80'; // Highlight the bottom border

    //* Event listner to change error cue on typing
    taskText.addEventListener('input', () => {
        taskText.style.borderBottom = '2px solid #461b80';
    });

    //* Event listener for Enter key to save task
    taskText.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { // Validate entered key is enter key
            saveTask(taskId);
        }
    });
}

//* 13.Function to toggle from save/cancel to edit/delete
function toggleSave(taskId){

    //* Display edit and delete buttons
    toggleTaskControls(taskId, 'save', 'edit'); //! Function call: To toggle to edit and delete buttons

    //* Make task non-editable
    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.setAttribute('readonly', 'true'); // Make it non-editable

    //* Visual cue for edit disable
    taskText.style.borderStyle = 'none'; // Remove highlight on the bottom border

    
}

//* 14.Function to toggle between edit/delete and save/cancel
function toggleTaskControls(taskId, from, to) {

    //* Select the respective div
    let fromDiv = document.querySelector(`#${from}-${taskId}`);
    let toDiv = document.querySelector(`#${to}-${taskId}`);

    //* Toggle display properties
    fromDiv.style.display = 'none';
    toDiv.style.display = 'flex';
}

//* 15.Function to save edited task
function saveTask(taskId) {

    //* Get the edited and original task text
    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let taskText = document.querySelector(`#onetask-${taskId}`);
    let editedText = taskText.value.trim().replace(/\s+/g, ' ');

    const task = allTasks.find(task => task.id === taskId);

    //* Validation for editing the task
    if (editedText === '') {  // Empty task
        showNotification('Task cannot be empty!!','#b80d0d'); //! Function call: To show empty task message
        taskText.style.borderBottom = '2px solid red';
        return;
    }

    //* Validation for existing task
    if (isTaskAlreadyExists(editedText, taskId)) { //! Function call: To check the task content already exists
        showNotification('Task already exists!','#b80d0d'); //! Function call: To show task exist error message
        taskText.style.borderBottom = '2px solid red';
        return;
    }

    const confirmSave = () => {
        //* Save edited task
        task.text = editedText;
        localStorage.setItem('tasks', JSON.stringify(allTasks));

        showNotification('Task updated successfully!', 'green'); //! Function call: To show task updated message
        toggleSave(taskId); //! Function call: To toggle to edit/delete div
        renderTasks(); //! Function call: To Re-render tasks after saving
    };

    const cancelSave = () => {
        cancelEdit(taskId);
        showNotification('Task saving canceled', 'red');
    };

    showToast('Are you sure you want to save changes to this task?', confirmSave, cancelSave);
}

//* 16.Function to cancel editing task
function cancelEdit(taskId) {

    //* Cancel task editing
    let task = JSON.parse(localStorage.getItem('tasks')).find(task => task.id === taskId); // Original task text from local storage
    let taskText = document.querySelector(`#onetask-${taskId}`); 
    taskText.value = task.text; // Reassign original task text
    toggleSave(taskId); //! Function call: To toggle to edit/delete div

    //* Enable the edit and delete buttons
    const allEditButtons = document.querySelectorAll('.editdel button');
    allEditButtons.forEach(button => {
        button.disabled = false; // Enables edit and delete buttons
    });  
    
    //* Enable radio buttons
    const radioButtons = document.querySelectorAll('input[name="taskFilter"]');
    radioButtons.forEach(radio => {
        radio.disabled = false; // Enable radio buttons
    });

    inputBox.disabled = false;
    clearButton.disabled = false;
    addButton.disabled = false;
    
}

//* 17.Function to change completed status when checkbox is clicked
function checkBox(taskId) {

    //* Change completed status 
    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let task = allTasks.find(task => task.id === taskId); // Find task to change status
    task.completed = !task.completed; // Toggle true and false
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    renderTasks(); //! Function call: To Re-render tasks after changing status
}


//* 18.Function to clear all tasks from screen and local storage based on filter
function clearAllTasks() {
    const filter = localStorage.getItem('statusFilter');
    let message = '';

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

    showToast(message, () => {
        let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        if (filter === 'all') {
            localStorage.removeItem('tasks');
            localStorage.removeItem('taskIdCounter');
            taskIdCounter = 0;
        } else if (filter === 'inprogress') {
            allTasks = allTasks.filter(task => task.completed);
            localStorage.setItem('tasks', JSON.stringify(allTasks));
        } else if (filter === 'completed') {
            allTasks = allTasks.filter(task => !task.completed);
            localStorage.setItem('tasks', JSON.stringify(allTasks));
        }

        showNotification(`${filter.charAt(0).toUpperCase() + filter.slice(1)} tasks cleared!`, 'green');
        renderTasks();
    }, () => {
        showNotification('Task clearing canceled', 'red');
    });
}

//* 19.Function to check if task is already present
function isTaskAlreadyExists(taskText, currentId) { 
    let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return allTasks.some(task => task.text.toLowerCase() === taskText.toLowerCase() && task.id !== currentId); //? Return true is exists
}
//* 20.Function to display notification
function showNotification(text,color){

    //* Assign text and background color
    notification.textContent = text;
    notification.style.backgroundColor = color;

    notification.style.visibility = 'visible'; // To display
    notification.classList.add('.notification'); // To add styling
    setTimeout(() => {
        notification.textContent = "";
        notification.classList.remove(`.notification`);
        notification.style.visibility = 'hidden';
    }, 2000);
}

//* Function to create and show a toast message
function showToast(message, onConfirm, onCancel) {
    const toastContainer = document.getElementById('toast-container');
    
    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';
    
    const messageText = document.createElement('span');
    messageText.textContent = message;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Yes';
    confirmButton.onclick = () => {
        onConfirm();
        removeToast(toastMessage);
    };
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'No';
    cancelButton.onclick = () => {
        onCancel();
        removeToast(toastMessage);
    };
    
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);

    toastMessage.appendChild(messageText);
    toastMessage.appendChild(buttonContainer);
    
    toastContainer.appendChild(toastMessage);

    toastContainer.style.display = 'flex'; 

    
}

// Function to remove toast message
function removeToast(toastMessage) {
    const toastContainer = document.getElementById('toast-container');
    toastContainer.removeChild(toastMessage);
    toastContainer.style.display = 'none';   
}





// Modify the saveTask function to include confirmation
