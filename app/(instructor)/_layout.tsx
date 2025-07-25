import { COLORS } from '@/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function InstructorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY_MEDIUM,
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
            // IconSymbol placeholder - will need proper icons
            <Text style={{ color, fontSize: focused ? 24 : 20 }}>📊</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'My Courses',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 24 : 20 }}>📚</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create Course',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 24 : 20 }}>➕</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'Students',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 24 : 20 }}>👥</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 24 : 20 }}>👤</Text>
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
    </Tabs>
  );
}
