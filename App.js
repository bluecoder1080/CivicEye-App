import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';
import IssuesScreen from './src/screens/IssuesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import theme
import { theme } from './src/utils/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Report') {
                  iconName = focused ? 'add-circle' : 'add-circle-outline';
                } else if (route.name === 'Issues') {
                  iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#2563eb',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
              },
              headerStyle: {
                backgroundColor: '#2563eb',
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                title: 'CivicEye',
                headerTitle: '🏙️ CivicEye'
              }}
            />
            <Tab.Screen 
              name="Report" 
              component={ReportScreen}
              options={{
                title: 'Report Issue',
                headerTitle: '📝 Report Issue'
              }}
            />
            <Tab.Screen 
              name="Issues" 
              component={IssuesScreen}
              options={{
                title: 'All Issues',
                headerTitle: '📋 All Issues'
              }}
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                title: 'Profile',
                headerTitle: '👤 Profile'
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
