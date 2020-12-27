let state = [];

const $todoList = document.getElementById("todoList");
const $createTaskInput = document.getElementById("createTask");
const $actions = document.querySelectorAll('input[type="radio"]');

const addTask = (task) => state.push({ ...task });

// Render lists
const renderTasks = (todolist = []) => {
  const reduce = (acc, next) => {
    acc += `<li class="todo-item" data-taskid="${next.id}">
              <input type="checkbox" id="task_${next.id}" 
                      name=${next.task.replaceAll(" ", "_")}
                      ${next.completed && "checked"}
              />
              <label for="task_${next.id}">
                ${next.task}
              </label>
            </li>`;
    return acc;
  };

  const renderTask =
    todolist.length > 0
      ? todolist.reduce(reduce, "")
      : `<li class="todo-item no-task">
          There's no tasks yet.
      </li>`;

  return (el) => {
    el.innerHTML = renderTask;
    for (let taskElement of el.children) {
      const input = taskElement.children[0];
      if (input) {
        input.addEventListener("click", (evt) => {
          const taskId = evt.target.getAttribute("id").split("_").pop();
          state = state.map((data) =>
            data.id == taskId
              ? { ...data, completed: evt.target.checked }
              : { ...data }
          );
        });
      }
    }
  };
};

const listener = (e) => {
  if (e.keyCode == 13) {
    const text = e.target.value;
    addTask({ task: text, completed: false, id: state.length + 1 });
    renderTasks(state)($todoList);
    e.target.value = "";
  }
};

if (state.length == 0) {
  renderTasks()($todoList);
}

const completeTask = (evt) => {
  const action = evt.target.getAttribute("id");
  let taskWillBeRender;
  switch (action) {
    case "all":
      taskWillBeRender = state;
      break;
    case "active":
      taskWillBeRender = state.filter((task) => !task.completed);
      break;
    case "completed":
      taskWillBeRender = state.filter((task) => task.completed);
      break;
  }

  renderTasks(taskWillBeRender)($todoList);
};

$actions.forEach((element) => element.addEventListener("click", completeTask));
$createTaskInput.addEventListener("keyup", listener);
