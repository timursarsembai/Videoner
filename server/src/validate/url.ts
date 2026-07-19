import { Platform } from 'src/types';

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isYoutubeUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Handle all YouTube domains and formats
    const validDomains = [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'm.youtube.com',
      'music.youtube.com',
      'gaming.youtube.com',
    ];

    // Check if it's a valid YouTube domain
    if (!validDomains.includes(hostname)) {
      return false;
    }

    // Handle different URL patterns
    if (hostname === 'youtu.be') {
      // Short URLs must have a video ID
      return urlObj.pathname.length > 1;
    } else {
      // Regular YouTube URLs
      const validPaths = ['/watch', '/shorts', '/live', '/playlist', '/embed'];
      const path = urlObj.pathname.toLowerCase();

      // For watch URLs, must have a video ID
      if (path === '/watch') {
        return urlObj.searchParams.has('v');
      }

      // For other valid paths, must have content after the path
      if (validPaths.some((p) => path.startsWith(p))) {
        return path.length > validPaths.find((p) => path.startsWith(p))!.length;
      }
    }

    return false;
  } catch {
    return false;
  }
};
export const isFacebookUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Handle all Facebook domains
    const validDomains = [
      'facebook.com',
      'www.facebook.com',
      'web.facebook.com',
      'm.facebook.com',
      'fb.watch',
    ];

    if (!validDomains.includes(hostname)) {
      return false;
    }

    // Handle different URL patterns
    const validPaths = [
      '/watch',
      '/videos',
      '/reel',
      '/story',
      '/groups',
      '/share/v',
    ];
    const path = urlObj.pathname.toLowerCase();

    // For watch URLs
    if (path.startsWith('/watch')) {
      return urlObj.searchParams.has('v');
    }

    // For other valid paths, must have content after the path
    return validPaths.some((p) => path.startsWith(p) && path.length > p.length);
  } catch {
    return false;
  }
};

export const isInstagramUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Handle all Instagram domains
    const validDomains = [
      'instagram.com',
      'www.instagram.com',
      'm.instagram.com',
    ];

    if (!validDomains.includes(hostname)) {
      return false;
    }

    // Handle different URL patterns
    const validPaths = ['/p/', '/reel/', '/reels/', '/tv/', '/stories/'];
    const path = urlObj.pathname.toLowerCase();

    // Must have content after valid paths
    return validPaths.some((p) => path.startsWith(p) && path.length > p.length);
  } catch {
    return false;
  }
};

export const isTikTokUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Handle all TikTok domains
    const validDomains = [
      'tiktok.com',
      'www.tiktok.com',
      'm.tiktok.com',
      'vm.tiktok.com',
    ];

    if (!validDomains.includes(hostname)) {
      return false;
    }

    // Handle different URL patterns
    const path = urlObj.pathname.toLowerCase();

    // TikTok video pattern: /@username/video/1234567890
    if (path.match(/^\/@[\w.-]+\/video\/\d+/)) {
      return true;
    }

    // Short URL pattern: /t/1234567890
    if (path.match(/^\/t\/[\w]+/)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export const isTwitterUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Handle all Twitter domains
    const validDomains = [
      'twitter.com',
      'www.twitter.com',
      'mobile.twitter.com',
      'x.com',
      'www.x.com',
    ];

    if (!validDomains.includes(hostname)) {
      return false;
    }

    // Handle different URL patterns
    const path = urlObj.pathname.toLowerCase();

    // Twitter status pattern: /username/status/1234567890
    return path.match(/^\/[\w]+\/status\/\d+/) !== null;
  } catch {
    return false;
  }
};

export const getPlatform = (url: string) => {
  if (isYoutubeUrl(url)) return 'youtube';
  if (isFacebookUrl(url)) return 'facebook';
  if (isInstagramUrl(url)) return 'instagram';
  if (isTikTokUrl(url)) return 'tiktok';
  if (isTwitterUrl(url)) return 'twitter';
  return null;
};
