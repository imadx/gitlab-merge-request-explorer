export const setItem = <T>(key: string, value: T) => {
  const parsedValue = JSON.stringify(value);
  localStorage.setItem(key, parsedValue);
};

export const getItem = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
};

export const resetCache = () => {
  let currentItem;
  let i = 1;
  do {
    const key = `merge_requests_${i++}`;
    currentItem = localStorage.getItem(key);
    localStorage.removeItem(key);
  } while (currentItem);
};
