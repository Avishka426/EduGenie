import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function StudentTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="home" 
              size={focused ? 24 : 20} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="library" 
              size={focused ? 24 : 20} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'All Courses',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="search" 
              size={focused ? 24 : 20} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="enrolled"
        options={{
          title: 'My Courses',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="bookmarks" 
              size={focused ? 24 : 20} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="person" 
              size={focused ? 24 : 20} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
              name="ai-recommendations"
              options={{
                href: null, // Hide from tab bar
              }}
            />
    </Tabs>
  );
}
