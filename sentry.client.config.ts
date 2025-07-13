// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: "https://85be6900aa0bb18d10cef5f1308ac8e7@o4509547951751168.ingest.us.sentry.io/4509631558057984",
  integrations: [Sentry.browserTracingIntegration()],
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/]
});