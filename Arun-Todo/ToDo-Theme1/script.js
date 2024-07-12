//* 1.Required functional elements 
const inputBox = document.querySelector('#input'), //? Task input field
      taskList = document.querySelector('#listtask'), //? List container ul element
      clearButton = document.querySelector('#clearButton'), //? Clear button
      statusFilter = document.querySelector('#statusFilter'), //? Filter tasks dropdown
      taskCountText = document.querySelector('.tasktext h3'), //? Task couter display field
      notification = document.querySelector('.notification'); //? Notification message 

//* 2.Elements to toggle no tasks and task list
const noTasks = document.querySelector('.notasks'), //? No tasks page
      showtask = document.querySelector('.tasklist'), //? Tasks page
      taskActions = document.querySelector('.tasktext'); //? Task count & filter

//* 3.Global variable for saving task with ID in local storage
let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0; //? ID counter variable for tasks

//* 4.Event listeners

//* 4.1 Event listener for DOMContentLoaded to render tasks from local storage on page load based on filter
document.addEventListener('DOMContentLoaded', () => { //? Load existing tasks on page load
    const savedFilter = localStorage.getItem('statusFilter');
    if (savedFilter) {
        statusFilter.value = savedFilter; // Load the tasks based on existing filter Default:All
    }
    renderTasks(); //! Function call: To Render tasks from local storage
});

//* 4.2 Event listner for rendering tasks based on changed filter
statusFilter.addEventListener('change', () => {  //? Change tasks on filter change
    localStorage.setItem('statusFilter', statusFilter.value);
    renderTasks(); //! Function call: To Re-ender tasks for chosen filter option
});

//* 4.3 Event listner for removing focus on task input on typing
inputBox.addEventListener('input', () => {
    inputBox.style.borderBottom = 'none';
});

//* 4.4 Event listner to add enter key functionality to add task
inputBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { // Validate that pressed key is enter key
        addTask(); //! Function call: To add a new task
    }
});

//* 5.Function to render tasks 
function renderTasks() {

    //* Get existing tasks and filter value from local storage
    let allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []; //Get tasks if it exists in local storage else empty
    const filter = statusFilter.value; // Get filter value
    taskList.innerHTML = ''; // Clear all the contents in tasks list

    displayTaskCounts(allTasks, filter); //! Function call: To display the count with text

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
    if (inputBox.value === '' || inputBox.value.replace(/\s+/g, ' ') === ' ' ) { 
        showNotification('Task cannot be empty!!','#b80d0d'); //! Function call: To display empty task error message
        inputBox.focus();
        inputBox.style.borderBottom = '2px solid red';
    // Validate a existing task
    }else if (isTaskAlreadyExists(inputBox.value.trim().replace(/\s+/g, ' '), -1)) { //! Function call: To check the task content already exists
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

        showNotification('Task added sucessfully','green'); //! Function call: To show task added message

        statusFilter.value = 'all'; //Default filter when task adding
        renderTasks(); //! Function call: To Re-render tasks
    }
    inputBox.value = ""; //? Empty contents of input field 
}

//* 7.Function to display task counts text based on filter
function displayTaskCounts(tasks, filter) {

    //* Count variables for each filter
    const totalTasks = tasks.length; //? Total tasks count
    const inProgressTasks = tasks.filter(task => !task.completed).length; //? Uncompleted tasks count
    const completedTasks = totalTasks - inProgressTasks; //? Completed tasks count

    //* Display task count text based on filter & filter count
    if (filter === 'all') { // All tasks text & count display
        taskCountText.textContent = (totalTasks === 1) ? `You have a total of ${totalTasks} task!` : `You have a total of ${totalTasks} tasks!`;
    } else if (filter === 'inprogress') { // In Progress tasks text & count display
        taskCountText.textContent = (inProgressTasks === 1) ? `You have ${inProgressTasks} task to do!` : `You have ${inProgressTasks} tasks to do!`;
    } else if (filter === 'completed') { // Completed tasks text & count display
        taskCountText.textContent = (completedTasks === 1) ? `You have completed ${completedTasks} task!` : `You have completed ${completedTasks} tasks!`;
    }
}

//* 8.Function to filter tasks based on selected filter
function filterTasks(tasks, filter) {
    if (filter === 'all') {
        return tasks; // All tasks
    } else if (filter === 'inprogress') {
        return tasks.filter(task => !task.completed); // In Progress tasks (completed:false)
    } else if (filter === 'completed') {
        return tasks.filter(task => task.completed); // Completed tasks (completed:true)
    }
    return tasks; // Default to all tasks if filter value is unexpected
}

