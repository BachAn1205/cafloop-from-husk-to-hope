import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function sepayBackendPlugin(sepayApiKey: string): Plugin {
  return {
    name: 'sepay-backend-plugin',
    configureServer(server) {
      // 1. Secure Server-to-Server Proxy for Transaction Fetching (Hides API Key from Frontend)
      server.middlewares.use('/api/sepay/transactions/list', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const apiKey = sepayApiKey || process.env.SEPAY_API_KEY || '';
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'SEPAY_API_KEY is not configured on server' }));
          return;
        }

        try {
          const query = req.url ? req.url.split('?')[1] || '' : '';
          const targetUrl = `https://my.sepay.vn/userapi/transactions/list${query ? `?${query}` : ''}`;
          
          const response = await fetch(targetUrl, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.text();
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal proxy error' }));
        }
      });

      // 2. Secure Webhook Receiver (Validates Authorization Header & Anti-Spoofing)
      server.middlewares.use('/api/sepay/webhook', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const authHeader = req.headers['authorization'] || '';
        const apiKey = sepayApiKey || process.env.SEPAY_API_KEY || '';

        // Validate SePay Apikey Header
        if (apiKey && authHeader !== `Apikey ${apiKey}` && authHeader !== `Bearer ${apiKey}`) {
          console.warn('[SePay Webhook Security] Unauthorized webhook request rejected:', authHeader);
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Unauthorized webhook access' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const payload = JSON.parse(body || '{}');
            console.log('[SePay Webhook Verified]', payload.id, payload.transaction_content, payload.amount_in);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, received: true, id: payload.id }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const sepayApiKey = env.SEPAY_API_KEY || process.env.SEPAY_API_KEY || '';

  return {
    plugins: [react(), tailwindcss(), sepayBackendPlugin(sepayApiKey)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/sepay-api': {
          target: 'https://my.sepay.vn/userapi',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/sepay-api/, ''),
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
