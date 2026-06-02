import { useEffect, useCallback } from 'react';
import { useRealm, useQuery } from '../database';
import { Task } from '../models/Task';
import NetworkService from '../services/NetworkService';
import { todoStore } from '../stores/TodoStore';

export function useTasks() {
  const realm = useRealm();

  
  const realmTasks = useQuery(Task);

  // Sync Realm 
  useEffect(() => {
    todoStore.syncFromRealm(realmTasks);
  }, [realmTasks]);

  // Network Sync 
  useEffect(() => {
    NetworkService.fetchState();
    const unsub = NetworkService.subscribe(online => {
      todoStore.setIsOnline(online);
      if (online) {
        todoStore.syncToServer(realm);
      }
    });
    return unsub;
  }, [realm]);

  return {
    // Actions 
    addTask: (task) => {
      const newTask = todoStore.addTask(realm, task);
      if (todoStore.isOnline) todoStore.syncToServer(realm);
      return newTask;
    },
    updateTask: (id, changes) => {
      todoStore.updateTask(realm, id, changes);
      if (todoStore.isOnline) todoStore.syncToServer(realm);
    },
    updateStatus: (id, status) => {
      todoStore.updateStatus(realm, id, status);
      if (todoStore.isOnline) todoStore.syncToServer(realm);
    },
    deleteTask: (id) => {
      todoStore.deleteTask(realm, id);
      if (todoStore.isOnline) todoStore.syncToServer(realm);
    },
    syncToServer: () => todoStore.syncToServer(realm),
  };
}