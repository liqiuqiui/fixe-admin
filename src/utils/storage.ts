// 设置 setStorage
export const setStorage = (key: StorageKey, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
// 获取 getStorage
export function getStorage<R = any>(key: StorageKey, defaultValue?: R): R | null {
  const result = window.localStorage.getItem(key);

  if (!result) return defaultValue ?? null;
  const parseResult = JSON.parse(result!) as R;
  return parseResult;
}

// 删除 removeStorage
export const removeStorage = (key: StorageKey) => {
  window.localStorage.removeItem(key);
};

// 清空 clearStorage
export const clearStorage = () => {
  window.localStorage.clear();
};
