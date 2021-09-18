export const setItem = <T>(key: string, value: T) => {
  const parsedValue = JSON.stringify(value);
  localStorage.setItem(key, parsedValue);
};

export const getItem = <T>(key: string) => {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
};
