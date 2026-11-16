import { safeRedditPostUrl } from './selection.mjs';

export function pageRefusal(text) {
  // Reddit can render its "community not found" shell behind the age gate.
  // The explicit mature-content gate must win over that generic shell.
  if (/This (?:page|post|community) (?:may contain|contains) (?:mature|adult|sensitive or adult)|This content is for adults|You must be 18|mature audiences|Mature Content[\s\S]{0,220}confirm your age|are you (?:over )?18|confirm (?:that )?you(?:'re| are) (?:over )?18/i.test(text)) return 'REDDIT_ADULT_CONTENT';
  if (/Too Many Requests/i.test(text)) return 'REDDIT_RATE_LIMITED';
  if (/blocked by network security|network policy/i.test(text)) return 'REDDIT_NETWORK_BLOCKED';
  if (/This (?:post|community) (?:has been|was) (?:deleted|removed|banned)|This community is private|Community not found|Page not found/i.test(text)) return 'REDDIT_UNAVAILABLE';
  return null;
}

export function snapshotInPage(id) {
  const node = document.getElementById(`t3_${id}`);
  if (!node || node.tagName.toLowerCase() !== 'shreddit-post') return { matchedPost: false };
  const attrs = n => Object.fromEntries([...n.attributes].map(a => [a.name, a.value]));
  return { matchedPost: true, attributes: attrs(node),
    players: [...node.querySelectorAll('shreddit-player,shreddit-player-2,video,source')]
      .map(n => ({ tag: n.tagName, attributes: attrs(n) })),
    nestedPostIds: [...node.querySelectorAll('shreddit-post[id]')].map(n => n.id),
    sourceLinks: [...node.querySelectorAll('a[href*="/comments/"]')]
      .map(n => n.getAttribute('href')).filter(Boolean),
  };
}

function mediaUrl(value, hosts) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') && hosts.includes(u.hostname) ? u.toString() : null;
  } catch { return null; }
}

function isAdult(attributes) {
  // These are boolean HTML attributes: even nsfw="false" is present/true.
  return ['nsfw', 'is-nsfw', 'post-is-nsfw'].some(key => Object.hasOwn(attributes, key)) ||
    attributes.over_18 === true || attributes.over_18 === 'true';
}

export function parsePost(snapshot, expectedId) {
  const a = snapshot?.attributes;
  if (!snapshot?.matchedPost || !a || a.id !== `t3_${expectedId}` || typeof a['post-type'] !== 'string') throw new Error('REDDIT_POST_MISMATCH');
  if (isAdult(a) || snapshot.players?.some(p => isAdult(p.attributes || {}))) throw new Error('REDDIT_ADULT_CONTENT');
  const common = { id: expectedId, title: a['post-title'] || '', over_18: false, age_verified: true,
    webpage_url: `https://www.reddit.com${a.permalink || `/comments/${expectedId}/`}` };
  const nested = snapshot.nestedPostIds?.find(id => /^t3_[a-z0-9]+$/i.test(id) && id !== a.id)?.slice(3);
  const declared = /^t3_([a-z0-9]+)$/i.exec(a['crosspost-parent-id'] || '')?.[1];
  const contentPost = safeRedditPostUrl(a['content-href']);
  const sourceId = declared || nested || (contentPost?.id !== expectedId ? contentPost?.id : null);
  if (sourceId) return { ...common, kind: 'crosspost', source_url: contentPost?.id === sourceId ? contentPost.url : `https://www.reddit.com/comments/${sourceId}/` };
  if (a['post-type'] === 'crosspost') throw new Error('REDDIT_AGE_UNVERIFIED');

  const image = mediaUrl(a['content-href'], ['i.redd.it']);
  if (image && /\.(?:jpe?g|png|webp|gif)(?:[?#]|$)/i.test(image)) return { ...common, kind: 'photo', image_url: image };
  const players = (snapshot.players || []).filter(p => !p.attributes?.['post-id'] || p.attributes['post-id'] === a.id);
  const content = mediaUrl(a['content-href'], ['v.redd.it']);
  const player = players.find(p => mediaUrl(p.attributes?.src, ['v.redd.it']));
  const source = content || mediaUrl(player?.attributes?.src, ['v.redd.it']);
  const videoId = source ? /^\/([a-z0-9]{6,64})(?:\/|$)/i.exec(new URL(source).pathname)?.[1] : null;
  if (!videoId) throw new Error('REDDIT_NO_MEDIA');
  const root = `https://v.redd.it/${videoId}/`;
  const hls = mediaUrl(player?.attributes?.src, ['v.redd.it']);
  let duration;
  try { duration = JSON.parse(player?.attributes?.['packaged-media-json'] || '{}').playbackMp4s?.duration; } catch { /* optional */ }
  return { ...common, kind: 'video', video_id: videoId,
    dash_url: `${root}DASHPlaylist.mpd`,
    hls_url: hls?.startsWith(root) ? hls : `${root}HLSPlaylist.m3u8`,
    duration: Number.isFinite(duration) && duration > 0 ? duration : null,
    thumbnail: mediaUrl(player?.attributes?.poster, ['preview.redd.it', 'external-preview.redd.it', 'i.redd.it']),
  };
}
