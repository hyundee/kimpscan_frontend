import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { NotificationModal } from './NotificationModal';
import { NotificationList } from './NotificationList';
import { URLS } from '@/constants/urls';
import authAxios from '@/lib/authAxios';
import { AlarmData } from '@/types/notification';
import axios from 'axios';

export const Notification = () => {
  const [active, setActive] = useState(false);
  const [alarmDataList, setAlarmDataList] = useState<AlarmData[]>([]);

  const requestAlarmList = async (): Promise<AlarmData[]> => {
    try {
      const url = `${URLS.MESSAGE_URL}/message/settings`;
      const result = await authAxios.get(url);
      return result.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('목록 조회 실패 - 응답 코드:', error.response?.status);
        console.error('목록 조회 실패 - 응답 데이터:', error.response?.data);
        console.error('목록 조회 실패 - 응답 헤더:', error.response?.headers);
      }
      console.error('목록 조회 실패', error)
      throw error;
    }
  }

  const updateAlarmList = async () => {
    const data = await requestAlarmList()
    if (data) {
      setAlarmDataList(data);
    }
  }

  useEffect(() => {
    updateAlarmList()
  }, [])

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
      <NotificationList data={alarmDataList} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={active}
        onRequestClose={() => setActive(false)}
      >
        <View style={styles.modalOverlay}>
          {/* 바깥 누르면 닫힘 */}
          <TouchableWithoutFeedback onPress={() => setActive(false)}>
            <View style={styles.overlayTouchableArea} />
          </TouchableWithoutFeedback>

          {/* 안쪽 누르면 안 닫힘 */}
          <View style={styles.modalContent}>
            <NotificationModal setActive={setActive} />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(93, 85, 85, 0.5)',
  },
  overlayTouchableArea: {
    flex: 1, // 화면 바깥 전체 차지
  },
  modalContent: {
    backgroundColor: '#e2e2e2',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
});
