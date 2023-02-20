import { type NextPage } from "next";

import Image from "next/image";

import ScreenContainer from "../../../layouts/ScreenContainer";

import RaffleDraw from "../../../components/RaffleDraw";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import LoadSpinner from "../../../components/LoadingSpinner";

import RaffleLayout from "../../../assets/raffle/raffle-layout.png";
import RaffleWinner from "../../../assets/raffle/raffle-winner.png";
import { useState } from "react";

const Raffle: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: eventData, isLoading } = api.event.details.useQuery({
    eventId: eventId as string,
  });

  const { data: eventWinner } = api.event.getEventWinner.useQuery(
    {
      eventId: eventId as string,
    },
    {
      enabled: !!eventData,
    }
  );

  const [winner, setWInner] = useState<number | null>();

  if (isLoading) {
    return <LoadSpinner />;
  }

  if (!eventData) {
    return (
      <ScreenContainer className="pt-20">
        <p className="text-3xl">Event not found!</p>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="h-screen py-6">
      <div className="grid h-full grid-cols-6 grid-rows-6 border-2 border-solid border-black">
        <div className="col-span-4 row-span-4 border-b-2 border-solid border-black">
          <div className="relative flex h-full items-center justify-center">
            {/* <Image
              src={RaffleLayout}
              alt="Raffle Layout"
              fill
              className="object-fill"
            /> */}

            <Image
              src={RaffleWinner}
              alt="Raffle Winner"
              fill
              className="object-fill"
            />

            <p className="absolute top-[150px] left-[280px] right-[100px] text-center text-8xl font-semibold text-gray-700 drop-shadow-2xl">
              3330
            </p>
          </div>
        </div>
        <div className="col-span-2 row-span-6 border-l-2 border-solid border-black">
          <h3 className="text-center text-3xl font-semibold">WINNERS</h3>

          <table className="w-full">
            <thead className="w-full">
              <tr className="grid grid-cols-6 border-y-2 border-solid border-black">
                <th className="col-span-3 border-r-2 border-solid border-black py-1">
                  REGISTRATION #
                </th>
                <th className="col-span-3 py-1">
                  CLAIMED{" "}
                  <span className="rounded-sm bg-green-600 px-1 text-white">
                    YES
                  </span>
                  {"/"}
                  <span className="rounded-sm bg-red-600 px-1 text-white">
                    NO
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {eventWinner &&
                eventWinner.map(
                  ({ registrationNumber, price, id, isClaimed }) => (
                    <tr
                      key={id}
                      className="grid grid-cols-6 border-b-2 border-solid border-black"
                    >
                      <td className="col-span-3 border-r-2 border-solid border-black py-1 px-2 text-sm">
                        {registrationNumber}
                      </td>
                      {isClaimed && (
                        <td className="col-span-3 bg-green-600 py-1 px-2 text-center text-sm font-bold text-white">
                          YES
                        </td>
                      )}

                      {!isClaimed && (
                        <td className="col-span-3 bg-red-600 py-1 px-2 text-center text-sm font-bold text-white">
                          NO
                        </td>
                      )}
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
        <div className="col-span-4 row-span-2 grid grid-cols-6">
          <div className="col-span-4 p-2">
            <input
              type="text"
              className="w-full text-[50px] font-semibold uppercase"
            />

            <h3 className="bg-slate-300 py-2 text-center text-xl font-medium">
              CONTROLS
            </h3>

            <div className="grid grid-cols-2 bg-slate-200 p-2">
              <div className="col-span-1">
                <label htmlFor="finisher" className="flex items-center gap-2">
                  <input id="finisher" type="checkbox" />
                  FINISHER
                </label>
              </div>
              <div className="col-span-1">
                <label htmlFor="3km" className="flex items-center gap-2">
                  <input id="3km" type="checkbox" className="accent-km3" />3 KM
                </label>
              </div>
              <div className="col-span-1">
                <label htmlFor="5km" className="flex items-center gap-2">
                  <input id="5km" type="checkbox" className="accent-km5" />5 KM
                </label>
              </div>
              <div className="col-span-1">
                <label htmlFor="10km" className="flex items-center gap-2">
                  <input id="10km" type="checkbox" className="accent-km10" />
                  10 KM
                </label>
              </div>
              <div className="col-span-1">
                <label htmlFor="all" className="flex items-center gap-2">
                  <input id="all" type="checkbox" className="accent-km10" />
                  ALL
                </label>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex h-full items-center justify-center">
            <button className="flex h-5/6 w-5/6 items-center justify-center rounded-full bg-red-800 text-4xl text-white transition-all hover:bg-red-900 active:translate-y-1">
              DRAW!
            </button>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default Raffle;
