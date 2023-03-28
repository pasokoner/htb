import { Gender, PrismaClient, ShirtSize } from "@prisma/client";

const prisma = new PrismaClient();

//EVENT ID
//test - cle7ygs6x0000f1fgbhvoa9ap
//bagac - cle1fx5dw0000f1e0j1wch7mf

// const VIP = [
//   {
//     firstName: "ACE JELLO",
//     lastName: "CONCEPCION",
//     distance: 10,
//     shirtSize: "L" as ShirtSize,
//     birthdate: new Date(),
//     registrationNumber: 6646,
//     gender: "MALE",
//   },
//   {
//     firstName: "MARIA FE",
//     lastName: "CONCEPCION",
//     distance: 10,
//     shirtSize: "MD" as ShirtSize,
//     registrationNumber: 6647,
//     gender: "FEMALE",
//   },
//   {
//     firstName: "LITO",
//     lastName: "RUBIA",
//     distance: 3,
//     shirtSize: "L" as ShirtSize,
//     registrationNumber: 6648,
//     gender: "MALE",
//   },
//   {
//     firstName: "RONALD",
//     lastName: "ARCENAL",
//     distance: 5,
//     shirtSize: "XL" as ShirtSize,
//     registrationNumber: 6649,
//     gender: "MALE",
//   },
//   {
//     firstName: "SUSAN",
//     lastName: "MURILLO",
//     distance: 3,
//     shirtSize: "MD" as ShirtSize,
//     registrationNumber: 6650,
//     gender: "FEMALE",
//   },
//   {
//     firstName: "JESTER IVAN",
//     lastName: "RICAFRENTE",
//     distance: 5,
//     shirtSize: "XL" as ShirtSize,
//     registrationNumber: 6651,
//     gender: "MALE",
//   },
//   {
//     firstName: "JOSE",
//     lastName: "CARANDANG",
//     distance: 3,
//     shirtSize: "XL" as ShirtSize,
//     registrationNumber: 6652,
//     gender: "MALE",
//   },
//   {
//     firstName: "DANILO",
//     lastName: "BANAL",
//     distance: 5,
//     shirtSize: "S" as ShirtSize,
//     registrationNumber: 6653,
//     gender: "MALE",
//   },
//   {
//     firstName: "OMAR",
//     lastName: "CORNEJO",
//     distance: 5,
//     shirtSize: "L" as ShirtSize,
//     registrationNumber: 6654,
//     gender: "MALE",
//   },
//   {
//     firstName: "VONNEL",
//     lastName: "ISIP",
//     distance: 5,
//     shirtSize: "L" as ShirtSize,
//     registrationNumber: 6655,
//     gender: "MALE",
//   },
//   {
//     firstName: "JEFFREY",
//     lastName: "PENALOSA",
//     distance: 5,
//     shirtSize: "L" as ShirtSize,
//     registrationNumber: 6656,
//     gender: "MALE",
//   },
//   {
//     firstName: "VENANCIO",
//     lastName: "VILLAPANDO",
//     distance: 5,
//     shirtSize: "L" as ShirtSize,
//     registrationNumber: 6657,
//     gender: "MALE",
//   },
//   {
//     firstName: "VINCE CHARLES",
//     lastName: "BANZON",
//     distance: 5,
//     shirtSize: "L" as ShirtSize,
//     registrationNumber: 6658,
//     gender: "MALE",
//   },
//   {
//     firstName: "RICHARD",
//     lastName: "MAINGAT",
//     distance: 5,
//     shirtSize: "XL" as ShirtSize,
//     registrationNumber: 6659,
//     gender: "MALE",
//   },
//   {
//     firstName: "ROLANDO",
//     lastName: "CRUZ",
//     distance: 3,
//     shirtSize: "MD" as ShirtSize,
//     registrationNumber: 6660,
//     gender: "MALE",
//   },
//   {
//     firstName: "GERALD",
//     lastName: "SEBASTIAN",
//     distance: 3,
//     shirtSize: "XXL" as ShirtSize,
//     registrationNumber: 6661,
//     gender: "MALE",
//   },
//   {
//     firstName: "CLAY",
//     lastName: "GOMEZ",
//     distance: 5,
//     shirtSize: "L" as ShirtSize,
//     registrationNumber: 6662,
//     gender: "MALE",
//   },
//   {
//     firstName: "GLADYS",
//     lastName: "GOMEZ",
//     distance: 5,
//     shirtSize: "MD" as ShirtSize,
//     registrationNumber: 6663,
//     gender: "FEMALE",
//   },
//   {
//     firstName: "RAYMUNDO",
//     lastName: "CUADRO",
//     distance: 3,
//     shirtSize: "MD" as ShirtSize,
//     registrationNumber: 6664,
//     gender: "MALE",
//   },
//   {
//     firstName: "GLADY GLOCHIERGE",
//     lastName: "DACION",
//     distance: 3,
//     shirtSize: "S" as ShirtSize,
//     registrationNumber: 6665,
//     gender: "FEMALE",
//   },
//   {
//     firstName: "LEA",
//     lastName: "PASCOGUIN",
//     distance: 3,
//     shirtSize: "MD" as ShirtSize,
//     registrationNumber: 6666,
//     gender: "FEMALE",
//   },
// ];

