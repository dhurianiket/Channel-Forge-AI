// Dispatcher exposes these as a single interface
import { executeRenderJob } from "./executors/renderExecutor";
import { executePublishJob } from "./executors/publishExecutor";
import { executeAnalyticsSync } from "./executors/analyticsExecutor";
import { executeShortsExtraction } from "./executors/shortsExecutor";

export const Dispatcher = {
    dispatchRender: executeRenderJob,
    dispatchPublish: executePublishJob,
    dispatchAnalyticsSync: executeAnalyticsSync,
    dispatchShortsExtraction: executeShortsExtraction,
};
