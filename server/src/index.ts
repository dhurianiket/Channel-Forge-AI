import express from 'express';
import webhooksRouter from './routes/webhooks.js';
import healthRouter from './routes/health.js';

export function setupServerRoutes(app: express.Express) {
  // Mount server routes
  app.use('/api', healthRouter);
  
  // Use raw parser for webhooks if necessary for signature checking
  // Though Express raw parser is often better applied locally to routes
  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));
  
  app.use('/api/webhooks', webhooksRouter);
}
