import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { invitation } from "./src/config/invitation";
import { applyInvitationMetadata } from "./src/utils/metadata";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "PUBLIC_");
  const publicUrl = env.PUBLIC_SITE_URL || "";
  if (
    publicUrl &&
    (!/^https:\/\//.test(publicUrl) || !URL.canParse(publicUrl))
  ) {
    throw new Error("PUBLIC_SITE_URL must be an absolute HTTPS URL");
  }
  return {
    base: env.PUBLIC_BASE_PATH || "/",
    plugins: [
      react(),
      {
        name: "invitation-metadata",
        transformIndexHtml: (html) =>
          applyInvitationMetadata(html, invitation.seo, publicUrl),
      },
    ],
    test: {
      environment: "jsdom",
      setupFiles: "./src/__tests__/setup.ts",
      globals: true,
    },
  };
});
