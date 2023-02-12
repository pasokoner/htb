import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { eventRouter } from "./routers/event";
import { profileRouter } from "./routers/profile";
import { scanRouter } from "./routers/scan";
import { participantRouter } from "./routers/participant";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  scan: scanRouter,
  example: exampleRouter,
  event: eventRouter,
  participant: participantRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
