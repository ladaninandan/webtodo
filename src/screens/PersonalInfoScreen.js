import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PersonalInfoScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.text}>Personal Info</Text>
      <Text style={styles.subText}>Here you can manage your personal details.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
