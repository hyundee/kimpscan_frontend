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
      <View style={styles.alarmControls}>
        <Text style={styles.text}>- 알람</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActive(prev => !prev)}>
          <Text style={styles.buttonText}>알람 추가 +</Text>
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={() => active && setActive(false)}>
        <View style={styles.alarmModal}>{active && <NotificationModal />}</View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  alarmControls: {
    padding: 20,
    justifyContent: 'flex-start',
  },
  alarmModal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
});
