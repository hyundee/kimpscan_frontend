import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {MyPageScreen} from '../screens/MyPageScreen';
// import {NotificationsScreen} from '../screens/NotificationsScreen';
import {Header} from '../components/Header/Header';
import Home from 'react-native-vector-icons/Foundation';
import User from 'react-native-vector-icons/Feather';

// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator> */}
      <Tab.Navigator
        screenOptions={{
          header: () => <Header />,
          tabBarStyle: {
            paddingTop: 5,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({color, size}) => (
              <Home
                name="home"
                size={size}
                color={color}
                style={styles.tabBarIcon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{
            title: 'MyPage',
            tabBarIcon: ({color, size}) => (
              <User
                name="user"
                size={size}
                color={color}
                style={styles.tabBarIcon}
              />
            ),
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
