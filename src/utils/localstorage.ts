export const loadFromLocalStorage = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data, (k, v) => (k === 'createdAt' ? new Date(v) : v)) : null;
};

export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const clearLocalStorage = () => {
  // Для удобства
  if (confirm('Удалить данные todo из local storage?')) {
    localStorage.removeItem('todo-tasks');
    localStorage.removeItem('todo-categories');
    alert('Local storage очищено');
  }
}