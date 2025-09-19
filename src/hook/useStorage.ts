import type { QueryKeyValue } from '@/types/types';

const STORAGE_KEY = 'url-builder-form';

interface FormValues {
  hostName: string;
  queries: QueryKeyValue[];
}

export const saveFormValues = (values: FormValues) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch (e) {
    console.error('儲存失敗:', e);
  }
};

export const loadFormValues = (): FormValues | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('讀取失敗:', e);
    return null;
  }
};

export const clearFormValues = () => {
  localStorage.removeItem(STORAGE_KEY);
};
