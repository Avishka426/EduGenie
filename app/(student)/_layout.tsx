import { COLORS } from '@/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

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
          tabBarIcon: ({ color }) => (
            <HomeIcon color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => (
            <BookIcon color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'All Courses',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🔍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="enrolled"
        options={{
          title: 'My Courses',
          tabBarIcon: ({ color }) => (
            <UserIcon color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <ProfileIcon color={color} />
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

// Simple icon components (you can replace with actual icons later)
function HomeIcon({ color }: { color: string }) {
  return <Text style={{ color, fontSize: 24 }}>🏠</Text>;
}

function BookIcon({ color }: { color: string }) {
  return <Text style={{ color, fontSize: 24 }}>📚</Text>;
}

function UserIcon({ color }: { color: string }) {
  return <Text style={{ color, fontSize: 24 }}>👤</Text>;
}

function ProfileIcon({ color }: { color: string }) {
  return <Text style={{ color, fontSize: 24 }}>⚙️</Text>;
}
