// Categories have several descriptions so that a bicycle in a street scene
// can compete with a close-up of a bicycle without changing the target label.
export const TOPICS = {
  bicycles: ['a bicycle', 'a cyclist riding a bicycle'],
  motorcycles: ['a motorcycle', 'a person riding a motorcycle'],
  cars: ['a car', 'cars on a street'],
  buses: ['a bus', 'a school bus'],
  trucks: ['a truck'],
  tractors: ['a tractor'],
  crosswalks: ['a pedestrian crosswalk with white stripes', 'a zebra crossing on a road'],
  'traffic lights': ['a traffic light', 'a traffic signal'],
  'fire hydrants': ['a fire hydrant'],
  stairs: ['a staircase', 'outdoor stairs'],
  bridges: ['a bridge'],
  chimneys: ['a chimney on a roof'],
  taxis: ['a taxi cab'],
  boats: ['a boat'],
  airplanes: ['an airplane'],
  mountains: ['mountains'],
  trees: ['a tree'],
  palms: ['a palm tree'],
  background: [
    'an empty road without a crosswalk', 'a building', 'a sidewalk',
    'the sky', 'a street sign', 'a parking meter', 'a person walking',
    'an empty street intersection without a crosswalk',
  ],
};

export const LABELS = Object.values(TOPICS).flat();

export const CLASSIFIER_CLASSES = ['bicycles', 'bridges', 'buses', 'cars', 'chimneys', 'crosswalks',
  'fire hydrants', 'motorcycles', 'mountains', 'background', 'palms', 'stairs', 'tractors', 'traffic lights'];

export function supportsChallenge(target, count) {
  return count === 9 ? target !== 'background' && CLASSIFIER_CLASSES.includes(target)
    : count === 16 && Boolean(DETECTOR_LABELS[target]);
}

export function challengeTarget(description) {
  const normalized = description.toLowerCase().replace(/\s+/g, ' ');
  const aliases = {
    bicycles: /\bbicycles?\b/, motorcycles: /\b(?:motorcycles?|motorbikes?)\b/,
    cars: /\bcars?\b/, buses: /\bbus(?:es)?\b/, trucks: /\btrucks?\b/, tractors: /\btractors?\b/,
    crosswalks: /\b(?:crosswalks?|pedestrian crossings?)\b/,
    'traffic lights': /\btraffic lights?\b/, 'fire hydrants': /\bfire hydrants?\b/,
    stairs: /\b(?:stairs|staircases?)\b/, bridges: /\bbridges?\b/,
    chimneys: /\bchimneys?\b/, taxis: /\b(?:taxis?|taxicabs?)\b/,
    boats: /\bboats?\b/, airplanes: /\b(?:airplanes?|aeroplanes?)\b/,
    mountains: /\bmountains?\b/, palms: /\bpalm (?:tree|trees)\b/, trees: /\btrees?\b/,
  };
  return Object.entries(aliases).find(([, pattern]) => pattern.test(normalized))?.[0] ?? null;
}

export function targetScore(predictions, target) {
  const positive = new Set(TOPICS[target] ?? []);
  const bestTarget = Math.max(0, ...predictions.filter(p => positive.has(p.label)).map(p => p.score));
  const bestOther = Math.max(0, ...predictions.filter(p => !positive.has(p.label)).map(p => p.score));
  // Match this small model's published operating point. Requiring 0.65
  // misses genuine low-contrast crosswalks (observed live at 0.51).
  return { bestTarget, bestOther, selected: bestTarget >= 0.42 || (bestTarget >= 0.315 && bestTarget >= bestOther) };
}

export const DETECTOR_LABELS = {
  bicycles: 'bicycle', motorcycles: 'motorcycle', cars: 'car', buses: 'bus',
  trucks: 'truck', 'traffic lights': 'traffic light', 'fire hydrants': 'fire hydrant',
  boats: 'boat', airplanes: 'airplane',
};

// Boxes use 0..1 coordinates relative to the whole challenge image. Require
// a real intersection to avoid selecting a neighbour on a rounded boundary.
export function tilesForDetections(detections, target, side) {
  const label = DETECTOR_LABELS[target];
  if (!label) return null;
  const selected = new Set();
  for (const item of detections) {
    if (item.label !== label || item.score < 0.3) continue;
    const { xmin, ymin, xmax, ymax } = item.box;
    if (![xmin, ymin, xmax, ymax].every(Number.isFinite)) continue;
    for (let row = 0; row < side; row++) for (let col = 0; col < side; col++) {
      const w = Math.min(xmax, (col + 1) / side) - Math.max(xmin, col / side);
      const h = Math.min(ymax, (row + 1) / side) - Math.max(ymin, row / side);
      if (w > 0.006 && h > 0.006) selected.add(row * side + col);
    }
  }
  return [...selected].sort((a, b) => a - b);
}

export function safeRedditPostUrl(value) {
  try {
    const u = new URL(value);
    if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password || u.port) return null;
    if (u.hostname === 'redd.it') {
      const id = /^\/([a-z0-9]+)\/?$/i.exec(u.pathname)?.[1];
      return id ? { id: id.toLowerCase(), url: `https://www.reddit.com/comments/${id.toLowerCase()}/` } : null;
    }
    if (!/^(?:(?:www|old|m|np|new)\.)?reddit\.com$/.test(u.hostname)) return null;
    const id = /^\/(?:r\/[^/]+\/|user\/[^/]+\/)?comments\/([a-z0-9]+)(?:\/|$)/i.exec(u.pathname)?.[1];
    if (!id) return /^\/r\/[^/]+\/s\/[a-z0-9_-]+\/?$/i.test(u.pathname) ? { id: null, url: `https://www.reddit.com${u.pathname}` } : null;
    return { id: id.toLowerCase(), url: `https://www.reddit.com${u.pathname}` };
  } catch { return null; }
}
