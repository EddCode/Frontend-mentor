const tasksStorage = JSON.parse(localStorage.getItem("todolist"));
let state = tasksStorage || [];

const $todoList = document.getElementById("todoList");
const $createTaskInput = document.getElementById("createTask");
const $actions = document.querySelectorAll('input[type="radio"]');
const $clear = document.querySelector(".clear");
const $itemsLeft = document.querySelector(".items-left");
const $changeTheme = document.getElementById("changeTheme");

const addTask = (task) => state.push({ ...task });

// Render lists
const renderTasks = (todolist = []) => {
  const reduce = (acc, next) => {
    acc += `<li class="todo-item draggable" draggable="true" data-taskid="${
      next.id
    }">
              <input type="checkbox" id="task_${next.id}"
                      name=${next.task.replaceAll(" ", "_")}
                      ${next.completed && "checked"}
              />
              <label for="task_${next.id}">
                ${next.task}
              </label>
              <span class="remove-item" data-task="${next.id}"id="remove_${
      next.id
    }"></span>
            </li>`;
    return acc;
  };

  $itemsLeft.innerHTML = `${todolist.length} ${
    todolist.length == 1 ? "item" : "items"
  } left`;

  const renderTask =
    todolist.length > 0
      ? todolist.reduce(reduce, "")
      : `<li class="todo-item no-task">
          There's no tasks yet.
      </li>`;

  const remove = (evt) => {
    const id = evt.target.getAttribute("data-task");
    state = state.filter((task) => task.id != id);

    renderTasks(state)($todoList);
  };

  return (el) => {
    el.innerHTML = renderTask;
    localStorage.setItem("todolist", JSON.stringify(state));

    document
      .querySelectorAll(".remove-item")
      .forEach((el) => el.addEventListener("click", remove));

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

state.length == 0 ? renderTasks()($todoList) : renderTasks(state)($todoList);

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

const changeTheme = (evt) => {
  const $body = document.getElementsByTagName("body");
  $body[0].classList.toggle("dark");
  evt.target.classList.toggle("dark");
};

const clearCompletedTasks = (evt) => {
  state = state.filter((task) => !task.completed);
  renderTasks(state)($todoList);
};

const setColorSchema = (evt) => {
  evt.matches
    ? document.querySelector("body").classList.add("dark")
    : document.querySelector("body").classList.remove("dark");
};

const initColorSchema = () => {
  const userPrefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  const colorSchema = window.matchMedia("(prefers-color-scheme: dark)");

  setColorSchema(userPrefersDark);
  colorSchema.addListener(setColorSchema);
};

initColorSchema();

$actions.forEach((element) => element.addEventListener("click", completeTask));
$createTaskInput.addEventListener("keyup", listener);
$clear.addEventListener("click", clearCompletedTasks);
$changeTheme.addEventListener("click", changeTheme);
