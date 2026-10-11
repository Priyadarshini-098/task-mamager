const taskInput = document.getElementById('task-input');
const addBtn=document.getElementById("add-btn");
const taskList=document.getElementById('task-list');
const counter=document.getElementById('counter');
const filterButtons=document.querySelectorAll(".filter-btn");
let currentFilter="all";

function updateCounter(){
    const pending=taskList.querySelectorAll("li:not(.completed)").length;
    counter.textContent="Pending tasks:"+pending;
}
function applyFilter(){
    const items=taskList.querySelectorAll("li");
    items.forEach(function(li){
        const isCompleted=li.classList.contains("completed");

        if(currentFilter=="all"){
            li.style.display="";
        }else if(currentFilter==="completed"){
            li.style.display=isCompleted?"":"none";
        }else{
            li.style.display=isCompleted?"none":"";        
        }
    });
}
function saveTasks(){
    const tasks=[];

    taskList.querySelectorAll("li").forEach(function(li){
        tasks.push({
            text:li.querySelector("span").textContent,
            completed:li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks",JSON.stringify(tasks));
}
function createTask(text,completed){
    const li=document.createElement("li");

    const checkbox=document.createElement("input");
    checkbox.type="checkbox";

    const span=document.createElement("span");
    span.textContent=text;

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="Delete";

    if(completed){
        li.classList.add("completed");
        checkbox.checked=true;
    }
    checkbox.addEventListener("change",function(){
        li.classList.toggle("completed");
        updateCounter();
        applyFilter();
        saveTasks();
    });
    deleteBtn.addEventListener("click",function(){
        li.remove();
        updateCounter();
        saveTasks();
    }); 

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function loadTasks(){
    const tasks=JSON.parse(localStorage.getItem("tasks"))||[];

    tasks.forEach(function(task){
        createTask(task.text,task.completed);
    });
    updateCounter();
    applyFilter();
}

filterButtons.forEach(function(button){
    button.addEventListener("click",function(){
        currentFilter=button.dataset.filter;

        filterButtons.forEach(function(b){
            b.classList.remove("active");
        });
        button.classList.add("active");
        applyFilter();
    });
});
addBtn.addEventListener("click",function(){
    const taskText=taskInput.value.trim();
    if(taskText===""){
        alert("Please enter a task");
        return;
    }

    createTask(taskText,false);
    updateCounter();
    applyFilter();
    saveTasks();
    
    taskInput.value="";
});
loadTasks();