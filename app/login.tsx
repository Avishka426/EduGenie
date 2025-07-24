import { API_BASE_URL } from '@/config/api';
import { COLORS, USER_ROLES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import ApiService from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success && result.user) {
        // Determine dashboard path based on user role
        const dashboardPath = result.user.role === USER_ROLES.INSTRUCTOR ? 
                             '/(instructor)/dashboard' : 
                             '/(student)/dashboard';

        console.log(`✅ Login successful! Redirecting ${result.user.role} to ${dashboardPath}`);
        
        // Navigate directly to dashboard without alert for smoother UX
        router.replace(dashboardPath);
      } else {
        Alert.alert('Error', result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Temporary test function - remove after testing
  const testBackendConnection = async () => {
    try {
      console.log('🔄 Testing backend with your Postman credentials...');
      
      // Test the exact credentials from your Postman test
      const result = await ApiService.login('avishka66@example.com', 'password123');
      
      if (result.success) {
        console.log('✅ Backend test successful!', result.data);
        Alert.alert(
          '✅ Backend Test Successful!',
          `Connected to backend!\n\nUser: ${result.data?.user?.name}\nRole: ${result.data?.user?.role}\nToken received: ${result.data?.token ? 'Yes' : 'No'}`,
          [
            {
              text: 'Test Logout API',
              onPress: async () => {
                try {
                  await ApiService.logout();
                  Alert.alert('✅ Logout Test', 'Backend logout API tested successfully!');
                } catch (error) {
                  console.error('Logout test error:', error);
                  Alert.alert('❌ Logout Test Failed', 'Logout API test failed');
                }
              }
            },
            {
              text: 'Use These Credentials',
              onPress: () => {
                setFormData({
                  email: 'avishka66@example.com',
                  password: 'password123'
                });
              }
            },
            {
              text: 'Test Course Creation',
              onPress: () => {
                // Navigate directly to course creation for testing
                router.push('/(instructor)/create');
              }
            },
          ]
        );
      } else {
        console.log('❌ Backend test failed:', result.error);
        Alert.alert('❌ Backend Test Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Backend test error:', error);
      Alert.alert('❌ Test Error', 'Failed to connect to backend');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue learning</Text>
          
          {/* Debug Info - Shows which API URL is being used */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              🔗 API: {API_BASE_URL}
            </Text>
            <Text style={styles.debugPlatform}>
              📱 Platform: {Platform.OS} {__DEV__ ? '(Dev)' : '(Prod)'}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.WHITE} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Temporary Test Button - REMOVE AFTER TESTING */}
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testBackendConnection}
          >
            <Text style={styles.testButtonText}>🔧 Test Backend Connection</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 50,
  },
  debugInfo: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginTop: 15,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  debugPlatform: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    marginTop: 2,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.GRAY_MEDIUM,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.WHITE,
    marginBottom: 15,
  },
  loginButton: {
    height: 50,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.GRAY_MEDIUM,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  testButton: {
    backgroundColor: '#e67e22',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.WHITE,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});
