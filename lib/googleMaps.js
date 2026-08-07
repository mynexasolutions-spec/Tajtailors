// Turns whatever a shop owner pastes into the "Google Maps link" setting
// into an embeddable iframe src. Handles three shapes: a full
// google.com/maps/place/...@lat,lng URL (has coordinates in it already), a
// short share link (maps.app.goo.gl / share.google — needs a redirect
// followed to reach the coordinates), or plain text (treated as a place
// search query).

const SHORT_LINK_HOSTS = ["maps.app.goo.gl", "share.google", "goo.gl"];

function extractLatLng(url) {
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };
  return null;
}

// Sync — safe to call on every render. Only works well on already-resolved
// full URLs; short links fall back to being embedded as a raw text query,
// which usually still finds the right place but isn't as precise.
export function buildMapsEmbedSrc(rawValue) {
  if (!rawValue) return null;
  const coords = extractLatLng(rawValue);
  if (coords) return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(rawValue)}&z=16&output=embed`;
}

// Async, server-only — follows a short share link's redirect chain to reach
// the full google.com/maps/place/...@lat,lng URL, so it can be stored
// pre-resolved and rendered without a network round-trip on every page load.
export async function resolveMapsLink(rawUrl) {
  if (!rawUrl) return rawUrl;
  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return rawUrl; // Plain text (e.g. an address) — nothing to resolve.
  }

  if (!SHORT_LINK_HOSTS.some((host) => parsed.hostname.includes(host))) {
    return rawUrl;
  }

  try {
    const res = await fetch(parsed.toString(), { redirect: "follow" });
    res.body?.cancel?.();
    return res.url || rawUrl;
  } catch {
    return rawUrl; // Resolution failed — keep the short link, embed will fall back to a text query.
  }
}
