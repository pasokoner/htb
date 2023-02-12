import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { Gender, Municipality, Prisma } from "@prisma/client";

export const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.nativeEnum(Gender),
  birthdate: z.date(),
  contactNumber: z.string(),
  municipality: z.nativeEnum(Municipality).optional(),
  address: z.string(),
  emergencyContact: z.string(),
  emergencyContactNumber: z.string(),
});

export const profileRouter = createTRPCRouter({
  setup: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      const { session, prisma } = ctx;

      try {
        return await prisma.$transaction(async (tx) => {
          const profile = await tx.profile.create({
            data: {
              ...input,
            },
          });

          return await tx.user.update({
            where: {
              id: session.user.id,
            },
            data: {
              profileId: profile.id,
            },
          });
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
          }
        }
        throw e;
      }
    }),
  firstTime: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.profile.update({
        where: { id: input.profileId },
        data: {
          firstTime: false,
        },
      });
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findFirst({
      where: {
        id: ctx.session.user.profileId as string,
      },
    });
  }),
});
