import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { NotificationAutocomplete } from './NotificationAutocomplete';
import { CoinName } from '@/types/coins';
interface INotificationModal {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotificationModal = ({ setActive }: INotificationModal) => {
  const [selectedValue, setSelectedValue] = useState<CoinName>();

  const handleSubmit = () => {
    console.log('알람 저장');
    setActive(false);
  };

  const handleCancel = () => {
    console.log('알람 저장');
    setActive(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>종목</Text>
      <NotificationAutocomplete onSelect={(item) => { setSelectedValue(item) }} />
      <Text style={styles.text}>김치프리미엄(%)</Text>
      <TextInput style={styles.input}>5.8</TextInput>
      <Text style={styles.text}>동일 알람 방지 기간(초)</Text>
      <TextInput style={styles.input}>3600</TextInput>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleSubmit}>
          <Text style={styles.confirmText}>확인</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#e2e2e2',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    color: '#000',
    zIndex: 1, // container의 zIndex를 너무 높게 설정하면 다른 요소 위에 떠야 하는 FlashList가 가려질 수 있음.
    // FlashList가 더 높은 zIndex를 가져야 합니다.
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  confirmButton: {
    backgroundColor: '#000',
  },
  confirmText: {
    color: '#fff',
  },
});
