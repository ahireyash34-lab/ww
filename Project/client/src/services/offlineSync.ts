import { uploadAndDiagnoseCrop } from './api';

export interface QueuedDiagnostic {
  id: string;
  timestamp: string;
  cropType: string;
  cropStage: string;
  farmId?: string;
  language: string;
  soilType?: string;
  irrigationMethod?: string;
  recentFoliarSpray?: string;
  affectedAreaPercentage?: number;
  imageBase64: string;
  imageMimeType: string;
  imageFileName: string;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

const STORAGE_KEY = 'agrivision_offline_diagnostics_queue';

export function getQueuedDiagnostics(): QueuedDiagnostic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read offline diagnostics queue:', err);
    return [];
  }
}

export function saveOfflineDiagnostic(item: Omit<QueuedDiagnostic, 'id' | 'timestamp' | 'status'>): QueuedDiagnostic {
  const queue = getQueuedDiagnostics();
  const queuedItem: QueuedDiagnostic = {
    ...item,
    id: `queued-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    status: 'PENDING'
  };

  queue.push(queuedItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  return queuedItem;
}

export function removeQueuedDiagnostic(id: string): void {
  const queue = getQueuedDiagnostics().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

// Convert dataURI or base64 to File object
function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteString = atob(base64.split(',')[1] || base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], filename, { type: mimeType });
}

export async function syncOfflineDiagnosticsQueue(
  onProgress?: (synced: number, total: number) => void
): Promise<{ successCount: number; failedCount: number }> {
  const queue = getQueuedDiagnostics();
  if (queue.length === 0) return { successCount: 0, failedCount: 0 };

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      const file = base64ToFile(item.imageBase64, item.imageFileName, item.imageMimeType);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('cropType', item.cropType);
      formData.append('cropStage', item.cropStage);
      if (item.farmId) formData.append('farmId', item.farmId);
      formData.append('language', item.language);
      if (item.soilType) formData.append('soilType', item.soilType);
      if (item.irrigationMethod) formData.append('irrigationMethod', item.irrigationMethod);
      if (item.recentFoliarSpray) formData.append('recentFoliarSpray', item.recentFoliarSpray);
      if (item.affectedAreaPercentage) formData.append('affectedAreaPercentage', String(item.affectedAreaPercentage));

      await uploadAndDiagnoseCrop(formData);
      removeQueuedDiagnostic(item.id);
      successCount++;
    } catch (err) {
      console.error(`Failed to sync queued scan ${item.id}:`, err);
      failedCount++;
    }

    if (onProgress) {
      onProgress(i + 1, queue.length);
    }
  }

  return { successCount, failedCount };
}
