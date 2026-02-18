import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            'react-file-upload-ui': path.resolve(__dirname, '../packages/src')
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
    }
})
