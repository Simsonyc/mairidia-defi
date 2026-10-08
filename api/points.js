// POST /api/points : valide un défi et crédite les points (clé admin requise)
const db = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return db.repondre(res, 405, { success: false, error: 'Méthode non autorisée' });
  if (!db.estAdmin(req)) return db.repondre(res, 401, { success: false, error: 'Clé admin incorrecte' });
  try {
    const b = db.lireCorps(req);
    const numero = String(b.numero || '').trim().toUpperCase();
    const pts = parseInt(b.points_bonus, 10);
    const type = b.type === 'challenge7' ? 'challenge7' : 'defi';
    const defiId = type === 'defi' ? parseInt(b.defi_id, 10) : null;

    if (!Number.isInteger(pts) || pts < 1 || pts > 100) return db.repondre(res, 400, { success: false, error: 'Nombre de points invalide (1 à 100)' });
    if (type === 'defi' && !(defiId >= 1 && defiId <= 5)) return db.repondre(res, 400, { success: false, error: 'Défi invalide' });

    const p = await db.lireParticipant(numero);
    if (!p) return db.repondre(res, 404, { success: false, error: `Aucun participant avec le numéro ${numero}` });

    p.defis_ids = p.defis_ids || [];
    if (type === 'defi') {
      if (p.defis_ids.includes(defiId)) return db.repondre(res, 409, { success: false, error: `Le défi ${defiId} est déjà validé pour ce participant` });
      p.defis_ids.push(defiId);
      p.defis = p.defis_ids.length;
    } else {
      if (p.challenge7) return db.repondre(res, 409, { success: false, error: 'Le Challenge 7 jours est déjà validé pour ce participant' });
      p.challenge7 = true;
    }
    p.points += pts;
    p.historique = (p.historique || []).concat({ date: new Date().toISOString(), type, defi_id: defiId, points: pts, preuve: String(b.lien_preuve || '').slice(0, 300) });
    await db.ecrireParticipant(p);

    return db.repondre(res, 200, { success: true, nouveau_total: p.points, tickets: Math.floor(p.points / 10) });
  } catch (e) {
    return db.erreurServeur(res, e);
  }
};
