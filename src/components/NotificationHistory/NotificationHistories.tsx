import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Alert } from "react-native"; // StyleSheet 추가
import { NotificationHistoryData } from "@/types/notification"
import { FlashList } from "@shopify/flash-list";
import { URLS } from '@/constants/urls';
import authAxios from '@/lib/authAxios';
import axios from 'axios';

export const NotificationHistory = () => {
  const [data, setData] = useState<NotificationHistoryData[]>([])
  const [cursor, setCursor] = useState<number | undefined>()
  const [isEnd, setIsEnd] = useState(false)

  // 전송된 알림 목록 조회
  const requestListNotificationHistories = async (cursor: number | undefined): Promise<NotificationHistoryData[]> => {
    try {
      let url = `${URLS.MESSAGE_URL}/message/notifications`;
      if (cursor) {
        url += `?lastSeenNotificationId=${cursor}`
      }

      const resp = await authAxios.get<{ data: NotificationHistoryData[] }>(url);
      return resp.data.data
    } catch (error) {
      const errorTitlePrefix = "전송된 알림 목록 조회 실패"
      if (axios.isAxiosError(error)) {
        console.error(`${errorTitlePrefix} - 응답 코드:`, error.response?.status);
        console.error(`${errorTitlePrefix} - 응답 데이터:`, error.response?.data);
        console.error(`${errorTitlePrefix} - 응답 헤더:`, error.response?.headers);
        Alert.alert(`${errorTitlePrefix}`, `${error.response?.data.message}`)
      } else {
        Alert.alert(`${errorTitlePrefix}`, "서버 오류")
      }
      console.error(`${errorTitlePrefix}`, error)
      return []
    }
  }

  const updateNotificationHistory = async (cursor: number | undefined) => {
    if (isEnd) return;
    const respData = await requestListNotificationHistories(cursor);
    if (respData.length === 0) {
      setIsEnd(true);
    } else {
      setData(prevData => {
        const map = new Map();
        prevData.forEach(item => map.set(item.id, item));
        respData.forEach(item => map.set(item.id, item));

        return Array.from(map.values());
      });
      setCursor(respData[respData.length - 1].id)
    }
  }

  useEffect(() => {
    updateNotificationHistory(undefined)
  }, [])

  // FlatList의 각 항목을 렌더링할 함수
  const renderItem = ({ item }: { item: NotificationHistoryData }) => {
    return <View style={styles.notificationItem}>
      {/* 송신 여부 인디케이터 */}
      <View style={item.send ? styles.sentIndicator : styles.notSentIndicator}>
        <Text style={styles.sentIcon}>{item.send ? '✓' : '!'}</Text>
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.content}</Text>
      </View>
      <Text style={styles.notificationDate}>
        {/* 날짜 형식 변경 */}
        {new Date(item.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // 24시간 형식
        })}
      </Text>
    </View>
  };

  return (
    data.length > 0 ?
      <View style={styles.container}>
        <FlashList<NotificationHistoryData>
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => updateNotificationHistory(cursor)}
          estimatedItemSize={100}
        />
      </View>
      : <View style={styles.emptyContainer}>
        <Text>전송된 알림이 없습니다.</Text>
      </View>
  );
};

// --- 스타일 정의 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // 전체 배경색
    padding: 10,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Android 그림자 효과
  },
  notificationContent: {
    flex: 1, // 내용이 남은 공간을 차지하도록
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right', // 날짜를 오른쪽에 정렬
    marginLeft: 10, // 내용과 날짜 사이 간격
  },
  // '송신 여부'에 따른 스타일 (예: 아이콘)
  sentIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50', // 송신됨: 초록색
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notSentIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFC107', // 송신 안됨: 주황색
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sentIcon: {
    color: '#ffffff', // 아이콘 색상
    fontSize: 12, // 아이콘 크기 (예: 체크마크)
    fontWeight: 'bold', // 아이콘 텍스트 굵게
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  }
});