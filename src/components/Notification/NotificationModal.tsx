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
  const [kimp, setKimp] = useState<string>("");
  const [preventTimeSec, setPreventTimeSec] = useState<string>("");

  const handleSubmit = () => {
    console.log('알람 저장');
    setActive(false);
  };

  const handleCancel = () => {
    console.log('알람 저장');
    setActive(false);
  };

  const strictNumericRegex = /^(0|[1-9]\d*)?(\.\d*)?$/;

  // onChangeText 핸들러를 위한 헬퍼 함수
  const handleNumericInputChange = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // 1. 빈 문자열은 항상 허용 (입력 필드를 비울 수 있도록)
    if (text === '') {
      setter('');
      return;
    }

    // 2. 현재 입력된 텍스트가 엄격한 숫자 형식에 맞는지 검사
    if (strictNumericRegex.test(text)) {
      setter(text);
    }
    // 3. 사용자가 .만 입력한 경우 (예: "."), 다음 숫자를 입력할 수 있도록 허용
    else if (text === '.') {
      setter(text);
    }
    // 4. 숫자가 아닌 문자를 입력하면 무시 (setter를 호출하지 않음)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>종목</Text>
      <NotificationAutocomplete onSelect={(item) => { setSelectedValue(item) }} />
      <Text style={styles.text}>김치프리미엄(%)</Text>
      <TextInput
        style={styles.input}
        value={kimp?.toString() ?? ""}
        onChangeText={(text) => handleNumericInputChange(text, setKimp)}
        keyboardType="numeric"
      />
      <Text style={styles.text}>동일 알람 방지 기간(초)</Text>
      <TextInput
        style={styles.input}
        value={preventTimeSec?.toString() ?? ""}
        onChangeText={(text) => handleNumericInputChange(text, setPreventTimeSec)}
        keyboardType="numeric"
      />
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
