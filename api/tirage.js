// POST /api/tirage : publie le gagnant du tirage sur la page classement (clé admin requise)
const db = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return db.repondre(res, 405, { success: false, error: 'Méthode non autorisée' });
  if (!db.estAdmin(req)) return db.repondre(res, 401, { success: false, error: 'Clé admin incorrecte' });
  try {
    const b = db.lireCorps(req);
    const numero = String(b.numero || '').trim().toUpperCase();
    const p = await db.lireParticipant(numero);
    if (!p) return db.repondre(res, 404, { success: false, error: 'Gagnant introuvable' });

    const gagnants = await db.lireGagnants();
    gagnants.unshift({
      numero: p.numero, pseudo: p.pseudo,
      lot: String(b.lot || 'Lot du mois').slice(0, 120),
      date: new Date().toISOString()
    });
    await db.ecrireGagnants(gagnants.slice(0, 10)); // on garde les 10 derniers
    return db.repondre(res, 200, { success: true });
  } catch (e) {
    return db.erreurServeur(res, e);
  }
};
