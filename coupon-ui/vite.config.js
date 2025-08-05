import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 59436,
    },
    proxy: {
        '/api': 'https://localhost:7036',
        '/API': 'http://localhost:5209'
    }
})