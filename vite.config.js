//VITE.CONFIGG.JS

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import net from 'net'

function findAvailablePort(startPort, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let attemptCount = 0;
    
    function tryPort(port) {
      attemptCount++;
      const server = net.createServer();
      server.unref();
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, trying next one...`);
          if (attemptCount < maxAttempts) {
            tryPort(port + 1);
          } else {
            reject(new Error(`Could not find an available port after ${maxAttempts} attempts`));
          }
        } else {
          reject(err);
        }
      });
      server.listen(port, () => {
        server.close(() => {
          console.log(`Found available port: ${port}`);
          resolve(port);
        });
      });
    }

    tryPort(startPort);
  });
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  let port;
  try {
    port = await findAvailablePort(5173);
    console.log(`Vite will use port: ${port}`);
  } catch (error) {
    console.error('Failed to find an available port:', error);
    process.exit(1);
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: port,
      strictPort: false, // Allow Vite to try other ports if the chosen one is not available
      proxy: {
        '/api': {
          target: 'http://localhost:8080',  // Update this to match your backend port
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
              console.log('Request Headers:', req.headers);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
              console.log('Response Headers:', proxyRes.headers);
            });
          },
        }
      },
    }
  }
})

console.log('Vite config loaded');