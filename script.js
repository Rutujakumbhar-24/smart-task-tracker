// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const emptyState = document.getElementById('emptyState');

const STORAGE_KEY = 'my_tasks';

// Load tasks safely from LocalStorage
let tasks = [];
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  tasks = Array.isArray(stored) ? stored : [];
} catch {
  tasks = [];
}

// Save to LocalStorage and update UI
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage full/blocked: app still works for this session
  }
  renderTasks();
}

// Sanitize text before putting it in innerHTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render the task list
function renderTasks() {
  taskList.innerHTML = '';

  const isEmpty = tasks.length === 0;
  emptyState.classList.toggle('d-none', !isEmpty);
  clearAllBtn.classList.toggle('d-none', isEmpty);

  let pendingTasks = 0;

  tasks.forEach((task, index) => {
    if (!task.completed) pendingTasks++;

    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center task-item p-3${task.completed ? ' done' : ''}`;
    li.dataset.index = index;

    li.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <input
          class="form-check-input mt-0 task-check"
          type="checkbox"
          ${task.completed ? 'checked' : ''}
          aria-label="Mark task as completed"
          style="cursor: pointer; width: 1.25rem; height: 1.25rem;"
        >
        <span class="task-text ${task.completed ? 'completed-task' : ''}">
          ${escapeHtml(task.text)}
        </span>
      </div>
      <button class="btn btn-sm text-danger p-0 ms-2 delete-btn" aria-label="Delete task" title="Delete task">
        <i class="bi bi-x-circle fs-5"></i>
      </button>
    `;

    taskList.appendChild(li);
  });

  taskCount.textContent = `${pendingTasks} tasks bache hain`;
}

// Add task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveTasks();
});

// Toggle complete (event delegation)
taskList.addEventListener('change', (e) => {
  if (!e.target.matches('.task-check')) return;
  const index = Number(e.target.closest('li').dataset.index);
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
});

// Delete single task (event delegation)
taskList.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete-btn');
  if (!btn) return;
  const index = Number(btn.closest('li').dataset.index);
  tasks.splice(index, 1);
  saveTasks();
});

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
  if (confirm('Kya aap saare tasks delete karna chahte hain?')) {
    tasks = [];
    saveTasks();
  }
});

// Initial render
renderTasks();