import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
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
