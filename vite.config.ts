import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, val] of Object.entries(env)) {
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }

  return {
    plugins: [
      react(),
      {
        name: 'local-api-handler',
        configureServer(server) {
          server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
            if (req.url?.startsWith('/api/scan')) {
              if (req.method === 'OPTIONS') {
                res.writeHead(204, {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                });
                return res.end();
              }

              if (req.method === 'POST') {
                let bodyStr = '';
                req.on('data', (chunk) => {
                  bodyStr += chunk;
                });
                req.on('end', async () => {
                  try {
                    const parsedBody = bodyStr ? JSON.parse(bodyStr) : {};
                    const { default: handler } = await server.ssrLoadModule('/api/scan.ts');

                    const mockReq = {
                      method: req.method,
                      headers: req.headers,
                      body: parsedBody,
                    };

                    const mockRes = {
                      status(code: number) {
                        res.statusCode = code;
                        return this;
                      },
                      setHeader(name: string, value: string) {
                        res.setHeader(name, value);
                        return this;
                      },
                      json(data: any) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                        return this;
                      },
                      end() {
                        res.end();
                        return this;
                      },
                    };

                    await handler(mockReq as any, mockRes as any);
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        success: false,
                        error: err.message || 'Internal dev server error in /api/scan',
                        code: 'DEV_SERVER_ERROR',
                      })
                    );
                  }
                });
                return;
              }
            }
            next();
          });
        },
      },
    ],
  };
});
