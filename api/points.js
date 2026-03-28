// api/points.js — Ajouter des points après validation d'un défi
// Appelé manuellement par l'équipe (ou via interface admin future)

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'data', 'participants.json');
// Clé secrète simple pour protéger l'endpoint
const ADMIN_KEY = process.env.ADMIN_KEY || 'mairidia2025';

function readData() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch {
    return { participants: [], lastUpdated: '' };
  }
}

function writeData(data) {
  data.lastUpdated = new Date().toISOString();
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Auth basique
  const adminKey = req.headers['x-admin-key'] || req.body.admin_key;
  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const { numero, defi_id, points_bonus, type } = req.body;

  if (!numero) {
    return res.status(400).json({ error: 'Numéro manquant' });
  }

  const data = readData();
  const idx = data.participants.findIndex(p => p.numero === numero);

  if (idx === -1) {
    return res.status(404).json({ error: 'Participant introuvable' });
  }

  const pts = points_bonus || (defi_id ? 10 : 5);
  data.participants[idx].points += pts;

  if (defi_id && !data.participants[idx].defis_realises?.includes(defi_id)) {
    data.participants[idx].defis_realises = data.participants[idx].defis_realises || [];
    data.participants[idx].defis_realises.push(defi_id);
    data.participants[idx].defis = data.participants[idx].defis_realises.length;
  }

  if (type === 'challenge7') {
    data.participants[idx].challenge7 = true;
  }

  try {
    writeData(data);
    return res.status(200).json({
      success: true,
      nouveau_total: data.participants[idx].points,
      tickets: Math.floor(data.participants[idx].points / 10)
    });
  } catch (e) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
