import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { env } from './config/env';
import { authRouter } from './routes/authRouter';
import { cmsRouter } from './routes/cmsRouter';
import { inquiriesRouter } from './routes/inquiriesRouter';
import { uploadRouter } from './routes/uploadRouter';
import { mapsRouter } from './routes/mapsRouter';

const app = express();
const PORT = env.port;

// Payload Parsers
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(
  express.raw({
    type: ['video/mp4', 'video/webm', 'video/quicktime', 'application/octet-stream'],
    limit: '100mb',
  })
);

// Register Modular API Endpoints
app.use('/api', authRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api', uploadRouter);
app.use('/api/maps', mapsRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', environment: env.nodeEnv, timestamp: new Date().toISOString() });
});

// Vite Middleware (Development Mode) vs Static File Serving (Production Mode / Hostinger)
async function startServer() {
  if (env.nodeEnv === 'development') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.get('*all', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const rawIndexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        const transformedHtml = await vite.transformIndexHtml(url, rawIndexHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Hostinger production static files serving
    const publicDistPath = path.join(process.cwd(), 'dist');
    const frontendDistPath = path.join(process.cwd(), 'frontend', 'dist');
    const staticPath = fsExists(publicDistPath) ? publicDistPath : frontendDistPath;

    // Cache immutable hashed asset chunks
    app.use(
      '/assets',
      express.static(path.join(staticPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );

    app.use(express.static(staticPath));
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Critical: Never return index.html for missing static assets or chunk scripts!
    // Returning index.html causes "Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of text/html"
    app.use('/assets', (req, res) => {
      res.status(404).type('text/plain').send('Asset chunk not found');
    });

    app.get('*all', (req, res) => {
      const indexPath = path.join(staticPath, 'index.html');
      if (fsExists(indexPath)) {
        // Prevent browser caching of index.html so dynamic chunk hashes are always fresh
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(indexPath);
      } else {
        res.send('Server running in Production mode. Build frontend via npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[My Kind of Travel Server] Running on http://localhost:${PORT} in ${env.nodeEnv} mode`);
  });
}

function fsExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

startServer();
