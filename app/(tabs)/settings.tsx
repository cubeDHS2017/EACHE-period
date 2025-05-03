import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#888"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', // Change if using dark mode
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000', // <— ensures text is visible
    backgroundColor: '#fff',
  },
});
