import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function InstructorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY_MEDIUM,
        headerShown: false, // Remove the default header
        headerStyle: {
          backgroundColor: COLORS.WHITE,
        },
        headerTintColor: COLORS.GRAY_DARK,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.GRAY_LIGHT,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="stats-chart" 
              size={focused ? 24 : 20} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'My Courses',
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
        name="create"
        options={{
          title: 'Create Course',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="add-circle" 
              size={focused ? 24 : 20} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'Students',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="people" 
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
      
      {/* Hidden screens - accessible via navigation but not shown in tabs */}
      <Tabs.Screen
        name="edit-course"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="course-details"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="gpt-usage"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
