const Storage = (() => {
  const KEY = "task_manager_tasks_v1";

  const save = (tasks) => {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  };

  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  };

  return { save, load };
})();

const App = (() => {
  const form = document.getElementById("taskForm");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const validation = document.getElementById("validation");
  const tasksContainer = document.getElementById("tasksContainer");
  const statsEl = document.getElementById("stats");
  const searchInput = document.getElementById("search");
  const filterCategory = document.getElementById("filterCategory");
  const filterStatus = document.getElementById("filterStatus");
  const clearCompletedBtn = document.getElementById("clearCompleted");
  const themeSwitch = document.getElementById("themeSwitch");

  let tasks = Storage.load();

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const sanitizeTitle = (title) =>
    title.replace(/\s+/g, " ").trim();

  function createTaskCard(task) {
    const card = document.createElement("article");
    card.className = "card";

    if (task.status === "completed") {
      card.classList.add("completed");
    }

    card.dataset.id = task.id;
    card.dataset.status = task.status;
    card.dataset.category = task.category;

    const title = document.createElement("h3");
    title.className = "title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "meta";

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = task.category;

    const status = document.createElement("span");
    status.className = "status small";
    status.textContent = task.status;

    meta.append(category, status);

    const controls = document.createElement("div");
    controls.className = "controls";

    const editBtn = document.createElement("button");
    editBtn.className = "linkless edit";
    editBtn.textContent = "Edit";

    const completeBtn = document.createElement("button");
    completeBtn.className = "linkless complete";
    completeBtn.textContent = "Complete";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "linkless delete";
    deleteBtn.textContent = "Delete";

    controls.append(editBtn, completeBtn, deleteBtn);
    card.append(title, meta, controls);

    return card;
  }

  function applyFilters(list) {
    const search = searchInput.value.toLowerCase();
    const category = filterCategory.value;
    const status = filterStatus.value;

    return list.filter((task) => {
      if (category !== "all" && task.category !== category) return false;
      if (status !== "all" && task.status !== status) return false;
      if (
        search &&
        !task.title.toLowerCase().includes(search)
      )
        return false;

      return true;
    });
  }

  function renderTasks() {
    tasksContainer.innerHTML = "";

    applyFilters(tasks).forEach((task) => {
      tasksContainer.append(createTaskCard(task));
    });

    updateStats();
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    statsEl.innerHTML = `
      <div>
        <strong>Total:</strong> ${total} |
        <strong>Completed:</strong> ${completed} |
        <strong>Pending:</strong> ${total - completed}
      </div>
    `;
  }

  const persist = () => Storage.save(tasks);

  function addTask(title, category) {
    const task = {
      id: uid(),
      title,
      category,
      status: "pending",
    };

    tasks.unshift(task);
    persist();

    tasksContainer.prepend(createTaskCard(task));
    updateStats();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);

    const card = tasksContainer.querySelector(
      `[data-id="${id}"]`
    );

    if (card) card.remove();

    persist();
    updateStats();
  }

  function completeTask(id) {
    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    task.status = "completed";
    persist();

    const card = tasksContainer.querySelector(
      `[data-id="${id}"]`
    );

    if (card) {
      card.classList.add("completed");
      card.dataset.status = "completed";
      card.querySelector(".status").textContent =
        "completed";
    }

    updateStats();
  }

  function editTask(id) {
    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    const newTitle = prompt("Edit task", task.title);

    if (newTitle === null) return;

    const cleanTitle = sanitizeTitle(newTitle);

    if (!cleanTitle) {
      alert("Title cannot be empty");
      return;
    }

    task.title = cleanTitle;
    persist();

    const oldCard = tasksContainer.querySelector(
      `[data-id="${id}"]`
    );

    if (oldCard) {
      oldCard.replaceWith(createTaskCard(task));
    }

    updateStats();
  }

  function clearCompleted() {
    tasks = tasks.filter(
      (task) => task.status !== "completed"
    );

    persist();

    document
      .querySelectorAll(".completed")
      .forEach((card) => card.remove());

    updateStats();
  }

  function handleTaskActions(e) {
    const button = e.target;
    const card = button.closest(".card");

    if (!card) return;

    const id = card.dataset.id;

    if (button.classList.contains("delete")) {
      deleteTask(id);
    } else if (button.classList.contains("complete")) {
      completeTask(id);
    } else if (button.classList.contains("edit")) {
      editTask(id);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const title = sanitizeTitle(titleInput.value);

    if (!title) {
      validation.textContent =
        "Task title cannot be empty";
      return;
    }

    validation.textContent = "";

    addTask(title, categorySelect.value);

    form.reset();
    titleInput.focus();
  }

  function setupEvents() {
    form.addEventListener("submit", handleSubmit);

    tasksContainer.addEventListener(
      "click",
      handleTaskActions
    );

    searchInput.addEventListener("input", renderTasks);
    filterCategory.addEventListener("change", renderTasks);
    filterStatus.addEventListener("change", renderTasks);

    clearCompletedBtn.addEventListener("click", clearCompleted);

    themeSwitch.addEventListener("change", (e) => {
      const theme = e.target.checked ? "dark" : "light";

      document.body.dataset.theme = theme;
      localStorage.setItem("tm_theme", theme);
    });

    const grandparent = document.getElementById("grandparent");
    const parent = document.getElementById("parent");
    const child = document.getElementById("childBtn");

    grandparent.addEventListener(
      "click",
      () => console.log("Grandparent Capture"),
      true
    );

    parent.addEventListener(
      "click",
      () => console.log("Parent Capture"),
      true
    );

    child.addEventListener(
      "click",
      () => console.log("Child Capture"),
      true
    );

    child.addEventListener("click", () =>
      console.log("Child Bubble")
    );

    parent.addEventListener("click", () =>
      console.log("Parent Bubble")
    );

    grandparent.addEventListener("click", () =>
      console.log("Grandparent Bubble")
    );
  }

  function init() {
    const theme =
      localStorage.getItem("tm_theme") || "light";

    document.body.dataset.theme = theme;
    themeSwitch.checked = theme === "dark";

    setupEvents();
    renderTasks();
  }

  return { init };
})();

window.addEventListener("DOMContentLoaded", () => {
  App.init();
});