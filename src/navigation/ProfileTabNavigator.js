import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';

const TopTab = createMaterialTopTabNavigator();

export default function ProfileTabNavigator() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#64748B',
        tabBarIndicatorStyle: { backgroundColor: '#6366F1' },
        tabBarLabelStyle: { fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#F8FAFC', shadowOpacity: 0, elevation: 0 },
      }}
    >
      <TopTab.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ tabBarLabel: 'Personal' }} />
      <TopTab.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ tabBarLabel: 'Account' }} />
    </TopTab.Navigator>
  );
}
