import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor="#fff" />
      <View style={{ flex: 1, paddingTop: 40, backgroundColor: '#fcfcfc' }}>
        <Stack
          screenOptions={{
            headerShown: false, // Remove the default header
            animation: 'slide_from_right', // Smooth transitions
            gestureEnabled: true, // Enable swipe gestures
          }}
        />
      </View>
    </AuthProvider>
  );
}
