// App.js — Root entry point
// RealmProvider must wrap everything so hooks work in all screens.
import React from 'react';
import { RealmProvider } from './src/database/index';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <RealmProvider>
      <AppNavigator />
    </RealmProvider>
  );
}