// lib/localDb.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('assessments.db');

export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pending_assessments (
         id TEXT PRIMARY KEY,
         payload TEXT,
         photos TEXT,
         synced INTEGER DEFAULT 0,
         created_at TEXT
       );`
    );
  });
}

export function addPendingAssessment(id, payloadObj, photosArray) {
  const payload = JSON.stringify(payloadObj);
  const photos = JSON.stringify(photosArray);
  const created_at = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO pending_assessments (id, payload, photos, synced, created_at) values (?, ?, ?, 0, ?)`,
        [id, payload, photos, created_at],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
}

export function getPendingAssessments() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM pending_assessments WHERE synced = 0`,
        [],
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });
}

export function markAssessmentSynced(id) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE pending_assessments SET synced = 1 WHERE id = ?`,
        [id],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
}
