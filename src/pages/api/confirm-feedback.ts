import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { email } = req.body;

      await prisma.user.update({
        where: {
          email: email as string,
        },
        data: {
          profile: {
            update: {
              feedback: true,
            },
          },
        },
      });

      res.status(200).send({ message: "Feedback confirmed" });
    } catch (error) {
      res.status(500).send({ error: "Failed to update profile" });
    }
  }

  res.status(405).send({ error: "Method not allowed" });
}
