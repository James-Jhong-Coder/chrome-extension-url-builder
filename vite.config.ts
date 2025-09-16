import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 讓 @ 指向 src
      '@components': path.resolve(__dirname, 'src/components'), // 自訂
    },
  },
});
