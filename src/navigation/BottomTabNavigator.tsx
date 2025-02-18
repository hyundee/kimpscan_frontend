import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Octicons';

import {HomeScreen} from '../screens/HomeScreen';
import {MyPageScreen} from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: '홈'}} />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
