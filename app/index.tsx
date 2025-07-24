import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo and App Name */}
        <View style={styles.header}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.appName}>EduGenie</Text>
          <Text style={styles.tagline}>Learn Smarter with AI-Powered Recommendations</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featureTitle}>Features:</Text>
          <Text style={styles.feature}>📚 Browse & Enroll in Courses</Text>
          <Text style={styles.feature}>🤖 AI-Powered Course Recommendations</Text>
          <Text style={styles.feature}>👨‍🏫 Create & Manage Courses</Text>
          <Text style={styles.feature}>📊 Track Your Learning Progress</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('./login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={() => router.push('./register')}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    alignItems: 'center',
    marginBottom: 50,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 15,
  },
  feature: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 8,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    maxWidth: 300,
  },
  loginButton: {
    height: 50,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  registerButton: {
    height: 50,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
});
