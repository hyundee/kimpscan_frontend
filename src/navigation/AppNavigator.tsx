import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {MyPageScreen} from '../screens/MyPageScreen';
import {Header} from '../components/Header/Header';
import Home from 'react-native-vector-icons/Foundation';
import User from 'react-native-vector-icons/Feather';
// const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          header: () => <Header />, // 모든 탭에 공통 헤더 설정
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '',
            tabBarIcon: ({color, size}) => (
              <Home name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{
            title: '',
            tabBarIcon: ({color, size}) => (
              <User name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
