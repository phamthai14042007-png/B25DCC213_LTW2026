import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = localStorage.getItem(key);

      return savedValue !== null
        ? JSON.parse(savedValue)
        : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Không làm gián đoạn ứng dụng nếu lưu thất bại
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;