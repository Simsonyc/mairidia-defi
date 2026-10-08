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
    couleur: '#3bc8f1', // Bleu clair (charte)
    icone: 'boussole',
    description: 'Tu te déplaces encore par habitude, mais tu es prêt à tester autre chose. Chaque nouveau trajet est une opportunité de découverte.',
    badge: 'Ouvert & Curieux',
    defi_suggere: 2
  },
  optimiseur: {
    id: 'optimiseur',
    emoji: '⚡',
    nom: 'Optimiseur Urbain',
    couleur: '#ffcd0d', // Jaune (charte)
    icone: 'eclair',
    description: 'Tu cherches le trajet le plus malin, pas forcément le plus rapide. L\'efficacité est ton moteur.',
    badge: 'Efficace & Pragmatique',
    defi_suggere: 5
  },
  ecoconnecte: {
    id: 'ecoconnecte',
    emoji: '🌿',
    nom: 'Éco-Connecté',
    couleur: '#97c700', // Vert clair (charte)
    icone: 'feuille',
    description: 'Tes choix de mobilité reflètent tes valeurs environnementales. Tu es déjà dans la bonne direction.',
    badge: 'Engagé & Cohérent',
    defi_suggere: 1
  },
  multimodal: {
    id: 'multimodal',
    emoji: '🔀',
    nom: 'Multimodal Engagé',
    couleur: '#23c2be', // Turquoise (charte)
    icone: 'multimodal',
    description: 'Tu combines déjà plusieurs modes — tu es un modèle sans le savoir. Continue à explorer les combinaisons.',
    badge: 'Adaptable & Curieux',
    defi_suggere: 4
  },
  declencheur: {
    id: 'declencheur',
    emoji: '💡',
    nom: 'Déclencheur de Changement',
    couleur: '#ff6600', // Orange (charte)
    icone: 'megaphone',
    description: 'Tu as le potentiel d\'entraîner les autres autour de toi. Ton influence est ton superpouvoir.',
    badge: 'Leader & Influenceur',
    defi_suggere: 3
  }
};

const DEFIS = [
  {
    id: 1,
    emoji: '🚴',
    icone: 'velo',
    couleur: '#97c700',
    titre: 'Défi Vélo / Marche',
    description: 'Viens à pied ou à vélo au moins 1 jour cette semaine.',
    preuve: 'Selfie à l\'arrivée sur le campus avec ton numéro',
    points: 10
  },
  {
    id: 2,
    emoji: '🚌',
    icone: 'bus',
    couleur: '#3bc8f1',
    titre: 'Nouveau Transport',
    description: 'Teste un transport en commun que tu n\'utilises pas encore.',
    preuve: 'Photo dans le transport avec ton numéro',
    points: 10
  },
  {
    id: 3,
    emoji: '🚗',
    icone: 'duo',
    couleur: '#ff6600',
    titre: 'Covoiturage',
    description: 'Organise ou rejoins un covoiturage avec un étudiant.',
    preuve: 'Post duo avec ton binôme + ton numéro',
    points: 10
  },
  {
    id: 4,
    emoji: '🔀',
    icone: 'multimodal',
    couleur: '#23c2be',
    titre: 'Multimodal',
    description: 'Combine 2 modes de transport sur un même trajet.',
    preuve: 'Screenshot de ton itinéraire combiné + ton numéro',
    points: 10
  },
  {
    id: 5,
    emoji: '💶',
    icone: 'euro',
    couleur: '#ffcd0d',
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

// =============================================
// PICTOS (remplacent les emojis dans l'interface)
// Tracés inspirés de Lucide (licence ISC), trait 2px, couleur héritée.
// Les champs "emoji" restent disponibles pour les textes à poster sur les réseaux.
// =============================================
const ICONES = {
  boussole:  '<circle cx="12" cy="12" r="9"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  eclair:    '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  feuille:   '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
  multimodal:'<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  velo:      '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
  bus:       '<rect x="4" y="3" width="16" height="16" rx="3"/><path d="M4 11h16M8 15h.01M16 15h.01M6 19v2M18 19v2"/>',
  duo:       '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  euro:      '<path d="M4 10h12M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
  flamme:    '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  ticket:    '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
  trophee:   '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16"/><path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.1.5 2 2 2 3.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  coche:     '<path d="M20 6 9 17l-5-5"/>',
  copier:    '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  photo:     '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  video:     '<path d="m22 8-6 4 6 4z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  trajet:    '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  cadenas:   '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  actualiser:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  bulle:     '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  etoile:    '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z"/>',
  cadeau:    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  loupe:     '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  liste:     '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  tirage:    '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/><circle cx="12" cy="12" r="1"/>',
  utilisateur:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  calendrier:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
};

function icone(nom, taille) {
  const d = ICONES[nom] || ICONES.utilisateur;
  const t = taille ? ` width="${taille}" height="${taille}"` : '';
  return `<svg class="ico"${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

// Remplace automatiquement les <span data-ico="nom"></span> présents dans le HTML
function injecterIcones(racine) {
  (racine || document).querySelectorAll('[data-ico]').forEach(el => {
    if (!el.dataset.icoDone) {
      el.innerHTML = icone(el.dataset.ico, el.dataset.icoTaille);
      el.dataset.icoDone = '1';
    }
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => injecterIcones());
} else {
  injecterIcones();
}
