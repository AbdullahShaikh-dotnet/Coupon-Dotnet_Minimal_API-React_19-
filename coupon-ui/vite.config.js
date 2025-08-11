import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin(), tailwindcss()],
    server: {
        port: 59436,
        proxy: {
            '/API': {
                target: 'http://localhost:5209',
                changeOrigin: true,
                secure: false,
            },
            '/api': {
                target: 'https://localhost:7036',
                changeOrigin: true,
                secure: false,
            },
        }
    },
})
