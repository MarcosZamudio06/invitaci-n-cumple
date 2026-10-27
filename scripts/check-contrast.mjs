import { invitation } from "../src/config/invitation.ts";
const { theme } = invitation;
function luminance(hex) {
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return rgb.reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function ratio(a, b) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const pairs = [
  ["Focus outline / ivory", theme.focusRing, theme.ivory],
  ["Focus outline / white", theme.focusRing, theme.surface],
  ["Inverse focus outline / teal", theme.ivory, theme.deepTeal],
  ["Body / ivory", theme.text, theme.ivory],
  ["Body / white", theme.text, theme.surface],
  ["Date / water", theme.text, theme.water],
  ["Reminder / sage", theme.text, theme.sage],
  ["Artwork / champagne", theme.text, theme.champagne],
  ["Button and countdown / teal", theme.ivory, theme.deepTeal],
  ["Countdown labels / teal", theme.champagne, theme.deepTeal],
];
const results = pairs.map(([usage, foreground, background]) => ({
  usage,
  foreground,
  background,
  ratio: Number(ratio(foreground, background).toFixed(2)),
  normalTextAA: ratio(foreground, background) >= 4.5,
}));
console.log(
  JSON.stringify(
    {
      standard: "WCAG 2.2 AA normal text >= 4.5:1",
      results,
      notes: [
        "Dusty coral is decorative only; deep teal on dusty coral is 3.38:1 and is not used for normal text.",
        "This checks authored solid token pairs, not rendered opacity, overlays or device color reproduction.",
      ],
    },
    null,
    2,
  ),
);
if (results.some((r) => !r.normalTextAA)) process.exitCode = 1;
