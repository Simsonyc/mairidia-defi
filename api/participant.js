// api/participant.js — Enregistrement d'un nouveau participant
// Déployé sur Vercel comme serverless function

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'data', 'participants.json');

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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { numero, pseudo, profil, points, timestamp } = req.body;

  // Validation basique
  if (!numero || !pseudo || !profil) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  // Vérifier que le numéro n'existe pas déjà
  const data = readData();
  const exists = data.participants.find(p => p.numero === numero);

  if (exists) {
    return res.status(200).json({ success: true, already_exists: true });
  }

  // Ajouter le participant
  data.participants.push({
    numero,
    pseudo,
    profil,
    points: points || 5,
    defis: 0,
    defis_realises: [],
    timestamp: timestamp || new Date().toISOString(),
    mois: new Date().toISOString().slice(0, 7)
  });

  try {
    writeData(data);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Write error:', e);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
