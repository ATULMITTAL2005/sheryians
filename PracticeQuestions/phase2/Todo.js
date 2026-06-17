let  list =[];

function addTodo(task) {
      const todo = {
        id: list.length + 1,
        task: task,
        done: false
    };
 list.push(todo);
    console.log("Todo added:", todo);
}

function removeTodo(todo) {
    const index = list.indexOf(todo);
    if (index > -1) {
        list.splice(index, 1);
        console.log("Todo removed: " + todo);
    } else {
        console.log("Todo not found: " + todo);
    }
}

function completeTodo(id) {
    const todo = list.find(t => t.id === id);
    if (todo) {
        todo.done = true;
        console.log("Todo completed: " + todo.task);
    } else {
        console.log("Todo not found: " + id);
    }
}

function showTodos() {
    list.forEach(todo => {
        console.log(`id: ${todo.id}, Task: ${todo.task}, Done: ${todo.done}`);
    });
}

addTodo("Buy groceries");
addTodo("Clean the house");



showTodos();