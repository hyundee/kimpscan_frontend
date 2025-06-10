import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {NotificationModal} from './NotificationModal';

export const Notification = () => {
  const [active, setActive] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>- 알람</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setActive(prev => !prev)}>
        <Text style={styles.buttonText}>알람 추가 +</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => active && setActive(false)}>
        <View>{active && <NotificationModal />}</View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  button: {
    // width: '35%',
    textAlign: 'center',
    borderRadius: 15,
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    padding: 10,
    textAlign: 'center',
  },
  modal: {},
});