// const VIP = [
//   {
//     firstName: "GILA",
//     lastName: "GARCIA",
//     distance: 5,
//     shirtSize: "S" as ShirtSize,
//     registrationNumber: 5371,
//     gender: "FEMALE",
//   },
//   {
//     firstName: "ROLLIE",
//     lastName: "ROXAS",
//     distance: 5,
//     shirtSize: "MD" as ShirtSize,
//     registrationNumber: 5372,
//     gender: "MALE",
//   },
// ];

const VIPF: {
  firstName: string;
  lastName: string;
  gender: Gender;
  birthdate: Date;
  contactNumber: string;
  address: string;
  emergencyContact: string;
  emergencyContactNumber: string;
  eventParticitpant: {
    eventId: string;
    shirtSize: ShirtSize;
    distance: number;
    registrationNumber: number;
  }[];
}[] = [];

for (let i = 1; i <= 1; i++) {
  const registrationNumber = 7441 + i;

  VIPF.push({
    firstName: `MARIVELES${registrationNumber}`,
    lastName: `MARIVELES${registrationNumber}`,
    gender: "MALE",
    birthdate: new Date("03/23/2023"),
    contactNumber: "N/A",
    address: "N/A",
    emergencyContact: "N/A",
    emergencyContactNumber: "N/A",
    eventParticitpant: [
      {
        eventId: "clenx05d90000f1u4vaj7mwek",
        shirtSize: "XL" as ShirtSize,
        distance: 5,
        registrationNumber: registrationNumber,
      },
    ],
  });
}

// function findDuplicates(arr: number[]): number[] {
//   const duplicates: number[] = [];
//   const seen: Record<number, boolean> = {};

//   for (let i = 0; i < arr.length; i++) {
//     if (seen[arr[i] as number]) {
//       duplicates.push(arr[i] as number);
//     } else {
//       seen[arr[i] as number] = true;
//     }
//   }

//   return duplicates;
// }

const main = async () => {
  try {
    // const VIPF = VIP.map(
    //   ({
    //     firstName,
    //     lastName,
    //     gender,
    //     distance,
    //     shirtSize,
    //     registrationNumber,
    //   }) => {
    //     return {
    //       firstName,
    //       lastName,
    //       gender: gender as Gender,
    //       birthdate: new Date(),
    //       contactNumber: "09123456789",
    //       address: "N/A",
    //       emergencyContact: "N/A",
    //       emergencyContactNumber: "09123456789",
    //       eventParticitpant: [
    //         {
    //           eventId: "clenx05d90000f1u4vaj7mwek",
    //           shirtSize: shirtSize,
    //           distance,
    //           registrationNumber,
    //         },
    //       ],
    //     };
    //   }
    // );

    await prisma.$transaction(async (tx) => {
      // await Promise.all(
      //   VIPF.map((participant) => {
      //     const { eventParticitpant, ...data } = participant;

      //     return tx.profile.create({
      //       data: {
      //         ...data,
      //         eventParticitpant: {
      //           create: eventParticitpant,
      //         },
      //       },
      //     });
      //   })
      // );

      for (const participant of VIPF.slice(0, 5)) {
        const { eventParticitpant, ...data } = participant;

        await tx.profile.create({
          data: {
            ...data,
            eventParticitpant: {
              create: eventParticitpant,
            },
          },
        });
      }

      // return await tx.profile.createMany({
      //   data: VIPF,
      // });

      return;
    });

    // const data = await prisma.eventParticipant.findMany({});

    // console.log(
    //   findDuplicates(data.map(({ registrationNumber }) => registrationNumber))
    // );
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
