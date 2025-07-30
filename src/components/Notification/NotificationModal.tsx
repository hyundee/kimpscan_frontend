import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NotificationAutocomplete } from './NotificationAutocomplete';
import { CoinName } from '@/types/coins';
import authAxios from '@/lib/authAxios';
import { URLS } from '@/constants/urls';
import { AlarmData } from '@/types/notification';
import axios from 'axios';

interface INotificationModal {
  onSuccess: () => void,
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  initialData?: AlarmData; // 수정 모드일 때 전달될 초기 데이터, null이면 생성, null이 아니면 수정
}

interface IMessageSetting {
  symbol: string;
  stockName: string;
  kimpPercent: number;
  silentTime: number;
}

export const NotificationModal = ({ onSuccess, setActive, initialData }: INotificationModal) => {
  const [selectedValue, setSelectedValue] = useState<CoinName | undefined>(
    initialData ? {
      symbol: initialData.symbol,
      rootSymbol: initialData.symbol.slice(0, -4),
      korName: initialData.stockName,

    } : undefined
  );
  const [kimp, setKimp] = useState<string>(initialData ? initialData.kimpPercent.toString() : "");
  const [silentTimeSec, setSilentTime] = useState<string>(initialData ? initialData.silentTime.toString() : "");

  // 알림 저장 요청
  const requestCreateNotification = async (data: IMessageSetting) => {
    try {
      const url = `${URLS.MESSAGE_URL}/message/settings`;
      await authAxios.post(url, data);
      return true;
    } catch (error) {
      const errorTitlePrefix = "알람 등록 실패"
      if (axios.isAxiosError(error)) {
        console.error(`${errorTitlePrefix} - 응답 코드:`, error.response?.status);
        console.error(`${errorTitlePrefix} - 응답 데이터:`, error.response?.data);
        console.error(`${errorTitlePrefix} - 응답 헤더:`, error.response?.headers);
        Alert.alert(`${errorTitlePrefix}`, `${error.response?.data.message}`)
      } else {
        Alert.alert(`${errorTitlePrefix}`, "서버 오류")
      }
      console.error(`${errorTitlePrefix}`, error)
      return false
    }
  }

  // 알림 수정 요청
  const requestUpdateNotification = async (settingId: number, data: IMessageSetting) => {
    try {
      const url = `${URLS.MESSAGE_URL}/message/settings/${settingId}`;
      await authAxios.put(url, data);
      return true;
    } catch (error) {
      const errorTitlePrefix = "알람 수정 실패"
      if (axios.isAxiosError(error)) {
        console.error(`${errorTitlePrefix} - 응답 코드:`, error.response?.status);
        console.error(`${errorTitlePrefix} - 응답 데이터:`, error.response?.data);
        console.error(`${errorTitlePrefix} - 응답 헤더:`, error.response?.headers);
        Alert.alert(`${errorTitlePrefix}`, `${error.response?.data.message}`)
      } else {
        Alert.alert(`${errorTitlePrefix}`, "서버 오류")
      }
      console.error(`${errorTitlePrefix}`, error)
      return false
    }
  }

  // 알림 저장 요청 데이터 유효성 검사
  const validateMessageSetting = () => {
    if (!selectedValue) {
      Alert.alert("종목을 입력해주세요.")
      return false
    }

    if (!kimp) {
      Alert.alert("김치 프리미엄을 입력해주세요.")
      return false
    }

    if (!silentTimeSec) {
      Alert.alert("동일 알람 방지 기간을 입력해주세요.")
      return false
    }

    if (isNaN(parseFloat(silentTimeSec))) {
      Alert.alert("동일 알람 방지 기간은 실수만 입력 가능합니다.")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    const isValid = validateMessageSetting()
    if (!isValid) return;

    const requestData = {
      symbol: selectedValue?.symbol ?? "",
      stockName: selectedValue?.korName ?? "",
      kimpPercent: parseInt(kimp, 10),
      silentTime: parseFloat(silentTimeSec),
    }

    let isOkRequest;
    if (initialData === undefined || initialData === null) {
      isOkRequest = await requestCreateNotification(requestData)
    } else {
      isOkRequest = await requestUpdateNotification(initialData?.id, requestData)
    }

    if (isOkRequest) {
      onSuccess();
      setActive(false);
    }
  };

  const handleCancel = () => {
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

  // 정수만 허용하는 정규식 (음수 포함 시: /^-?\d*$/)
  const integerOnlyRegex = /^-?\d*$/;

  const handleIntegerInputChange = (
    text: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // 빈 문자열은 허용 (입력값 초기화 가능하도록)
    if (text === '') {
      setter('');
      return;
    }

    // 정수 형식일 경우만 setter 호출
    if (integerOnlyRegex.test(text)) {
      setter(text);
    }
    // 숫자가 아닌 문자나 소수점 등을 포함하면 무시 (setter 호출 안 함)
  };


  return (
    <View style={styles.container}>
      <Text style={styles.text}>종목</Text>
      <NotificationAutocomplete
        onSelect={(item) => { setSelectedValue(item) }}
        onFocus={() => setSelectedValue(undefined)}
        initQuery={initialData ? `${initialData.stockName} (${initialData.symbol.slice(0, -4)})` : ''}
      />
      <Text style={styles.text}>김치프리미엄(%)</Text>
      <TextInput
        style={styles.input}
        value={kimp?.toString() ?? ""}
        onChangeText={(text) => handleIntegerInputChange(text, setKimp)}
        keyboardType="numeric"
      />
      <Text style={styles.text}>동일 알람 방지 기간(초)</Text>
      <TextInput
        style={styles.input}
        value={silentTimeSec?.toString() ?? ""}
        onChangeText={(text) => handleNumericInputChange(text, setSilentTime)}
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
