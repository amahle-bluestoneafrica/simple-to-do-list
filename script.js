document.addEventListener('DOMContentLoaded', function () {
    // Loads tasks from localStorage when the page loads
    loadTasks();

    // Add new task on click
    document.getElementById('addTaskBtn').addEventListener('click', function () {
        const taskInput = document.getElementById('enterTask');
        const taskText = taskInput.value.trim();

        // Validates input to ensure it's not empty
        if (taskText !== "") {
            addTaskToLocalStorage(taskText);
            taskInput.value = ''; // Clears input field
        } else {
            alert("Please enter a task!");
        }
    });

    // Filters tasks based on completed, pending and all
    document.getElementById('filterSelect').addEventListener('change', function () {
        const filter = this.value;
        filterTasks(filter);
    });

    setInterval(updateDateTime, 1000);

    // Function to update the current date and time
    function updateDateTime() {
        const now = new Date();

        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const formattedDateTime = `${weekday} ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

        document.getElementById('datetime').textContent = formattedDateTime;
    }

    // Initial call to display the time immediately when the page loads
    updateDateTime();
});

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks.forEach(task => {
        createTaskElement(task.text, task.id, task.completed);
    });
}

// Function to add a new task to localStorage
function addTaskToLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTask = {
        id: new Date().getTime(), // Unique ID for the task
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    createTaskElement(newTask.text, newTask.id, newTask.completed); // Creates task dynamically
}

// Function to create a task dynamically
function createTaskElement(taskText, taskId, completed) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('taskRow');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `taskComplete-${taskId}`;
    checkbox.classList.add('taskComplete');
    checkbox.checked = completed;
    checkbox.addEventListener('change', function () {
        toggleTaskCompletion(taskId, checkbox.checked);
    });

    const taskContent = document.createElement('p');
    taskContent.classList.add('taskItem');
    taskContent.textContent = taskText;
    if (completed) {
        taskContent.classList.add('completed'); // Strike through for completed tasks
    }

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteBtn');
    deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
    deleteButton.addEventListener('click', function () {
        deleteTask(taskId);
    });

    tooltip.appendChild(deleteButton);
    
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(tooltip);

    document.querySelector('.displayTaskContainer').appendChild(taskDiv);
}

// Function to toggle task completion (checked/unchecked)
function toggleTaskCompletion(taskId, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        task.completed = isCompleted;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Update the DOM to show the completed status
        const taskElement = document.querySelector(`#taskComplete-${taskId}`).closest('.taskRow');
        const taskContent = taskElement.querySelector('.taskItem');
        if (isCompleted) {
            taskContent.classList.add('completed'); // Add strike-through
        } else {
            taskContent.classList.remove('completed'); // Remove strike-through
        }
    }
}

// Function to delete a task from localStorage
function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Removes the task element from the DOM
    const taskDiv = document.querySelector(`#taskComplete-${taskId}`).closest('.taskRow');
    taskDiv.remove();
}

// Function to filter tasks based on their completion status
function filterTasks(filter) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending' && !task.completed) return true;
        if (filter === 'completed' && task.completed) return true;
        return false;
    });

    // Clear the current task list and display the filtered tasks
    document.querySelector('.displayTaskContainer').innerHTML = '';
    filteredTasks.forEach(task => {
        createTaskElement(task.text, task.id, task.completed);
    });  
}
