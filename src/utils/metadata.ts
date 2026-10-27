interface Metadata {
  title: string;
  description: string;
  socialImage: string;
}
const escapeHTML = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
/** Build-time HTML, including multiline templates; no client JS needed for social crawlers. */
export function applyInvitationMetadata(
  html: string,
  seo: Metadata,
  publicUrl = "",
) {
  const root = publicUrl
    ? new URL(publicUrl).href.replace(/\/$/, "") + "/"
    : "";
  const meta = (kind: string, name: string, value: string) =>
    `<meta ${kind}="${name}" content="${escapeHTML(value)}"/>`;
  return html
    .replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeHTML(seo.title)}</title>`,
    )
    .replace(
      /<meta\b[^>]*\bname=["']description["'][^>]*>/i,
      meta("name", "description", seo.description),
    )
    .replace(
      /<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/i,
      meta("property", "og:title", seo.title),
    )
    .replace(
      /<meta\b[^>]*\bproperty=["']og:description["'][^>]*>/i,
      meta("property", "og:description", seo.description),
    )
    .replace(
      "<!-- PUBLIC_SOCIAL -->",
      root
        ? `<link rel="canonical" href="${escapeHTML(root)}"/>${meta("property", "og:url", root)}${meta("property", "og:image", root + seo.socialImage)}${meta("name", "twitter:image", root + seo.socialImage)}`
        : meta("name", "robots", "noindex,nofollow"),
    );
}
