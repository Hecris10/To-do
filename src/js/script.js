/* eslint-disable no-unused-vars */
const simboloFeito =
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
</svg>`.trim();

const editButton =
  `<svg width="40px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round"
  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
</svg>`.trim();

const deleteButton =
  `<svg width="40px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round"
  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>`.trim();

let editMode = false;
let editItemId = null;

const getItems = () => {
  return JSON.parse(localStorage.getItem("tarefas")) || [];
};

const formatDate = (date) => {
  const formatDate = new Date(date);
  return formatDate.toLocaleDateString("pt-BR");
};

const saveItems = (tarefas) => {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  alert("Sua Terafa foi salva com sucesso!");
};

const loadItems = (allItems) => {
  const tarefas = allItems || getItems();
  const taskList = document.createElement("div");
  taskList.classList.add("task-list");
  taskList.id = "task-list";

  tarefas.forEach((element) => {
    const task = document.createElement("div");
    task.classList.add("task");

    const taskStatus = document.createElement("div");
    taskStatus.classList.add("task-status");
    element.completed
      ? taskStatus.classList.add("task-done")
      : taskStatus.classList.add("task-undone");
    taskStatus.addEventListener("click", () => {
      element.completed = !element.completed;
      saveItems(tarefas);
      loadItems();
    });
    taskStatus.innerHTML = simboloFeito;

    const taskText = document.createElement("div");
    taskText.classList.add("task-text");

    const taskName = document.createElement("p");
    taskName.classList.add("task-name");
    taskName.innerHTML = element.name;

    const taskDates = document.createElement("div");
    taskDates.classList.add("task-dates");

    const taskInit = document.createElement("p");
    const taskEnd = document.createElement("p");

    taskInit.classList.add("task-date");
    taskEnd.classList.add("task-date");

    taskInit.innerHTML = formatDate(element.init);
    taskEnd.innerHTML = formatDate(element.end);

    taskDates.appendChild(taskInit);
    taskDates.appendChild(taskEnd);

    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    editBtn.addEventListener("click", () => editTask(element));
    deleteBtn.addEventListener("click", () => removeTask(element.id));

    editBtn.classList.add("svg-btn");
    deleteBtn.classList.add("svg-btn");

    taskText.appendChild(taskName);
    taskText.appendChild(taskDates);

    editBtn.innerHTML = editButton;
    deleteBtn.innerHTML = deleteButton;

    task.appendChild(taskStatus);
    task.appendChild(taskText);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);

    taskList.appendChild(task);
  });

  document.getElementById("task-list").replaceWith(taskList);
};

// eslint-disable-next-line no-unused-vars
const onLoad = () => {
  loadItems(getItems());
};

const newTask = () => {
  const taskName = document.getElementById("new-task-name").value;
  const taskInit = document.getElementById("new-task-init").value;
  const taskEnd = document.getElementById("new-task-end").value;

  if (taskName === "" || taskInit === "" || taskEnd === "") {
    alert("Preencha todos os campos!");
    return;
  }
  const allTasks = getItems();
  allTasks.push({
    id: allTasks.length + 1,
    name: taskName,
    completed: false,
    init: taskInit,
    end: taskEnd,
  });
  saveItems(allTasks);
  loadItems(allTasks);
  //   document.getElementById("new-task-name").value = "";
  //   document.getElementById("new-task-init").value = "";
  //   document.getElementById("new-task-end").value = "";
};

// eslint-disable-next-line no-unused-vars
const handleSaveTask = () => {
  if (editMode === true) {
    return saveEdit();
  } else {
    return newTask();
  }
};

const editTask = (element) => {
  editMode = true;
  editItemId = element.id;
  document.getElementById("new-task-name").value = element.name;
  document.getElementById("new-task-init").value = element.init;
  document.getElementById("new-task-end").value = element.end;
};

const saveEdit = () => {
  const fetchTasks = getItems();
  const i = fetchTasks.findIndex((e) => e.id === editItemId);
  fetchTasks[i].name = document.getElementById("new-task-name").value;
  fetchTasks[i].init = document.getElementById("new-task-init").value;
  fetchTasks[i].end = document.getElementById("new-task-end").value;
  editMode = false;
  saveItems(fetchTasks);
  loadItems();
};

const removeTask = (id) => {
  if (confirm("Deseja realmente excluir a tarefa?")) {
    let allTasks = getItems();
    allTasks = allTasks.filter((task) => task.id !== id);
    saveItems(allTasks);
    loadItems(allTasks);
  }
};
// eslint-disable-next-line no-unused-vars
const searchItems = (searchValue) => {
  const filteredItems =
    searchValue.length > 0
      ? getItems().filter((e) =>
          e.name.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : getItems();
  loadItems(filteredItems);
};

const openFilters = () => {
  const filters = document.getElementById("filters-popup");
  filters.classList.toggle("filters-display");
};

const setFilterItems = () => {
  const isDone = document.getElementById("filter-done").checked;
  const isUndone = document.getElementById("filter-undone").checked;
  let filteredItems = getItems();
  if (isUndone || isDone) {
    filteredItems = filteredItems.filter((e) => {
      if (isDone && isUndone) {
        return true;
      } else if (isDone) {
        return e.completed === true;
      } else if (isUndone) {
        return e.completed === false;
      }
    });
  }
  const filterDateInit = document.getElementById("filter-date-init").value;
  if (filterDateInit || filterDateInit !== "") {
    filteredItems = filteredItems.filter(
      (e) => Date.parse(e.init) >= Date.parse(filterDateInit),
    );
  }
  const filterDateEnd = document.getElementById("filter-date-end").value;
  if (filterDateEnd || filterDateEnd !== "") {
    filteredItems = filteredItems.filter(
      (e) => Date.parse(e.end) <= Date.parse(filterDateEnd),
    );
  }
  const filters = document.getElementById("filters-popup");
  filters.classList.toggle("filters-display");
  loadItems(filteredItems);
};

const cleanFilters = () => {
  document.getElementById("filter-date-init").value = "";
  document.getElementById("filter-date-end").value = "";
  document.getElementById("filter-done").checked = false;
  const filters = document.getElementById("filters-popup");
  filters.classList.toggle("filters-display");
  loadItems();
};
