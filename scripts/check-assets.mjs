import { readFile, access } from "node:fs/promises";
import { invitation } from "../src/config/invitation.ts";
const output = process.env.BUILD_OUT_DIR || "dist";
const html = await readFile(`${output}/index.html`, "utf8");
const local = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((x) => x.startsWith("/") || x.startsWith("./"));
const base = process.env.PUBLIC_BASE_PATH || "/";
for (const url of local) {
  const relative = url.startsWith(base)
    ? url.slice(base.length)
    : url.replace(/^\.\//, "");
  await access(`${output}/${relative}`);
}
const configured = [
  invitation.seo.socialImage,
  invitation.heroImage?.src,
  invitation.music?.src,
  invitation.dressCode?.reference?.src,
  ...invitation.photos.map((photo) => photo.src),
].filter(Boolean);
for (const asset of configured) {
  if (asset.startsWith("http") || asset.includes(".."))
    throw Error(`Use a local public/ asset: ${asset}`);
  await access(`${output}/${asset.replace(/^\//, "")}`);
}
await access(`${output}/favicon.svg`);
if (
  process.env.PUBLIC_SITE_URL &&
  !html.includes(
    `content="${new URL(process.env.PUBLIC_SITE_URL).href.replace(/\/$/, "")}/${invitation.seo.socialImage}"`,
  )
)
  throw Error("Missing public social image");
console.log(
  `Static assets OK: ${local.length} HTML references, ${configured.length} configured assets and favicon.svg`,
);
