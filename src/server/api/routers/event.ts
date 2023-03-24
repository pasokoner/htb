import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { EventParticipant, Profile } from "@prisma/client";

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
              timeStart5km: timeStart,
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
              timeStart10km: timeStart,
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
  breakdown: protectedProcedure
    .input(
      z.object({
        finishers: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const events = await prisma.event.findMany({
        where: {
          NOT: {
            id: "clde678wm0004f1k4bofoulll",
          },
        },

        include: {
          eventParticipant: true,
        },

        orderBy: {
          scheduleTime: "desc",
        },
      });

      const eventsF = events
        .filter(({ name }) => {
          if (ctx.session?.user.role === "SUPERADMIN") {
            return true;
          }

          return name !== "test";
        })
        .map(({ name, eventParticipant }) => {
          const three = eventParticipant.filter(({ timeFinished, distance }) =>
            input.finishers ? !!timeFinished && distance === 3 : distance === 3
          );
          const five = eventParticipant.filter(({ timeFinished, distance }) =>
            input.finishers ? !!timeFinished && distance === 5 : distance === 5
          );
          const ten = eventParticipant.filter(({ timeFinished, distance }) =>
            input.finishers
              ? !!timeFinished && distance === 10
              : distance === 10
          );

          return {
            name,
            three: three.length,
            five: five.length,
            ten: ten.length,
          };
        });

      return [
        ...eventsF,
        {
          name: "Hermosa",
          three: input.finishers ? 834 : 1563,
          five: input.finishers ? 456 : 949,
          ten: input.finishers ? 380 : 787,
        },
      ];
    }),
  config: protectedProcedure
    .input(
      z.object({
        cameraPassword: z.string(),
        eventId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { cameraPassword, eventId } = input;

      return ctx.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          cameraPassword: cameraPassword,
        },
      });
    }),
  raffleDraw: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        price: z.string(),
        numOfWinners: z.number(),
        filter: z.object({
          finisher: z.boolean(),
          km10: z.boolean(),
          km5: z.boolean(),
          km3: z.boolean(),
          all: z.boolean(),
          dummy: z.boolean(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { filter } = input;

      const eventWinner = (await prisma.eventWinner.findMany({})).map(
        ({ registrationNumber }) => registrationNumber
      );

      const eventParticipants = await prisma.eventParticipant.findMany({
        where: {
          eventId: input.eventId,
          registrationNumber: {
            notIn: filter.all ? [] : eventWinner,
          },
          OR: [
            { distance: filter.km3 ? 3 : undefined },
            { distance: filter.km5 ? 5 : undefined },
            { distance: filter.km10 ? 10 : undefined },
          ],
          NOT: {
            timeFinished: filter.finisher ? null : undefined,
          },
          profile: {
            NOT: {
              firstName: filter.dummy ? undefined : { contains: "MARIVELES" },
            },
          },
        },

        include: {
          profile: true,
        },
      });

      // const randomIndex = Math.floor(Math.random() * eventParticipants.length);

      for (let i = eventParticipants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = eventParticipants[i];
        eventParticipants[i] = eventParticipants[j] as EventParticipant & {
          profile: Profile;
        };
        eventParticipants[j] = temp as EventParticipant & {
          profile: Profile;
        };
      }

      const resultArray: {
        eventId: string | undefined;
        registrationNumber: number;
        price: string;
        name: string;
      }[] = [];

      for (let i = 0; i < input.numOfWinners; i++) {
        resultArray.push({
          eventId: eventParticipants[i]?.eventId,
          registrationNumber: eventParticipants[i]
            ?.registrationNumber as number,
          price: input.price,
          name: `${eventParticipants[i]?.profile.firstName as string} ${
            eventParticipants[i]?.profile.lastName as string
          }`,
        });
      }

      const result = await prisma.eventWinner.createMany({
        data: resultArray,
      });

      return resultArray;
    }),
  getEventWinner: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.eventWinner.findMany({
        where: {
          eventId: input.eventId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  claim: publicProcedure
    .input(z.object({ eventWinnerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.eventWinner.update({
        where: {
          id: input.eventWinnerId,
        },
        data: {
          isClaimed: true,
        },
      });
    }),
});
