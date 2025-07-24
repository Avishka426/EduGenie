import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import ApiService from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function DebugScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log('🔧 Debug:', message);
  };

  const testAuthentication = async () => {
    try {
      addLog('Testing authentication...');
      
      const isAuth = await ApiService.isAuthenticated();
      addLog(`isAuthenticated(): ${isAuth}`);
      
      const token = await AsyncStorage.getItem('authToken');
      addLog(`Token exists: ${!!token}`);
      addLog(`Token: ${token ? token.substring(0, 20) + '...' : 'null'}`);
      
      const user = await ApiService.getCurrentUser();
      addLog(`Current user: ${JSON.stringify(user)}`);
      
    } catch (error) {
      addLog(`Auth test error: ${error}`);
    }
  };

  const testApiConnection = async () => {
    try {
      addLog('Testing API connection...');
      
      const healthResponse = await ApiService.healthCheck();
      addLog(`Health check: ${JSON.stringify(healthResponse)}`);
      
    } catch (error) {
      addLog(`API connection error: ${error}`);
    }
  };

  const testInstructorCourses = async () => {
    try {
      addLog('Testing instructor courses API...');
      
      const response = await ApiService.getInstructorCourses();
      addLog(`Courses response: ${JSON.stringify(response)}`);
      
    } catch (error) {
      addLog(`Courses API error: ${error}`);
    }
  };

  const testDirectFetch = async () => {
    try {
      addLog('Testing direct fetch to courses endpoint...');
      
      const token = await AsyncStorage.getItem('authToken');
      const url = 'http://localhost:3000/api/courses/instructor/my-courses';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      const data = await response.json();
      addLog(`Direct fetch status: ${response.status}`);
      addLog(`Direct fetch response: ${JSON.stringify(data)}`);
      
    } catch (error) {
      addLog(`Direct fetch error: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button
            title="← Back"
            onPress={() => router.back()}
            variant="secondary"
            size="small"
          />
          <Text style={styles.title}>Debug Tools</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>API Tests</Text>
          
          <View style={styles.buttonGrid}>
            <Button
              title="Test Auth"
              onPress={testAuthentication}
              size="small"
              style={styles.testButton}
            />
            <Button
              title="Test API Connection"
              onPress={testApiConnection}
              size="small"
              style={styles.testButton}
            />
            <Button
              title="Test Courses API"
              onPress={testInstructorCourses}
              size="small"
              style={styles.testButton}
            />
            <Button
              title="Test Direct Fetch"
              onPress={testDirectFetch}
              size="small"
              style={styles.testButton}
            />
          </View>
          
          <Button
            title="Clear Logs"
            onPress={clearLogs}
            variant="secondary"
            size="small"
            style={styles.clearButton}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Debug Logs</Text>
          
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>No logs yet. Run a test above.</Text>
          ) : (
            <View style={styles.logsContainer}>
              {logs.map((log, index) => (
                <Text key={index} style={styles.logText}>
                  {log}
                </Text>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  testButton: {
    width: '48%',
  },
  clearButton: {
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logsContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    maxHeight: 300,
  },
  logText: {
    fontSize: 12,
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});
