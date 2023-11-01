/* Capturo los elementos con los que voy a trabajar del document  */

const tasksList = document.querySelector('#tasks-list');
const newTaskInput = document.querySelector('#new-task-input');
const addTaskButton = document.querySelector('#add-task-button');

const tasks = []

const app = {
    tasks,
    tasksList,
    newTaskInput

}



/* El objeto anterior es lo mismo que el siguiente, 
lo que pasa es que JS agrego nuevas características y una de ellas es que si
la clave es lo mismo que el valor se puede poner directamente una.

const app = {
    tasks: tasks,
    tasksList: tasksList ,
    newTaskInput: newTaskInput
}
*/


// Vamos a utilizar localStorage para la persistencia de los datos más allá del cierre de navegador


// traer del localStorage las tareas que tenemos guardadas (si las hay)

window.onload = function(){
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || [])  // Si devuelve false es un array vacío

    app.tasks = savedTasks.map((task) => {
        return createTask(task.title, task.isCompleted);
    });

    app.tasks.forEach((task) => {
        return addTaskToList(task, app.tasksList)
    })
    
}


  // Creamos una función para guardar en localStorage 
function saveTasksToLocalStorage(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

////

function createTask(title, isCompleted = false){
    return{
        id: Date.now(),
        title,
        isCompleted,
    }
}


function addTaskToList(task, tasksList){
    const taskElement = createTaskElement(task);
    tasksList.appendChild(taskElement)
}

function addTask(app) {
    const newTaskTitle = app.newTaskInput.value;
    const newTask = createTask(newTaskTitle);
    app.tasks.push(newTask)
    addTaskToList(newTask, app.tasksList)
    saveTasksToLocalStorage(app.tasks); // Almaceno en localStorage
    app.newTaskInput.value='';
}


// Representación en HTML:

function createTaskElement(task){
    const taskElement = document.createElement('li');
    const taskCheckbox = document.createElement('input')
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.isCompleted;
    taskCheckbox.addEventListener('change', () => {
        task.isCompleted = taskCheckbox.checked;
        saveTasksToLocalStorage(app.tasks) 
        taskText.classList.toggle('completed',task.isCompleted);
    })


    const taskText = document.createElement('span');
    taskText.textContent = task.title;
    taskText.classList.toggle('completed', task.isCompleted);

    const taskDeleteButton = document.createElement('button')
    taskDeleteButton.textContent = 'Eliminar';
    taskDeleteButton.className = 'delete-button'
    taskDeleteButton.addEventListener('click', () => {
        // Elimina la tarea de la lista
        taskElement.remove(); // lo elimino del DOM

        const taskIndex = app.tasks.indexOf(task); // extraigo el índice en donde esta la tarea dentro del array
    
        if(taskIndex > -1 ){   // si ese indice es mayor que menos significa que existe en el array
            app.tasks.splice(taskIndex,1);
        }
        // Una vez que tenemos el array modificado nuevamente salvamos en localStorage
        saveTasksToLocalStorage(app.tasks) 

    })

    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(taskDeleteButton);

    return taskElement;

}


// cuando se clickea 
addTaskButton.addEventListener('click', () => {
    addTask(app);
})

// cuando se presiona "Enter"
newTaskInput.addEventListener('keydown', (event) => {
    if(event.key === "Enter"){
        addTask(app);
    }

})