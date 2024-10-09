import { defineStore } from 'pinia';
import { pinia } from '@/store';

interface WindowSize {
  height: number;
  width: number;
}

interface AppState {
  window: WindowSize;

}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    window: {
      height: 0,
      width: 0
    }
  }),
  getters: {
    getWindowSize() {
      return this.window;
    }
  },
  actions: {
    setAppState(...args: any) {
      this.$patch({ [args[0]]: args[1] });
    },
    setWindow(size: WindowSize) {
      this.window = size;
    }
  },
  persist: {
    key: 'app',
    storage: localStorage
  }
})