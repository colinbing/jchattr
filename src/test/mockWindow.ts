import { vi } from 'vitest';

type ListenerMap = Map<string, Set<EventListener>>;

export type MockWindowControls = {
  getRaw: (key: string) => string | null;
  setRaw: (key: string, value: string) => void;
  clear: () => void;
};

export function installMockWindow(): MockWindowControls {
  const storage = new Map<string, string>();
  const listeners: ListenerMap = new Map();
  const localStorage = createMockLocalStorage(storage);
  const mockWindow = {
    localStorage,
    addEventListener(type: string, listener: EventListener) {
      const currentListeners = listeners.get(type) ?? new Set<EventListener>();
      currentListeners.add(listener);
      listeners.set(type, currentListeners);
    },
    removeEventListener(type: string, listener: EventListener) {
      listeners.get(type)?.delete(listener);
    },
    dispatchEvent(event: Event) {
      listeners.get(event.type)?.forEach((listener) => listener(event));
      return true;
    },
  };

  vi.stubGlobal('window', mockWindow);

  return {
    getRaw: (key) => storage.get(key) ?? null,
    setRaw: (key, value) => storage.set(key, value),
    clear: () => storage.clear(),
  };
}

function createMockLocalStorage(storage: Map<string, string>): Storage {
  return {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(storage.keys())[index] ?? null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
  };
}
