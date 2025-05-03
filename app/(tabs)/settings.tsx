import { View, TextInput, Button, StyleSheet, Text, Keyboard, useColorScheme } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation to navigate

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const colorScheme = useColorScheme();
  const navigation = useNavigation(); // Get the navigation object

  const handleSave = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem('username', name.trim());
      Keyboard.dismiss(); // Dismiss keyboard after saving
      // alert('Name saved!');
      
      // Navigate back to the Home screen
      navigation.goBack();
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
    },
    input: {
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#888' : '#ccc',
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      color: colorScheme === 'dark' ? '#fff' : '#000',
      backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
      marginBottom: 12,
    },
    button: {
      backgroundColor: colorScheme === 'dark' ? '#444' : '#007bff',
    },
    buttonText: {
      color: colorScheme === 'dark' ? '#fff' : '#fff',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 20,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.heading}>Settings</Text>
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
        style={dynamicStyles.input}
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleSave}
        returnKeyType="done"
      />
      <Button title="Save" onPress={handleSave} color={dynamicStyles.button.backgroundColor} />
    </View>
  );
}
