// index.tsx (HomeScreen)
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const [classes, setClasses] = useState<any[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        setClasses([]);  // Clear the previous classes list

        const storedName = await AsyncStorage.getItem('username');
        setName(storedName);

        if (storedName) {
          const [first, last] = storedName.trim().split(' ');

          const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('name_first', first)
            .eq('name_last', last)
            .single();

          if (!error && data) {
            const periods = ['period_1', 'period_2', 'period_3'];
            const periodClassIds = periods.map((p) => data[p]);
            const validClassIds = periodClassIds.filter(id => id != null && id !== 'null');

            const { data: classData, error: classError } = await supabase
              .from('classes')
              .select('id, name, teacher, time_start, time_finish')
              .in('id', validClassIds);

            if (!classError && classData) {
              const sortedClasses = classData.sort((a, b) => {
                const timeA = new Date(`1970-01-01T${a.time_start}Z`).getTime();
                const timeB = new Date(`1970-01-01T${b.time_start}Z`).getTime();
                return timeA - timeB;
              });
              setClasses(sortedClasses);
            }
          } else {
            // No student found, so set an empty list
            setClasses([]);
          }
        } else {
          // If no stored name is found, set classes to empty as well
          setClasses([]);
        }

        setLoading(false);
      };

      load();
    }, [])
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colorScheme === 'dark' ? '#00b0ff' : '#0000ff',
    },
    classBubble: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#f0f0f0',
      width: '100%',
      maxWidth: 350,
      height: 140,
      justifyContent: 'center',
      shadowColor: colorScheme === 'dark' ? '#00b0ff' : '#0000ff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
    classItem: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 6,
      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    },
    classDetails: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#a0a0a0' : '#606060',
    },
    classNotFound: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#00b0ff' : '#0000ff',
      textAlign: 'center',
      marginTop: 20,
    },
  });

  const formatTime = (time: string) => {
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (isNaN(hours) || isNaN(minutes)) return 'Invalid Time';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.heading}>EACHE period for {name ?? '...'}:</Text>
      {loading ? (
        <Text style={{ color: colorScheme === 'dark' ? '#ffffff' : '#000000' }}>Loading...</Text>
      ) : (
        classes.length > 0 ? (
          classes.map((classItem, idx) => (
            <View key={idx} style={dynamicStyles.classBubble}>
              <Text style={dynamicStyles.classItem}>
                Period {idx + 1}: {classItem.name}
              </Text>
              <Text style={dynamicStyles.classDetails}>
                Teacher: {classItem.teacher}
              </Text>
              <Text style={dynamicStyles.classDetails}>
                Time: {formatTime(classItem.time_start)} - {formatTime(classItem.time_finish)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={dynamicStyles.classNotFound}>No classes found.</Text>
        )
      )}
    </View>
  );
}
