// =============================================
// MAIRIDIA DÉFI — Scoring & Utilitaires
// =============================================

const SCORING = {
  q1: {
    a: { explorateur: 3, multimodal: 1 },
    b: { explorateur: 1, optimiseur: 2 },
    c: { optimiseur: 3, multimodal: 1 },
    d: { ecoconnecte: 1, multimodal: 3 }
  },
  q2: {
    a: { explorateur: 3 },
    b: { optimiseur: 2, ecoconnecte: 1, multimodal: 1 },
    c: { ecoconnecte: 3, declencheur: 1 },
    d: { optimiseur: 1, ecoconnecte: 1, declencheur: 3 }
  },
  q3: {
    a: { optimiseur: 3, multimodal: 1 },
    b: { ecoconnecte: 3, declencheur: 1 },
    c: { explorateur: 2, optimiseur: 1 },
    d: { explorateur: 3, multimodal: 1 }
  },
  q4: {
    a: { explorateur: 3 },
    b: { explorateur: 1, optimiseur: 2 },
    c: { optimiseur: 1, ecoconnecte: 1, multimodal: 3 },
    d: { ecoconnecte: 2, multimodal: 3, declencheur: 1 }
  },
  q5: {
    a: { explorateur: 3 },
    b: { explorateur: 1, optimiseur: 2 },
    c: { ecoconnecte: 2, multimodal: 1, declencheur: 3 },
    d: { multimodal: 2, declencheur: 3 }
  }
};

const PROFILS = {
  explorateur: {
    id: 'explorateur',
    emoji: '🚶',
    nom: 'Explorateur Méridien',
    couleur: '#7eb8f7',
    description: 'Tu te déplaces encore par habitude, mais tu es prêt à tester autre chose. Chaque nouveau trajet est une opportunité de découverte.',
    badge: 'Ouvert & Curieux',
    defi_suggere: 2
  },
  optimiseur: {
    id: 'optimiseur',
    emoji: '⚡',
    nom: 'Optimiseur Urbain',
    couleur: '#f7c948',
    description: 'Tu cherches le trajet le plus malin, pas forcément le plus rapide. L\'efficacité est ton moteur.',
    badge: 'Efficace & Pragmatique',
    defi_suggere: 5
  },
  ecoconnecte: {
    id: 'ecoconnecte',
    emoji: '🌿',
    nom: 'Éco-Connecté',
    couleur: '#b8f542',
    description: 'Tes choix de mobilité reflètent tes valeurs environnementales. Tu es déjà dans la bonne direction.',
    badge: 'Engagé & Cohérent',
    defi_suggere: 1
  },
  multimodal: {
    id: 'multimodal',
    emoji: '🔀',
    nom: 'Multimodal Engagé',
    couleur: '#f742c8',
    description: 'Tu combines déjà plusieurs modes — tu es un modèle sans le savoir. Continue à explorer les combinaisons.',
    badge: 'Adaptable & Curieux',
    defi_suggere: 4
  },
  declencheur: {
    id: 'declencheur',
    emoji: '💡',
    nom: 'Déclencheur de Changement',
    couleur: '#ff6b35',
    description: 'Tu as le potentiel d\'entraîner les autres autour de toi. Ton influence est ton superpouvoir.',
    badge: 'Leader & Influenceur',
    defi_suggere: 3
  }
};

const DEFIS = [
  {
    id: 1,
    emoji: '🚴',
    titre: 'Défi Vélo / Marche',
    description: 'Viens à pied ou à vélo au moins 1 jour cette semaine.',
    preuve: 'Selfie à l\'arrivée sur le campus avec ton numéro',
    points: 10
  },
  {
    id: 2,
    emoji: '🚌',
    titre: 'Nouveau Transport',
    description: 'Teste un transport en commun que tu n\'utilises pas encore.',
    preuve: 'Photo dans le transport avec ton numéro',
    points: 10
  },
  {
    id: 3,
    emoji: '🚗',
    titre: 'Covoiturage',
    description: 'Organise ou rejoins un covoiturage avec un étudiant.',
    preuve: 'Post duo avec ton binôme + ton numéro',
    points: 10
  },
  {
    id: 4,
    emoji: '🔀',
    titre: 'Multimodal',
    description: 'Combine 2 modes de transport sur un même trajet.',
    preuve: 'Screenshot de ton itinéraire combiné + ton numéro',
    points: 10
  },
  {
    id: 5,
    emoji: '💶',
    titre: 'Calculer mon Trajet',
    description: 'Calcule et partage le coût réel de ton trajet habituel.',
    preuve: 'Post avec ton calcul et une alternative moins chère + ton numéro',
    points: 10
  }
];

// =============================================
// SCORING
// =============================================
function calculerProfil(reponses) {
  const scores = {
    explorateur: 0,
    optimiseur: 0,
    ecoconnecte: 0,
    multimodal: 0,
    declencheur: 0
  };

  Object.entries(reponses).forEach(([question, reponse]) => {
    const pointsQuestion = SCORING[question]?.[reponse];
    if (pointsQuestion) {
      Object.entries(pointsQuestion).forEach(([profil, pts]) => {
        scores[profil] += pts;
      });
    }
  });

  // Trouver le profil dominant (Q5 comme tiebreaker)
  let maxScore = -1;
  let profilGagnant = 'explorateur';

  const ordre = ['declencheur', 'multimodal', 'ecoconnecte', 'optimiseur', 'explorateur'];
  ordre.forEach(profil => {
    if (scores[profil] > maxScore) {
      maxScore = scores[profil];
      profilGagnant = profil;
    }
  });

  return { profil: profilGagnant, scores };
}

// =============================================
// NUMERO DE PARTICIPATION
// =============================================
function genererNumero() {
  const mois = new Date().toISOString().slice(0, 7).replace('-', '');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `MAI-${mois}-${rand}`;
}

function genererPseudo() {
  const adj = ['Rapide', 'Vert', 'Urbain', 'Futé', 'Agile', 'Solaire', 'Libre', 'Malin'];
  const nom = ['Aigle', 'Lynx', 'Colibri', 'Renard', 'Dauphin', 'Faucon', 'Bison', 'Cerf'];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj[Math.floor(Math.random() * adj.length)]}-${nom[Math.floor(Math.random() * nom.length)]}-${num}`;
}

// =============================================
// SESSION STORAGE
// =============================================
function saveSession(data) {
  sessionStorage.setItem('mairidia_session', JSON.stringify(data));
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem('mairidia_session')) || {};
  } catch { return {}; }
}

// =============================================
// API CALLS
// =============================================
async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('API error:', e);
    return { success: false };
  }
}

async function apiGet(endpoint) {
  try {
    const res = await fetch(`/api/${endpoint}`);
    return await res.json();
  } catch (e) {
    console.error('API error:', e);
    return null;
  }
}
