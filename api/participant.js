// POST /api/participant : enregistre un nouveau participant après le quiz (+5 points)
const db = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return db.repondre(res, 405, { success: false, error: 'Méthode non autorisée' });
  try {
    const b = db.lireCorps(req);
    const numero = String(b.numero || '');
    const pseudo = String(b.pseudo || '');
    const profil = String(b.profil || '');

    if (!/^MAI-\d{6}-\d{4}$/.test(numero)) return db.repondre(res, 400, { success: false, error: 'Numéro invalide' });
    if (!/^[\p{L}]+-[\p{L}]+-\d{3}$/u.test(pseudo)) return db.repondre(res, 400, { success: false, error: 'Pseudo invalide' });
    if (!db.PROFILS.includes(profil)) return db.repondre(res, 400, { success: false, error: 'Profil invalide' });

    const participant = {
      numero, pseudo, profil,
      points: 5,              // fixé côté serveur : le quiz rapporte toujours 5 points
      defis: 0,
      defis_ids: [],
      challenge7: false,
      cree_le: new Date().toISOString()
    };
    const cree = await db.creerParticipantSiAbsent(participant);
    return db.repondre(res, cree ? 201 : 200, { success: true, deja_inscrit: !cree });
  } catch (e) {
    return db.erreurServeur(res, e);
  }
};
