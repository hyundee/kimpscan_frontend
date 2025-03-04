import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigation';
import {SearchBar} from '../SearchBar/SearchBar';
// import SearchIcon from 'react-native-vector-icons/Ionicons';
import NotificationsIcon from 'react-native-vector-icons/Ionicons';

type Navigation = NavigationProp<RootStackParamList, 'Home'>;

export const Header = () => {
  const navigation = useNavigation<Navigation>();

  // const [isActiveSearchbar, setIsActiveSearchbar] = useState(false);
  // const togglehandler = () => {
  //   setIsActiveSearchbar(prev => !prev);
  // };

  console.log('Header');
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.logo}>LOGO</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <SearchBar />
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}>
            <NotificationsIcon name="notifications" size={25} color="#000" />
            {/* <Text style={styles.logo}>알람</Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    height: 60,
    backgroundColor: '#fff',
  },
  container: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  logo: {
    color: '#000',
    fontSize: 18,
    // fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  // searchContainer: {
  //   flex: 1,
  // },
  // search: {
  //   flex: 1,
  // },
});
