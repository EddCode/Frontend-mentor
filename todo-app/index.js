const state = [];

const $todoList = document.getElementById("todoList");
const $createTaskInput = document.getElementById("createTask");

const addTask = (task) => state.push({ ...task });

// Render lists
const renderTasks = (todolist) => {
  const reduce = (acc, next) => {
    acc += `<li class="todo-item" data-taskid="${next.id}">
              ${next.task}
            </li>`;
    return acc;
  };

  const renderTask =
    state.length > 0
      ? todolist.reduce(reduce, "")
      : `<li class="todo-item no-task">
          There's no tasks yet.
      </li>`;

  return (el) => (el.innerHTML = renderTask);
};

const listener = (e) => {
  if (e.keyCode == 13) {
    const text = e.target.value;
    addTask({ task: text, completed: false, id: 1 });
    renderTasks(state)($todoList);
    e.target.value = "";
  }
};

if (state.length == 0) {
  renderTasks(null)($todoList);
}

$createTaskInput.addEventListener("keyup", listener);
