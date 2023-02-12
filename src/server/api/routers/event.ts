import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    return prisma.event.findMany({
      orderBy: {
        scheduleTime: "desc",
      },

      include: {
        _count: true,
      },
    });
  }),
  details: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { eventId } = input;

      return await prisma.event.findFirst({
        where: {
          id: eventId,
        },
      });
    }),
  fullDetails: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { eventId } = input;

      return await prisma.event.findFirst({
        where: {
          id: eventId,
        },
        include: {
          eventParticipant: true,
        },
      });
    }),
  start: publicProcedure
    .input(
      z.object({
        kilometer: z.enum(["3", "5", "10"]),
        timeStart: z.date(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { kilometer, timeStart, eventId } = input;

      if (kilometer === "3") {
        return await prisma.$transaction(async (tx) => {
          await tx.eventParticipant.updateMany({
            where: {
              eventId: eventId,
              distance: 3,
            },
            data: {
              enableCamera: true,
            },
          });

          return await prisma.event.update({
            where: {
              id: eventId,
            },
            data: {
              timeStart3km: timeStart,
            },
          });
        });
      } else if (kilometer === "5") {
        return await prisma.$transaction(async (tx) => {
          await tx.eventParticipant.updateMany({
            where: {
              eventId: eventId,
              distance: 5,
            },
            data: {
              enableCamera: true,
            },
          });

          return await prisma.event.update({
            where: {
              id: eventId,
            },
            data: {
              timeStart3km: timeStart,
            },
          });
        });
      } else if (kilometer === "10") {
        return await prisma.$transaction(async (tx) => {
          await tx.eventParticipant.updateMany({
            where: {
              eventId: eventId,
              distance: 10,
            },
            data: {
              enableCamera: true,
            },
          });

          return await prisma.event.update({
            where: {
              id: eventId,
            },
            data: {
              timeStart3km: timeStart,
            },
          });
        });
      }
    }),
  end: publicProcedure
    .input(
      z.object({
        kilometer: z.enum(["3", "5", "10"]),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { kilometer, eventId } = input;

      if (kilometer === "3") {
        return await prisma.$transaction(async (tx) => {
          await tx.eventParticipant.updateMany({
            where: {
              eventId: eventId,
              distance: 3,
            },
            data: {
              raceEnded: true,
            },
          });

          return await prisma.event.update({
            where: {
              id: eventId,
            },
            data: {
              raceFinished3km: true,
            },
          });
        });
      } else if (kilometer === "5") {
        return await prisma.$transaction(async (tx) => {
          await tx.eventParticipant.updateMany({
            where: {
              eventId: eventId,
              distance: 5,
            },
            data: {
              raceEnded: true,
            },
          });

          return await prisma.event.update({
            where: {
              id: eventId,
            },
            data: {
              raceFinished5km: true,
            },
          });
        });
      } else if (kilometer === "10") {
        return await prisma.$transaction(async (tx) => {
          await tx.eventParticipant.updateMany({
            where: {
              eventId: eventId,
              distance: 10,
            },
            data: {
              raceEnded: true,
            },
          });

          return await prisma.event.update({
            where: {
              id: eventId,
            },
            data: {
              raceFinished10km: true,
            },
          });
        });
      }
    }),
});
