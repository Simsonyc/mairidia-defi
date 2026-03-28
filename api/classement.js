// api/classement.js — Retourne le classement public (anonyme)

import { readFileSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'data', 'participants.json');

function readData() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch {
    return { participants: [], lastUpdated: '', gagnants_precedents: [] };
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const data = readData();

  // Filtrer le mois en cours (ou tous si pas de filtre)
  const moisActuel = new Date().toISOString().slice(0, 7);
  const participantsMois = data.participants.filter(p =>
    !p.mois || p.mois === moisActuel
  );

  // Ne renvoyer que les données publiques (pas d'info perso)
  const classementPublic = participantsMois
    .map(p => ({
      pseudo: p.pseudo,
      numero: p.numero,          // numéro anonyme, pas de nom réel
      profil: p.profil,
      points: p.points,
      defis: p.defis || 0,
      tickets: Math.floor(p.points / 10)
    }))
    .sort((a, b) => b.points - a.points);

  return res.status(200).json({
    participants: classementPublic,
    lastUpdated: data.lastUpdated,
    gagnants_precedents: data.gagnants_precedents || [],
    total: classementPublic.length
  });
}
