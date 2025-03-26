import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'bookmarks';

export const loadBookmarks = async (): Promise<Record<string, boolean>> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('불러오기 에러:', e);
    return {};
  }
};

export const saveBookmarks = async (bookmarks: Record<string, boolean>) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('저장 에러:', e);
  }
};