//* 9.Function to create a task element
function createTaskElement(task) {
    let aTask = document.createElement("div"); //? Create div atask to add elements for each task
    aTask.classList.add("atask"); // Add a class name "atask"
    aTask.style.opacity = task.completed ? '0.6' : '1';
    aTask.innerHTML = ` 
                        <div class="eachtask">
                            <input type="text" id="onetask-${task.id}" value="${task.text}" maxlength="150" readonly> <!--//? Task content Default:readonly-->
                        </div>
                        <!--<div class="cbox">
                            <button id="checkbox-${task.id}" onclick="checkBox(${task.id})" ${task.completed ? 'checked' : ''}>
                            <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
                            </button>
                        </div> -->
                        <div class="editdel" id="edit-${task.id}">
                            <button id="checkbox-${task.id}" onclick="checkBox(${task.id})" ${task.completed ? 'checked' : ''}>
                            <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
                            </button>
                            <button onclick="toggleEdit(${task.id})"> <!--//! Function call: To enable editing of task content-->
                            <img src="img/edit.png" alt="edit icon">
                            </button>  <!--//? Edit button-->
                            <button onclick="deleteTask(${task.id})"> <!--//! Function call: To delete a task from task list-->
                            <img src="img/delete.png" alt="delete icon">
                            </button>  <!--//? Delete button-->
                        </div>
                        <div class="savecancel" id="save-${task.id}" style="display:none">
                            <button id="checkbox-${task.id}" onclick="checkBox(${task.id})" ${task.completed ? 'checked' : ''}>
                            <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
                            </button>
                            <button onclick="saveTask(${task.id})">  <!--//! Function call: To save edited task-->
                            <img src="img/save.png" alt="save icon">
                            </button>  <!--//? Save button-->
                            <button onclick="cancelEdit(${task.id})"> <!--//! Function call: To cancel editing a task-->
                            <img src="img/wrong.png" alt="cancel icon">
                            </button>  <!--//? Cancel button-->
                        </div>`;
    return aTask; // Retuen the aTask to append in ul as a child
}

//* 10.Function to toggle visibility of task list and no tasks page
function toggleTaskListVisibility(tasks) {
    if (tasks.length === 0) {
        taskCountText.textContent = `You have no tasks here!`; // display when all tasks are deleted
        noTasks.style.display = 'flex'; // Show no tasks
        showtask.style.display = 'none'; // Hide tasks
        taskActions.style.display = 'none';
    } else {
        noTasks.style.display = 'none'; // Hide no tasks
        showtask.style.display = 'flex'; // Show tasks
        taskActions.style.display = 'flex';
    }
}

//* 11.Function to delete a task
function deleteTask(taskId) {
    let allTasks = JSON.parse(localStorage.getItem('tasks')); //? Get the tasks from local storage
    allTasks = allTasks.filter(task => task.id !== taskId); // Select the task(s) other that selected id 
    localStorage.setItem('tasks', JSON.stringify(allTasks));

    showNotification('Task deleted sucessfully','green'); //! Function call: To show task deleted message
    renderTasks(); //! Function call: To Re-render tasks after deletion
}

//* 12.Function to toggle from edit/delete to save/cancel
function toggleEdit(taskId) {

    //* Function to disable other task buttons
    const allEditButtons = document.querySelectorAll('.editdel button');
    allEditButtons.forEach(button => {
        button.disabled = true; // Disables edit and delete buttons of other tasks
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
    let alltasks = JSON.parse(localStorage.getItem('tasks'));
    let taskText = document.querySelector(`#onetask-${taskId}`);
    let editedText = taskText.value.trim().replace(/\s+/g, ' '); //? Trim spaces in the input
    let task = alltasks.find(task => task.id === taskId);

    //* Validation for editing the task
    if (editedText === '') {  // Empty task
        showNotification('Task cannot be empty!!','#b80d0d'); //! Function call: To show empty task message
        taskText.style.borderBottom = '2px solid red';
        return;
    }

    //*Validation for existing task
    if (isTaskAlreadyExists(editedText, taskId)) {  //! Function call: To check the task content already exists
        showNotification('Task already exists!','#b80d0d'); //! Function call: To show task exist error message
        taskText.style.borderBottom = '2px solid red'; 
        return;
    }

    //* Save edited task
    task.text = editedText;
    localStorage.setItem('tasks', JSON.stringify(alltasks));

    showNotification('Task updated sucessfully!','green'); //! Function call: To show task updated message
    
    toggleSave(taskId); //! Function call: To toggle to edit/delete div
    renderTasks(); //! Function call: To Re-render tasks after saving
    
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

//* 18.Function to clear all tasks from screen and local storage
function clearAllTasks() {

    taskList.innerHTML = ''; // Clear task list on screen
    localStorage.removeItem('tasks'); // Clear local storage
    localStorage.removeItem('taskIdCounter'); // Clear the taskIdCounter from local storage
    renderTasks(); //! Function call: To Re-render tasks after clearing all tasks
    showNotification('All tasks cleared!','green'); //! Function call: To show all tasks cleared message
    taskIdCounter = 0; // Reset the counter
    taskCountText.textContent = `You have no tasks here!`; // Update task count text  
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
    }, 1500);
}