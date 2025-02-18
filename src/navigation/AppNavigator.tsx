import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {MyPageScreen} from '../screens/MyPageScreen';
import {Header} from '../components/Header/Header';

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
          options={{title: '홈'}}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{title: '내 정보'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
