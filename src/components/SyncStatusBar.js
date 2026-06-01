import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

export default function SyncStatusBar({ isOnline, isSyncing, unsyncedCount, onSyncPress }) {
  const bg = isOnline ? '#059669' : '#DC2626';

  const message = isSyncing
    ? 'Syncing to server...'
    : isOnline
    ? unsyncedCount > 0
      ? `Online · ${unsyncedCount} unsynced`
      : 'Online · All synced '
    : `Offline · ${unsyncedCount} queued`;

  return (
    <View style={[styles.bar, { backgroundColor: bg }]}>
      {isSyncing && <ActivityIndicator size="small" color="#fff" style={styles.spinner} />}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  spinner: { marginRight: 8 },
  text: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '500',textAlign:'center' },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent:'center',
  },
    
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700', },
});

