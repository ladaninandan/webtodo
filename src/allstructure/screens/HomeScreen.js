import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import SyncStatusBar from '../components/SyncStatusBar';
import { STATUS_TABS } from '../constants';
import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';

const HomeScreen = observer(({ navigation }) => {
  const { updateStatus, deleteTask, syncToServer } = useTasks();

  const filtered = todoStore.filteredTasks;

  const confirmDelete = task =>
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(task._id),
        },
      ]
    );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.sub}>{todoStore.activeTasks.length} total</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTask', {})}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Sync status bar */}
      <SyncStatusBar
        isOnline={todoStore.isOnline}
        isSyncing={todoStore.isSyncing}
        unsyncedCount={todoStore.unsyncedCount}
        onSyncPress={syncToServer}
      />

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {STATUS_TABS.map(tab => (
          <TouchableOpacity
            key={String(tab.value)}
            onPress={() => todoStore.setActiveTab(tab.value)}
            style={[styles.tab, todoStore.activeTab === tab.value && styles.tabActive]}>
            <Text style={[styles.tabText, todoStore.activeTab === tab.value && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list */}
      <View style={styles.listContainer}>
        <FlashList
          data={filtered}
          keyExtractor={item => item._id}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onStatusChange={updateStatus}
              onEdit={task => navigation.navigate('AddTask', { task })}
              onDelete={confirmDelete}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No tasks here</Text>
              <Text style={styles.emptyHint}>Tap "+ New" to add one</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#0F172A', letterSpacing: -0.5 },
  sub: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  addBtn: { backgroundColor: '#6366F1', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 10, gap: 8, paddingTop: 20 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#E2E8F0' },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 13, fontWeight: '500', color: '#64748B' },
  tabTextActive: { color: '#fff' },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  list: { paddingBottom: 32 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#64748B' },
  emptyHint: { fontSize: 14, color: '#94A3B8' },
});