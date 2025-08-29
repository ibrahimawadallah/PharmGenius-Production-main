import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let drugsDb = null;
let icd10Db = null;

export const sqliteStatus = {
  drugs: false,
  icd10: false,
  paths: { drugs: null, icd10: null },
  error: null
};

function openDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
}

export async function initSQLite() {
  try {
    const baseDir = path.resolve(__dirname, '..', '..', 'database');

    // Prefer scalable DB if present
    const defaultDrugsPath = fs.existsSync(path.join(baseDir, 'drugs_scalable.db'))
      ? path.join(baseDir, 'drugs_scalable.db')
      : path.join(baseDir, 'drugs.db');

    const drugsDbPath = process.env.DRUGS_DB_PATH || defaultDrugsPath;
    const icd10DbPath = process.env.ICD10_DB_PATH || path.join(baseDir, 'medical_data.db');

    if (fs.existsSync(drugsDbPath)) {
      drugsDb = await openDatabase(drugsDbPath);
      sqliteStatus.drugs = true;
      sqliteStatus.paths.drugs = drugsDbPath;
    }

    if (fs.existsSync(icd10DbPath)) {
      icd10Db = await openDatabase(icd10DbPath);
      sqliteStatus.icd10 = true;
      sqliteStatus.paths.icd10 = icd10DbPath;
    }
  } catch (err) {
    sqliteStatus.error = err.message;
  }
}

export function closeSQLite() {
  if (drugsDb) {
    try { drugsDb.close(); } catch {}
    drugsDb = null;
  }
  if (icd10Db) {
    try { icd10Db.close(); } catch {}
    icd10Db = null;
  }
}

function allAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function getAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

export async function queryDrugsSQLite(query = '', category = '', limit = 20) {
  if (!sqliteStatus.drugs || !drugsDb) return [];
  const where = [];
  const params = [];

  if (query) {
    where.push('(LOWER(drug_name) LIKE ? OR LOWER(generic_name) LIKE ? OR LOWER(manufacturer) LIKE ?)');
    const q = `%${query.toLowerCase()}%`;
    params.push(q, q, q);
  }
  if (category) {
    where.push('LOWER(category) LIKE ?');
    params.push(`%${category.toLowerCase()}%`);
  }

  const sql = `
    SELECT id, drug_name, generic_name, category, strength, dosage_form, manufacturer,
           indications, contraindications, side_effects, price
    FROM drugs
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY drug_name ASC
    LIMIT ?
  `;
  params.push(Number(limit));

  const rows = await allAsync(drugsDb, sql, params);
  // Map to API format
  return rows.map(r => ({
    id: String(r.id),
    drug_name: r.drug_name || 'Unknown',
    generic_name: r.generic_name || 'Unknown',
    category: r.category || 'Medication',
    strength: r.strength || '',
    dosage_form: r.dosage_form || '',
    indications: r.indications || `${r.drug_name || 'This medication'} is available in the market.`,
    contraindications: r.contraindications || 'Please consult healthcare provider for contraindications.',
    side_effects: r.side_effects || 'Please consult healthcare provider for side effects.',
    manufacturer: r.manufacturer || '',
    price_public: r.price ?? ''
  }));
}

export async function getDrugByIdSQLite(id) {
  if (!sqliteStatus.drugs || !drugsDb) return null;
  const row = await getAsync(drugsDb, `
    SELECT id, drug_name, generic_name, category, strength, dosage_form, manufacturer,
           indications, contraindications, side_effects, price
    FROM drugs WHERE id = ?
  `, [id]);
  if (!row) return null;
  return {
    id: String(row.id),
    drug_name: row.drug_name || 'Unknown',
    generic_name: row.generic_name || 'Unknown',
    category: row.category || 'Medication',
    strength: row.strength || '',
    dosage_form: row.dosage_form || '',
    indications: row.indications || `${row.drug_name || 'This medication'} is available in the market.`,
    contraindications: row.contraindications || 'Please consult your healthcare provider for specific contraindications and precautions.',
    side_effects: row.side_effects || 'Please consult your healthcare provider for potential side effects and adverse reactions.',
    manufacturer: row.manufacturer || '',
    price_public: row.price ?? ''
  };
}

export async function searchICD10SQLite(query = '', limit = 20) {
  if (!sqliteStatus.icd10 || !icd10Db) return [];
  if (!query) return [];
  const q = `%${query.toLowerCase()}%`;
  const rows = await allAsync(icd10Db, `
    SELECT code, short_description, long_description
    FROM codes
    WHERE LOWER(code) LIKE ? OR LOWER(short_description) LIKE ? OR LOWER(long_description) LIKE ?
    ORDER BY code ASC
    LIMIT ?
  `, [q, q, q, Number(limit)]);
  return rows.map(r => ({ code: r.code, description: r.short_description || r.long_description || '' }));
}