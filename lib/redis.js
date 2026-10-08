// Accès à la base Upstash Redis via son API REST (aucune dépendance npm).
// Vercel crée automatiquement ces variables quand on connecte Upstash au projet.
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const KEY_PARTICIPANTS = 'mairidia:participants'; // hash : numéro -> JSON du participant
const KEY_GAGNANTS = 'mairidia:gagnants';         // liste JSON des gagnants publiés

async function redis(...command) {
  if (!URL || !TOKEN) throw new Error('BASE_NON_CONFIGUREE');
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || `Erreur Redis ${res.status}`);
  return data.result;
}

async function tousLesParticipants() {
  const flat = (await redis('HGETALL', KEY_PARTICIPANTS)) || [];
  const liste = [];
  for (let i = 0; i < flat.length; i += 2) {
    try { liste.push(JSON.parse(flat[i + 1])); } catch (e) { /* ligne corrompue ignorée */ }
  }
  return liste;
}

async function lireParticipant(numero) {
  const v = await redis('HGET', KEY_PARTICIPANTS, numero);
  return v ? JSON.parse(v) : null;
}

async function ecrireParticipant(p) {
  await redis('HSET', KEY_PARTICIPANTS, p.numero, JSON.stringify(p));
}

async function creerParticipantSiAbsent(p) {
  // HSETNX : n'écrit que si le numéro n'existe pas encore (évite les doublons au rechargement de page)
  return (await redis('HSETNX', KEY_PARTICIPANTS, p.numero, JSON.stringify(p))) === 1;
}

async function lireGagnants() {
  const v = await redis('GET', KEY_GAGNANTS);
  return v ? JSON.parse(v) : [];
}

async function ecrireGagnants(liste) {
  await redis('SET', KEY_GAGNANTS, JSON.stringify(liste));
}

// Vérifie la clé admin envoyée dans l'en-tête X-Admin-Key
function estAdmin(req) {
  const attendue = process.env.ADMIN_KEY;
  const recue = req.headers['x-admin-key'] || '';
  if (!attendue) return false;
  if (recue.length !== attendue.length) return false;
  let diff = 0;
  for (let i = 0; i < attendue.length; i++) diff |= attendue.charCodeAt(i) ^ recue.charCodeAt(i);
  return diff === 0;
}

function lireCorps(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}

function repondre(res, statut, donnees) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(statut).json(donnees);
}

function erreurServeur(res, e) {
  if (e.message === 'BASE_NON_CONFIGUREE') {
    return repondre(res, 500, { success: false, error: "La base de données n'est pas connectée au projet Vercel." });
  }
  console.error(e);
  return repondre(res, 500, { success: false, error: 'Erreur serveur' });
}

const PROFILS = ['explorateur', 'optimiseur', 'ecoconnecte', 'multimodal', 'declencheur'];

module.exports = {
  redis, tousLesParticipants, lireParticipant, ecrireParticipant, creerParticipantSiAbsent,
  lireGagnants, ecrireGagnants, estAdmin, lireCorps, repondre, erreurServeur, PROFILS
};
