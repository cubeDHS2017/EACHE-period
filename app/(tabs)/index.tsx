import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase'; // if index.tsx is inside /app/(tabs)


export default function HomeScreen() {
  const [classes, setClasses] = useState<string[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true); // Start loading

      const storedName = await AsyncStorage.getItem('username');
      setName(storedName);

      if (storedName) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('name_first', storedName)
          .single();

        if (!error && data) {
          const periods = ['period1', 'period2', 'period3'];
          setClasses(periods.map((p) => data[p]));
        } else {
          console.error('Error fetching student data:', error?.message);
        }
      }

      setLoading(false); // Stop loading once done
    };

    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Classes for {name ?? '...'}</Text>
      {classes.map((c, idx) => (
        <Text key={idx} style={styles.classItem}>
          Period {idx + 1}: {c}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  classItem: { fontSize: 18, marginBottom: 8 },
});
