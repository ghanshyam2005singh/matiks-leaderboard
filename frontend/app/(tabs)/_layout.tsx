import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        headerShown: true,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
          headerTitle: '🏆 Leaderboard',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerTitle: '🔍 Search Users',
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    trophy: '🏆',
    search: '🔍',
  };
  
  return (
    <Text style={{ fontSize: 24, color }}>
      {icons[name] || '📱'}
    </Text>
  );
}