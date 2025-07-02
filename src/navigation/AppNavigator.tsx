import React from 'react';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { MyPageScreen } from '../screens/MyPageScreen';

import { Header } from '../components/Header/Header';
import Home from 'react-native-vector-icons/Foundation';
import User from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '@/types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(
  ...args: Parameters<typeof navigationRef.navigate>
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}

const Tab = createBottomTabNavigator();

const CustomHeader = () => <Header />;

const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Home name="home" size={size} color={color} style={styles.tabBarIcon} />
);

const MyPageTabIcon = ({ color, size }: { color: string; size: number }) => (
  <User name="user" size={size} color={color} style={styles.tabBarIcon} />
);

export const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        screenOptions={{
          header: CustomHeader,
          tabBarStyle: {
            paddingTop: 5,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: HomeTabIcon,
          }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{
            title: 'MyPage',
            tabBarIcon: MyPageTabIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarIcon: {
    fontSize: 25,
  },
});
