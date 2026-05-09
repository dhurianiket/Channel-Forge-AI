import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config/env.js';

export function verifyWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-webhook-signature'] as string;
  const timestamp = req.headers['x-webhook-timestamp'] as string;

  if (!signature || !timestamp) {
    return res.status(401).json({ error: 'Missing signature or timestamp' });
  }

  // Check timestamp staleness (e.g., older than 5 minutes)
  const MAX_TOLERANCE_MS = 5 * 60 * 1000;
  if (Math.abs(Date.now() - parseInt(timestamp, 10)) > MAX_TOLERANCE_MS) {
    return res.status(401).json({ error: 'Stale webhook timestamp' });
  }

  try {
    const rawBodyBuffer = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
    const payloadToSign = `${timestamp}.${rawBodyBuffer.toString('utf8')}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', config.WEBHOOK_SIGNATURE_SECRET)
      .update(payloadToSign)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Signature verification failed' });
  }

  next();
}
