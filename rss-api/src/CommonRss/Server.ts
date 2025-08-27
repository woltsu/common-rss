import { logger } from '@common-rss/shared';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { commonRss } from './CommonRss';

class Server {
  private server: ReturnType<typeof createServer>;
  private port: number = 3000;

  constructor() {
    this.server = createServer(this.handleRequest.bind(this));
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = req.url || '';
    const method = req.method || 'GET';

    try {
      if (method === 'GET' && url === '/rss') {
        // Return aggregated RSS feed
        const rssXml = commonRss.getFeed();

        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        res.writeHead(200);
        res.end(rssXml);
        return;
      }

      // Default 404 response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found' }));
    } catch (error) {
      logger.error('Server error:', error);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  public listen(port?: number) {
    if (port) {
      this.port = port;
    }

    this.server.listen(this.port, () => {
      logger.info(`RSS Server running on port ${this.port}`);
      logger.info(`Available endpoints:`);
      logger.info(`  GET /rss - All RSS feeds combined`);
    });
  }

  public close() {
    this.server.close();
  }
}

export const server = new Server();
