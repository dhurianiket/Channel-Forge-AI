import { Router } from 'express';
import { verifyWebhookSignature } from '../middleware/verifySignature.js';
import { handleRenderCallback, handlePublishCallback, handleAnalyticsCallback, handleShortsCallback } from './callbacks.js';

const router = Router();

// Secure webhooks from n8n / workers
router.post('/render-complete', verifyWebhookSignature, handleRenderCallback);
router.post('/publish-complete', verifyWebhookSignature, handlePublishCallback);
router.post('/analytics-sync', verifyWebhookSignature, handleAnalyticsCallback);
router.post('/shorts-extracted', verifyWebhookSignature, handleShortsCallback);

export default router;
