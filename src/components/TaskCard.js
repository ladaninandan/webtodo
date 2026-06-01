import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PRIORITY_COLOR = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
};

const STATUS_LABEL = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const STATUS_NEXT = {
  todo: 'inprogress',
  inprogress: 'done',
  done: 'todo',
};

const STATUS_BG = {
  todo: '#F1F5F9',
  inprogress: '#DBEAFE',
  done: '#DCFCE7',
};

export default function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.stripe,
          { backgroundColor: PRIORITY_COLOR[task.priority] },
        ]}
      />

      <View style={styles.body}>
        {/* Header */}
        <View style={styles.row}>
          <Text
            style={[
              styles.title,
              task.status === 'done' && styles.titleDone,
            ]}
            numberOfLines={1}>
            {task.title}
          </Text>

          <View
            style={[
              styles.dot,
              {
                backgroundColor: task.synced
                  ? '#22C55E'
                  : '#F59E0B',
              },
            ]}
          />
        </View>

        {/* Description */}
        {!!task.description && (
          <Text style={styles.desc} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.statusPill,
              { backgroundColor: STATUS_BG[task.status] },
            ]}
            onPress={() =>
              onStatusChange(task._id, STATUS_NEXT[task.status])
            }>
            <Text style={styles.statusText}>
              {STATUS_LABEL[task.status]}
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.priority,
              { color: PRIORITY_COLOR[task.priority] },
            ]}>
            {task.priority.toUpperCase()}
          </Text>

          {/* Right Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => onEdit(task)}
              style={styles.iconBtn}>
              <Text style={styles.icon}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(task)}
              style={[styles.iconBtn, styles.deleteBtn]}>
              <Text style={styles.icon}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    borderBlockColor:'gray',
    borderWidth:0
  },

  stripe: {
    width: 5,
  },

  body: {
    flex: 1,
    padding: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },

  titleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },

  desc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },

  priority: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: 10,
  },

  actionButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 8,
  },

  iconBtn: {
    height: 32,
    minWidth: 65,
    backgroundColor: '#BFC7D1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  deleteBtn: {
    backgroundColor: '#FECACA',
  },

  icon: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
});