import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    resolve: {
        alias: {
            '@root': path.resolve(__dirname, './src'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@models': path.resolve(__dirname, './src/models'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@stores': path.resolve(__dirname, './src/stores'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@templates': path.resolve(__dirname, './src/templates'),
            '@styles': path.resolve(__dirname, './src/styles'),
        },
    },
});
