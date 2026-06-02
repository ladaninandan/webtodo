import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { observer } from 'mobx-react-lite';
import { PRIORITY_OPTIONS } from '../constants';

const AddTaskScreen = observer(({ navigation, route }) => {
  const existing = route.params?.task ?? null;
  const isEditing = !!existing;
  const { addTask, updateTask } = useTasks();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [priority, setPriority] = useState(existing?.priority ?? 'medium');

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Edit Task' : 'New Task' });
  }, [isEditing]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a task title.');
      return;
    }
    if (isEditing) {
      updateTask(existing._id, { title: title.trim(), description: description.trim(), priority });
    } else {
      addTask({ title, description, priority });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 80}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Complete inspection report"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Optional details..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITY_OPTIONS.map(p => {
              const selected = priority === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  onPress={() => setPriority(p.value)}
                  style={[
                    styles.priorityBtn,
                    { borderColor: p.color },
                    selected && { backgroundColor: p.color + '20' },
                  ]}>
                  <Text style={[styles.priorityBtnText, { color: selected ? p.color : '#94A3B8' }]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Offline note */}
          <View style={styles.note}>
            <Text style={styles.noteText}>
               Saved locally right away. Syncs to server automatically when online.
            </Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{isEditing ? 'Save changes' : 'Add task'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
});

export default AddTaskScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  container: { paddingHorizontal: 20, paddingBottom: 120 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 20, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1E293B' },
  multiline: { height: 110, paddingTop: 14 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: '#fff', },
  priorityBtnText: { fontSize: 14, fontWeight: '600' },
  note: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginTop: 24 },
  noteText: { fontSize: 13, color: '#3B82F6', lineHeight: 20 },
  saveBtn: { backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  cancelBtnText: { color: '#94A3B8', fontSize: 15 },
});