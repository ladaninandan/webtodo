import { makeAutoObservable } from 'mobx';
import { Platform } from 'react-native';
import api from '../services/api';
import { Task } from '../models/Task';
import { SyncLog } from '../models/SyncLog';

class TodoStore {
  // data state
  tasks = []; 
  isOnline = true;
  isSyncing = false;
  lastSyncedAt = null;


  activeTab = null; // Filter tab on HomeScreen

  constructor() {
    makeAutoObservable(this);
  }

  //state actions 
  setIsOnline(status) {
    this.isOnline = status;
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  // sync with Realm
  syncFromRealm(realmTasks) {
    this.tasks = Array.from(realmTasks).map(t => ({
      _id: typeof t._id === 'string' ? t._id : t._id.toHexString(),
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      synced: t.synced,
      isDeleted: t.isDeleted,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  // computed
  get activeTasks() {
    return this.tasks
      .filter(t => !t.isDeleted)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  get filteredTasks() {
    if (this.activeTab) {
      return this.activeTasks.filter(t => t.status === this.activeTab);
    }
    return this.activeTasks;
  }

  get unsyncedCount() {
    return this.tasks.filter(t => !t.synced && !t.isDeleted).length;
  }


  _logAction(realm, action, record) {
    realm.create(SyncLog, {
      action,
      modelName: 'Task',
      recordId: typeof record._id === 'string' ? record._id : record._id.toHexString(),
      payload: JSON.stringify({
        id: typeof record._id === 'string' ? record._id : record._id.toHexString(),
        title: record.title,
        description: record.description,
        priority: record.priority,
        status: record.status,
        isDeleted: record.isDeleted,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      }),
    });
  }

  addTask(realm, { title, description = '', priority = 'medium' }) {
    if (!title?.trim()) return null;
    let newTask;
    realm.write(() => {
      newTask = realm.create(Task, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'todo',
        synced: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this._logAction(realm, 'CREATE', newTask);
    });
    return newTask;
  }

  updateTask(realm, taskId, changes) {
    // taskId is string because our UI uses string keys from MobX
    const taskToUpdate = realm.objects(Task).find(t => t._id.toHexString() === taskId);
    if (!taskToUpdate) return;

    realm.write(() => {
      Object.assign(taskToUpdate, { ...changes, updatedAt: new Date(), synced: false });
      this._logAction(realm, 'UPDATE', taskToUpdate);
    });
  }

  updateStatus(realm, taskId, status) {
    this.updateTask(realm, taskId, { status });
  }

  deleteTask(realm, taskId) {
    const taskToDelete = realm.objects(Task).find(t => t._id.toHexString() === taskId);
    if (!taskToDelete) return;

    realm.write(() => {
      taskToDelete.isDeleted = true;
      taskToDelete.synced = false;
      taskToDelete.updatedAt = new Date();
      this._logAction(realm, 'DELETE', taskToDelete);
    });
  }

  async syncToServer(realm) {
    if (this.isSyncing) return;
    const unsynced = realm.objects(Task).filtered('synced == false');
    if (unsynced.length === 0) return;

    this.isSyncing = true;
    try {
      const payload = Array.from(unsynced).map(t => ({
        _id: typeof t._id === 'string' ? t._id : t._id.toHexString(),
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        isDeleted: t.isDeleted,
        synced: t.synced,
      }));

      const response = await api.post('/tasks/sync', { tasks: payload });

      if (response.status !== 200) {
        throw new Error(`Sync error: ${response.status}`);
      }

      realm.write(() => {
        unsynced.forEach(t => {
          if (t.isDeleted) {
            realm.delete(t);
          } else {
            t.synced = true;
          }
        });
        const logs = realm.objects(SyncLog);
        realm.delete(logs);
      });
      this.lastSyncedAt = new Date();
    } catch (error) {
      console.warn('[Sync failed]', error);
      realm.write(() => {
        const logs = realm.objects(SyncLog);
        logs.forEach(l => { l.retries += 1; });
      });
    } finally {
      this.isSyncing = false;
    }
  }
}

export const todoStore = new TodoStore();
