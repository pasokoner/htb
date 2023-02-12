import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const participantRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.eventParticipant.findMany({
        where: {
          eventId: input.eventId,
        },
        orderBy: {
          registrationNumber: "asc",
        },
      });
    }),
  getByQuery: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        registrationNumber: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.eventParticipant.findMany({
        where: {
          eventId: input.eventId,
          registrationNumber: input.registrationNumber,
        },
        orderBy: {
          registrationNumber: "asc",
        },
        include: {
          profile: true,
        },
        take: input.take,
      });
    }),
  getFinishers: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        distance: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { eventId, distance } = input;

      return await ctx.prisma.eventParticipant.findMany({
        where: {
          eventId: eventId,
          distance: distance,
          NOT: {
            timeFinished: null,
          },
        },
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          timeFinished: "asc",
        },
      });
    }),
  getFinishersBatch: publicProcedure
    .input(
      z.object({
        distance: z.number(),
        eventId: z.string(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { distance, eventId, limit, cursor, skip } = input;

      const [finishers, finishersCount] = await ctx.prisma.$transaction([
        ctx.prisma.eventParticipant.findMany({
          where: {
            eventId: eventId,
            distance: distance,
            NOT: {
              timeFinished: null,
            },
          },
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            timeFinished: "asc",
          },
          take: limit + 1,

          cursor: cursor ? { id: cursor } : undefined,
        }),
        ctx.prisma.eventParticipant.count({
          where: {
            eventId: eventId,
            distance: distance,
            NOT: {
              timeFinished: null,
            },
          },
        }),
      ]);

      let nextCursor: typeof cursor | undefined = undefined;
      if (finishers.length > limit) {
        const nextItem = finishers.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return {
        finishers,
        finishersCount,
        nextCursor,
      };
    }),
  editName: publicProcedure
    .input(
      z.object({
        participantId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { participantId, ...data } = input;

      const { prisma } = ctx;

      await prisma.eventParticipant.update({
        where: {
          id: participantId,
        },
        data: {
          profile: {
            update: {
              ...data,
            },
          },
        },
      });
    }),
});
