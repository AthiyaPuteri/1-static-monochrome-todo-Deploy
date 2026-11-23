/**
 * Task Ledger - Monochromatic Static Edition
 * Production-Ready Vanilla JS Implementation
 * BNI ODP IT 2026 - Deployment Demonstration
 */

'use strict';

(function () {
  const STORAGE_KEY = 'bni_static_todos_v1';

  // State
  let todos = [];
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'

  // DOM Elements
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');
  const itemsLeftCount = document.getElementById('itemsLeftCount');
  const countAll = document.getElementById('countAll');
  const countActive = document.getElementById('countActive');
  const countCompleted = document.getElementById('countCompleted');
  const btnClearCompleted = document.getElementById('btnClearCompleted');
  const filterTabs = document.querySelectorAll('.tab-item');

  /**
   * Memuat data tasks dari LocalStorage dengan validasi defensif
   */
  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          todos = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('[Task Ledger] Gagal memuat LocalStorage, menggunakan daftar awal kosong.', e);
    }

    // Default seed data jika storage masih kosong
    todos = [
      { id: 't-' + Date.now() + '-1', text: 'Konfigurasi Nginx reverse proxy & static block', completed: true, createdAt: Date.now() - 3600000 },
      { id: 't-' + Date.now() + '-2', text: 'Tuliskan Dockerfile multi-stage build untuk produksi', completed: false, createdAt: Date.now() - 1800000 },
      { id: 't-' + Date.now() + '-3', text: 'Uji coba deployment branch main ke Netlify', completed: false, createdAt: Date.now() }
    ];
    saveTodos();
  }

  /**
   * Menyimpan data tasks ke LocalStorage
   */
  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('[Task Ledger] LocalStorage quota exceeded atau dinonaktifkan browser.', e);
    }
  }

  /**
   * Menambahkan todo baru
   * @param {string} text
   */
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo = {
      id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    };

    todos.unshift(newTodo);
    saveTodos();
    render();
  }

  /**
   * Mengubah status selesai/aktif todo
   * @param {string} id
   */
  function toggleTodo(id) {
    todos = todos.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    saveTodos();
    render();
  }

  /**
   * Menghapus todo berdasarkan ID
   * @param {string} id
   */
  function deleteTodo(id) {
    todos = todos.filter(item => item.id !== id);
    saveTodos();
    render();
  }

  /**
   * Menghapus seluruh todo yang sudah selesai
   */
  function clearCompleted() {
    todos = todos.filter(item => !item.completed);
    saveTodos();
    render();
  }

  /**
   * Menyaring daftar todo berdasarkan filter yang aktif
   */
  function getFilteredTodos() {
    if (currentFilter === 'active') {
      return todos.filter(t => !t.completed);
    }
    if (currentFilter === 'completed') {
      return todos.filter(t => t.completed);
    }
    return todos;
  }

  /**
   * Memperbarui UI ke layar
   */
  function render() {
    const filtered = getFilteredTodos();
    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;

    // Update Counter Badges
    countAll.textContent = todos.length;
    countActive.textContent = activeCount;
    countCompleted.textContent = completedCount;
    itemsLeftCount.textContent = activeCount;

    btnClearCompleted.disabled = completedCount === 0;

    // Render Items
    todoList.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';

      filtered.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);

        // Checkbox container & text
        const leftDiv = document.createElement('div');
        leftDiv.className = 'todo-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.setAttribute('aria-label', `Tandai "${todo.text}" sebagai ${todo.completed ? 'belum selesai' : 'selesai'}`);

        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(textSpan);

        // Actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'todo-actions';

        const btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.className = 'btn-delete-item';
        btnDelete.innerHTML = '&times;';
        btnDelete.setAttribute('aria-label', `Hapus tugas "${todo.text}"`);
        btnDelete.title = 'Hapus tugas';

        btnDelete.addEventListener('click', () => deleteTodo(todo.id));

        actionsDiv.appendChild(btnDelete);

        li.appendChild(leftDiv);
        li.appendChild(actionsDiv);
        todoList.appendChild(li);
      });
    }
  }

  // Event Listeners
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = '';
    todoInput.focus();
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentFilter = tab.getAttribute('data-filter') || 'all';
      render();
    });
  });

  btnClearCompleted.addEventListener('click', () => {
    clearCompleted();
  });

  // Inisialisasi
  loadTodos();
  render();
})();
