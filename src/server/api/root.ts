import { createTRPCRouter } from "./trpc";
import { eventRouter } from "./routers/event";
import { exampleRouter } from "./routers/example";
import { officialsRouter } from "./routers/officials";
import { participantRouter } from "./routers/participant";
import { profileRouter } from "./routers/profile";
import { scanRouter } from "./routers/scan";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  example: exampleRouter,
  officials: officialsRouter,
  participant: participantRouter,
  profile: profileRouter,
  scan: scanRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
