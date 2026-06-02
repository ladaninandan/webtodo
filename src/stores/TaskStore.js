import { makeAutoObservable } from 'mobx';
import { generateId } from '../utils/helpers';
import api from '../services/api';

class TaskStore {
  tasks = [];
  activeTab = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.loadTasks();
  }

  // Load from local storage and fetch latest from server
  async loadTasks() {
    // 1. Instant load from localStorage
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch (e) {
        this.tasks = [];
      }
    }
    
    // 2. Fetch fresh tasks from API
    await this.fetchTasks();
  }

  async fetchTasks() {
    this.isLoading = true;
    try {
      const response = await api.get('/tasks');
      if (response.data && Array.isArray(response.data)) {
        // Filter out soft deleted tasks from backend
        this.tasks = response.data.filter(t => !t.isDeleted);
        this.saveToLocalStorage();
      }
    } catch (e) {
      console.warn('Backend API fetch failed, running in offline mode:', e.message);
    } finally {
      this.isLoading = false;
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  get activeTasks() {
    return [...this.tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  get filteredTasks() {
    if (this.activeTab) {
      return this.activeTasks.filter(t => t.status === this.activeTab);
    }
    return this.activeTasks;
  }

  // Helper to send sync requests in background
  async syncTask(taskPayload) {
    try {
      await api.post('/tasks/sync', { tasks: [taskPayload] });
    } catch (e) {
      console.error('Failed to sync task with backend:', e);
    }
  }

  addTask({ title, description = '', priority = 'medium' }) {
    if (!title?.trim()) return null;
    const newTask = {
      _id: generateId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.tasks.unshift(newTask);
    this.saveToLocalStorage();
    
    // Add to backend DB
    this.syncTask({ ...newTask, synced: false, isDeleted: false });
    
    return newTask;
  }

  updateTask(taskId, changes) {
    const task = this.tasks.find(t => t._id === taskId);
    if (!task) return;

    Object.assign(task, {
      ...changes,
      updatedAt: new Date().toISOString(),
    });
    this.saveToLocalStorage();

    // Sync updates to backend DB
    this.syncTask({ ...task, synced: false, isDeleted: false });
  }

  updateStatus(taskId, status) {
    this.updateTask(taskId, { status });
  }

  deleteTask(taskId) {
    const task = this.tasks.find(t => t._id === taskId);
    if (!task) return;

    // Filter out from local array
    this.tasks = this.tasks.filter(t => t._id !== taskId);
    this.saveToLocalStorage();

    // Send soft-delete to backend DB to remove it
    this.syncTask({ ...task, isDeleted: true, synced: false });
  }
}

export const taskStore = new TaskStore();
export default taskStore;
