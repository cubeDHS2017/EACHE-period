import React, { useEffect, useState, useCallback } from 'react'; // Import React and hooks like useCallback
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase'; // Adjust import as needed
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

export default function HomeScreen() {
  const [classes, setClasses] = useState<string[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const colorScheme = useColorScheme();

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);

        const storedName = await AsyncStorage.getItem('username');
        setName(storedName);

        if (storedName) {
          const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('name_first', storedName)
            .single();

          console.log("Fetched data:", data);  // Log the fetched data

          if (!error && data) {
            const periods = ['period_1', 'period_2', 'period_3'];
            const periodClassIds = periods.map((p) => (data[p] ? data[p] : 'No class'));
            setClasses(periodClassIds);
          } else {
            console.error("Error fetching student data:", error?.message);
          }
        }

        setLoading(false); // Stop loading once done
      };

      load();
    }, []) // Empty dependency array to only run on focus
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginTop: 40,
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    },
    classItem: {
      fontSize: 18,
      marginBottom: 8,
      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.heading}>Eache class for {name ?? '...'}:</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        classes.map((c, idx) => (
          <Text key={idx} style={dynamicStyles.classItem}>
            Period {idx + 1}: {c}
          </Text>
        ))
      )}
    </View>
  );
}
