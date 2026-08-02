// Builds a transformed Cloudinary delivery URL from a stored public asset URL.
// Used anywhere we need a specific crop/size without pulling in next-cloudinary.
export function cldUrl(url, transform = "f_auto,q_auto") {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}
