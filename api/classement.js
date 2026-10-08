// GET /api/classement : classement public (sans les numéros de participation)
const db = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return db.repondre(res, 405, { success: false, error: 'Méthode non autorisée' });
  try {
    const [participants, gagnants] = await Promise.all([db.tousLesParticipants(), db.lireGagnants()]);
    const publics = participants
      .map(p => ({ pseudo: p.pseudo, profil: p.profil, points: p.points, defis: p.defis || 0 }))
      .sort((a, b) => b.points - a.points);
    return db.repondre(res, 200, { participants: publics, gagnants_precedents: gagnants });
  } catch (e) {
    return db.erreurServeur(res, e);
  }
};
