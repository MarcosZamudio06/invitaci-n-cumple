import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { applyInvitationMetadata } from "../utils/metadata";
import { invitation } from "../config/invitation";
it("applies central metadata to multiline tags and escapes customized copy", () => {
  const html =
    '<title>Old</title><meta\n name="description"\n content="Old desc"/><meta\n property="og:title" content="Old"/><meta\n property="og:description"\n content="Old desc"/><!-- PUBLIC_SOCIAL -->';
  const output = applyInvitationMetadata(
    html,
    {
      title: "New & Luci",
      description: 'New "pool" <party>',
      socialImage: "social.png",
    },
    "https://example.org/party",
  );
  expect(output).toContain("<title>New &amp; Luci</title>");
  expect(output.match(/New &quot;pool&quot; &lt;party&gt;/g)).toHaveLength(2);
  expect(output).not.toContain("Old desc");
  expect(output).toContain("https://example.org/party/social.png");
});
it("uses a contrast-safe focus-ring token outside dark sections", () => {
  const css = readFileSync("src/styles.css", "utf8");
  expect(css).toMatch(/outline:\s*3px solid var\(--focus-ring/);
  expect(invitation.theme.focusRing).toBe("#244D55");
});
