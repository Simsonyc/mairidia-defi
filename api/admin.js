// GET /api/admin : liste complète pour l'espace admin (clé requise dans l'en-tête X-Admin-Key)
const db = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return db.repondre(res, 405, { success: false, error: 'Méthode non autorisée' });
  if (!db.estAdmin(req)) return db.repondre(res, 401, { success: false, error: 'Clé admin incorrecte' });
  try {
    const participants = (await db.tousLesParticipants())
      .map(p => ({ ...p, tickets: Math.floor(p.points / 10) }))
      .sort((a, b) => b.points - a.points);
    return db.repondre(res, 200, { success: true, participants });
  } catch (e) {
    return db.erreurServeur(res, e);
  }
};
