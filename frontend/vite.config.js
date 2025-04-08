import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(() => {
  const API_URL = '/';
  const PORT = 5173;

  return {
    plugins: [
      react(),
      jsconfigPaths()
    ],
    server: {
      open: true,
      port: PORT,
      proxy: {
        '/api': 'http://localhost:5000'
      }
    },
    publicDir: 'public',
    resolve: {
      alias: {
        '@': '/src',
        // Thêm các alias khác nếu cần
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        },
        less: {
          charset: false
        }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    base: API_URL,
    define: {
      global: 'window'
    }
  };
});
