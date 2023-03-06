import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { ShirtSize } from "@prisma/client";

export const officialsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.profile.findMany({
        where: {
          officials: false,
          OR: [
            {
              firstName: {
                contains: input.name ? input.name : "",
              },
            },
            {
              lastName: {
                contains: input.name ? input.name : "",
              },
            },
          ],
        },
        orderBy: [
          {
            lastName: "asc",
          },
          {
            firstName: "asc",
          },
        ],

        include: {
          eventParticitpant: true,
        },

        take: input.limit + 1,

        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (data.length > input.limit) {
        const nextItem = data.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return {
        data,
        nextCursor,
      };
    }),
  getOfficialsOnly: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.profile.findMany({
        where: {
          officials: true,
        },
        orderBy: [
          {
            lastName: "asc",
          },
          {
            firstName: "asc",
          },
        ],

        include: {
          eventParticitpant: {
            include: {
              event: true,
            },
          },
        },
      })
  ),
  makeOfficial: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.update({
        where: {
          id: input.profileId,
        },
        data: {
          officials: true,
        },
      });
    }),
  join: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
        eventId: z.string(),
        distance: z.number(),
        shirtSize: z.nativeEnum(ShirtSize),
        registrationNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.eventParticipant.upsert({
        where: {
          eventId_profileId: {
            eventId: input.eventId,
            profileId: input.profileId,
          },
        },
        update: {
          distance: input.distance,
          shirtSize: input.shirtSize,
        },
        create: {
          distance: input.distance,
          shirtSize: input.shirtSize,
          profileId: input.profileId,
          eventId: input.eventId,
          registrationNumber: input.registrationNumber,
        },
      });
    }),
});
