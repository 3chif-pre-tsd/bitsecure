export function readFromStorage(storageKey: string): string | null {
  return window.localStorage.getItem(storageKey);
}

export function writeToStorage(storageKey: string, value: string): void {
  window.localStorage.setItem(storageKey, value);
}
