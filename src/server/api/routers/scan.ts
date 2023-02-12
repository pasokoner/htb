import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const scanRouter = createTRPCRouter({
  cameraCheck: publicProcedure
    .input(
      z.object({
        participantId: z.string(),
        timeFinished: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { participantId, timeFinished } = input;

      try {
        await prisma.$transaction(async (tx) => {
          const data = await tx.eventParticipant.findFirst({
            where: {
              id: participantId,
            },
          });

          if (data?.raceEnded) {
            throw new Error("Race has already ended");
          }

          if (!data?.enableCamera) {
            throw new Error("Race hasn't started yet");
          }

          if (!data?.timeFinished) {
            throw new Error("This participant already has a record");
          }

          return await tx.eventParticipant.update({
            where: {
              id: data.id,
            },
            data: {
              timeFinished: timeFinished,
            },
          });
        });
      } catch (e) {
        throw new Error("Some error has occured");
      }
    }),
  manualCheck: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        registrationNumber: z.number(),
        timeFinished: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { registrationNumber, timeFinished, eventId } = input;

      await prisma.$transaction(async (tx) => {
        const data = await tx.eventParticipant.findFirst({
          where: {
            registrationNumber: registrationNumber,
            eventId: eventId,
          },
        });

        if (!data) {
          throw new Error("This Participant doesn't exist");
        }

        if (data?.raceEnded) {
          throw new Error("Race has already ended");
        }

        if (data?.enableCamera) {
          throw new Error("Race hasn't started yet");
        }

        if (data?.timeFinished) {
          throw new Error("This participant already has a record");
        }

        return await tx.eventParticipant.update({
          where: {
            id: data.id,
          },
          data: {
            timeFinished: timeFinished,
          },
        });
      });
    }),
});
