export const setLocalStorageItem = (key: string, value: string): void => {
  window.localStorage.setItem(key, value);
};

export const getLocalStorageItem = (key: string) => {
  const data = window.localStorage.getItem(key) as string;
  try {
    return JSON.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return data;
  }
};

export const deleteLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
};
