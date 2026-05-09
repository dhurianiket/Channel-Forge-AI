import { Request, Response } from 'express';
import { getAdminDb } from '../services/firestoreAdmin.js';
import { checkIdempotency } from '../utils/idempotency.js';
import { logAlert } from '../services/alerts.js';
import * as admin from 'firebase-admin';

export async function handleRenderCallback(req: Request, res: Response) {
  const { workspaceId, channelId, projectId, automationRunId, roughCutId, status, previewUrl } = req.body;
  
  if (!automationRunId || !roughCutId || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isNew = await checkIdempotency(automationRunId, 'render_callback');
  if (!isNew) {
    console.log(`Render callback ${automationRunId} already processed.`);
    return res.status(200).json({ status: 'ignored_duplicate' });
  }

  const db = getAdminDb();
  
  try {
    const runRef = db.doc(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/automationRuns/${automationRunId}`);
    const roughCutRef = db.doc(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/roughCuts/${roughCutId}`);
    
    // Verify project and roughcut exist realistically
    const projectRef = db.doc(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}`);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) throw new Error('Project not found');

    const batch = db.batch();
    
    if (status === 'SUCCEEDED') {
      batch.update(roughCutRef, {
        status: 'READY',
        previewUrl: previewUrl || '',
        updatedAt: Date.now()
      });
      batch.update(runRef, {
        status: 'SUCCEEDED',
        finishedAt: Date.now(),
        result: { previewUrl }
      });
    } else {
      batch.update(roughCutRef, {
        status: 'FAILED',
        errorMessage: req.body.errorMessage || 'Render failed',
        updatedAt: Date.now()
      });
      batch.update(runRef, {
        status: 'FAILED',
        finishedAt: Date.now(),
        errorMessage: req.body.errorMessage || 'Render failed'
      });
      await logAlert('RENDER_FAILED', `Render failed for ${roughCutId}`, req.body);
    }

    // Write Event tracking
    const eventRef = db.collection(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/events`).doc();
    batch.set(eventRef, {
      projectId,
      workspaceId,
      channelId,
      type: status === 'SUCCEEDED' ? 'RENDER_COMPLETED' : 'RENDER_FAILED',
      actorType: 'WORKER',
      actorId: 'SYSTEM',
      message: `Render job ${status} for rough cut ${roughCutId}`,
      createdAt: Date.now()
    });

    await batch.commit();

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Failed to process render callback:', error);
    return res.status(500).json({ error: error.message });
  }
}

export async function handlePublishCallback(req: Request, res: Response) {
  const { workspaceId, channelId, projectId, publishJobId, status, youtubeVideoId, errorMessage } = req.body;
  
  const isNew = await checkIdempotency(publishJobId, 'publish_callback');
  if (!isNew) {
    return res.status(200).json({ status: 'ignored_duplicate' });
  }

  const db = getAdminDb();
  
  try {
    const jobRef = db.doc(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/publishJobs/${publishJobId}`);
    const projectRef = db.doc(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}`);
    
    const batch = db.batch();
    
    if (status === 'SUCCEEDED') {
      batch.update(jobRef, {
        status: 'PUBLISHED',
        youtubeVideoId,
        updatedAt: Date.now()
      });
      batch.update(projectRef, {
        publishStatus: 'PUBLISHED',
        youtubeVideoId,
        publishedAt: Date.now()
      });
    } else {
      batch.update(jobRef, {
        status: 'FAILED',
        errorMessage: errorMessage || 'Publish failed',
        updatedAt: Date.now()
      });
      await logAlert('PUBLISH_FAILED', `Publish failed for job ${publishJobId}`, req.body);
    }
    
    const eventRef = db.collection(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/events`).doc();
    batch.set(eventRef, {
      projectId,
      workspaceId,
      channelId,
      type: status === 'SUCCEEDED' ? 'PUBLISHED' : 'PUBLISH_FAILED',
      actorType: 'WORKER',
      actorId: 'SYSTEM',
      message: `Publish job ${status}`,
      createdAt: Date.now() // Event type needs timestamp
    });

    await batch.commit();
    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Failed to process publish callback:', error);
    return res.status(500).json({ error: error.message });
  }
}

export async function handleShortsCallback(req: Request, res: Response) {
  const { workspaceId, channelId, projectId, segments } = req.body;
  
  const isNew = await checkIdempotency(`shorts_${projectId}_${Date.now()}`, 'shorts_callback');
  if (!isNew) return res.status(200).json({ status: 'ignored_duplicate' });

  const db = getAdminDb();
  
  try {
    const batch = db.batch();
    
    for (const seg of segments) {
      const shortRef = db.collection(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/shorts`).doc();
      batch.set(shortRef, {
        projectId,
        status: 'DRAFT',
        ...seg,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    const eventRef = db.collection(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/events`).doc();
    batch.set(eventRef, {
      projectId,
      workspaceId,
      channelId,
      type: 'SHORTS_EXTRACTION_COMPLETED',
      actorType: 'WORKER',
      actorId: 'SYSTEM',
      message: `Received ${segments.length} short candidates`,
      createdAt: Date.now()
    });

    await batch.commit();
    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Failed to process shorts callback:', error);
    return res.status(500).json({ error: error.message });
  }
}

export async function handleAnalyticsCallback(req: Request, res: Response) {
  const { workspaceId, channelId, projectId, youtubeVideoId, metrics } = req.body;
  
  const isNew = await checkIdempotency(`${youtubeVideoId}_${Date.now()}`, 'analytics_callback');
  if (!isNew) return res.status(200).json({ status: 'ignored_duplicate' });

  const db = getAdminDb();
  
  try {
    const snapshotRef = db.collection(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/analytics`).doc();
    const projectRef = db.doc(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}`);
    
    const batch = db.batch();
    
    batch.set(snapshotRef, {
      projectId,
      youtubeVideoId,
      ...metrics,
      capturedAt: Date.now(),
      improvementSummary: "AI note: Review CTR and view duration for ongoing insights."
    });
    
    batch.update(projectRef, {
      lastAnalyticsSyncAt: Date.now()
    });

    const eventRef = db.collection(`workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/events`).doc();
    batch.set(eventRef, {
      projectId,
      workspaceId,
      channelId,
      type: 'ANALYTICS_SYNC_COMPLETED',
      actorType: 'WORKER',
      actorId: 'SYSTEM',
      message: `Analytics sync received for ${youtubeVideoId}`,
      createdAt: Date.now()
    });

    await batch.commit();
    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Failed to process analytics callback:', error);
    return res.status(500).json({ error: error.message });
  }
}
