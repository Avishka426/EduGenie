import { COLORS } from '@/constants';
import ApiService from '@/services/api';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Simple component to test backend connectivity
 * Add this to any screen during development to test the backend
 */
export const BackendTestButton: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);

  const testBackend = async () => {
    setIsTesting(true);
    try {
      console.log('🔄 Testing backend connection...');
      
      // Test health endpoint
      const healthResult = await ApiService.healthCheck();
      
      if (healthResult.success) {
        console.log('✅ Backend is running:', healthResult.data);
        Alert.alert(
          '✅ Success!', 
          `Backend is running!\n\nMessage: ${healthResult.data?.message}\nEnvironment: ${healthResult.data?.environment}`,
          [
            { text: 'Test API Info', onPress: testApiInfo },
            { text: 'OK' }
          ]
        );
      } else {
        console.log('❌ Backend test failed:', healthResult.error);
        Alert.alert('❌ Backend Error', healthResult.error || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      Alert.alert('❌ Error', 'Failed to test backend connection');
    } finally {
      setIsTesting(false);
    }
  };

  const testApiInfo = async () => {
    try {
      const apiResult = await ApiService.getApiInfo();
      if (apiResult.success) {
        Alert.alert('📋 API Info', JSON.stringify(apiResult.data, null, 2));
      }
    } catch (error) {
      console.error('API info error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isTesting && styles.buttonDisabled]}
        onPress={testBackend}
        disabled={isTesting}
      >
        <Text style={styles.buttonText}>
          {isTesting ? '🔄 Testing...' : '🔧 Test Backend'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.note}>
        💡 Make sure backend is running on localhost:3000
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GRAY_MEDIUM,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: '600',
    fontSize: 14,
  },
  note: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default BackendTestButton;
