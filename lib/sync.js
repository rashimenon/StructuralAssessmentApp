// lib/sync.js
import NetInfo from '@react-native-community/netinfo';
import { getPendingAssessments, markAssessmentSynced } from './localDb';
import { createAssessmentAndUpload } from './upload';

export async function syncPendingAssessments() {
  const net = await NetInfo.fetch();
  if (!net.isConnected) throw new Error('No network');

  const pendings = await getPendingAssessments();
  for (const row of pendings) {
    try {
      const payload = JSON.parse(row.payload);
      const photos = JSON.parse(row.photos);
      await createAssessmentAndUpload({ meta: payload, photos });
      await markAssessmentSynced(row.id);
    } catch (err) {
      console.warn('Sync failed for', row.id, err);
      // keep for retry
    }
  }
}
