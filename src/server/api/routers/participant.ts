import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { ShirtSize, EventParticipant, Profile, User } from "@prisma/client";
import { FaLessThanEqual } from "react-icons/fa";
import { getFinishedTime } from "../../../utils/convertion";

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
        distance: z.number().optional(),
        registrationNumber: z.number().optional(),
        name: z.string().optional(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const registrants = await ctx.prisma.eventParticipant.findMany({
        where: {
          eventId: input.eventId,
          registrationNumber: input.registrationNumber,
          distance: input.distance,
          profile: {
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
        },
        orderBy: {
          registrationNumber: "asc",
        },
        include: {
          profile: true,
        },
        take: input.limit + 1,

        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (registrants.length > input.limit) {
        const nextItem = registrants.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return {
        registrants,
        nextCursor,
      };
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
              gender: true,
            },
          },
        },
        orderBy: {
          timeFinished: "asc",
        },
      });
    }),
  getList: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        distance: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { eventId, distance } = input;

      return await ctx.prisma.eventParticipant.findMany({
        where: {
          eventId: eventId,
          distance: distance,
        },
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              address: true,
              municipality: true,
              contactNumber: true,
            },
          },
        },
        orderBy: {
          registrationNumber: "asc",
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
  getEventProfile: protectedProcedure
    .input(
      z.object({
        profileId: z.string().optional(),
        eventId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const eventParticipant = await ctx.prisma.eventParticipant.findFirst({
        where: {
          profileId: input.profileId,
          eventId: input.eventId,
        },

        include: {
          profile: true,
          event: true,
        },
      });

      let time = "";

      if (eventParticipant) {
        const { timeFinished, distance, event } = eventParticipant;

        if (timeFinished) {
          if (distance === 3 && event.timeStart3km) {
            time = getFinishedTime(timeFinished, event.timeStart3km);
          } else if (distance === 5 && event.timeStart5km) {
            time = getFinishedTime(timeFinished, event.timeStart5km);
          } else if (distance === 10 && event.timeStart10km) {
            time = getFinishedTime(timeFinished, event.timeStart10km);
          }

          return { ...eventParticipant, time };
        } else {
          return { ...eventParticipant, time };
        }
      }

      return null;
    }),
  join: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
        eventId: z.string(),
        shirtSize: z.nativeEnum(ShirtSize),
        distance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.eventParticipant.findMany({
        orderBy: {
          registrationNumber: "desc",
        },
        take: 1,
      });

      return await ctx.prisma.eventParticipant.create({
        data: {
          ...input,
          registrationNumber: data[0]?.registrationNumber
            ? data[0].registrationNumber + 1
            : 3350,
        },
      });
    }),
  editEventProfile: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
        eventId: z.string(),
        shirtSize: z.nativeEnum(ShirtSize),
        distance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.eventParticipant.update({
        where: {
          eventId_profileId: {
            eventId: input.eventId,
            profileId: input.profileId,
          },
        },
        data: {
          shirtSize: input.shirtSize,
          distance: input.distance,
        },
      });
    }),
  certScan: publicProcedure
    .input(
      z.object({
        eventParticipantId: z.string().optional(),
        eventParticipantInfo: z
          .object({
            registrationNumber: z.number(),
            firstName: z.string(),
            lastName: z.string(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { eventParticipantId, eventParticipantInfo } = input;

      let data:
        | (EventParticipant & {
            profile: Profile & {
              user: User | null;
            };
          })
        | null = null;

      if (eventParticipantId) {
        data = await ctx.prisma.eventParticipant.findFirst({
          where: {
            id: eventParticipantId,
          },
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!data) throw new Error("Invalid qr code");
      } else if (eventParticipantInfo) {
        const { firstName, lastName, registrationNumber } =
          eventParticipantInfo;

        data = await ctx.prisma.eventParticipant.findFirst({
          where: {
            registrationNumber,
            profile: {
              firstName: firstName,
              lastName: lastName,
            },
          },
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!data) throw new Error("Invalid credentials");
      }

      if (!data?.timeFinished) {
        throw new Error(
          "You can't claim certificate without finishing the race"
        );
      }

      if (!data.profile.user) {
        return { unclaimed: true, profileId: data.profile.id };
      }

      return { unclaimed: false, profileId: data.profile.id };
    }),
});
