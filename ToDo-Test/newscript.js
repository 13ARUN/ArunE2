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