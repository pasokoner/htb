import { type NextPage } from "next";

import Image from "next/image";

import ScreenContainer from "../../../layouts/ScreenContainer";

import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import LoadSpinner from "../../../components/LoadingSpinner";

import RaffleLayout from "../../../assets/raffle/raffle-layout.png";
import RaffleWinner from "../../../assets/raffle/raffle-winner.png";
import { useState } from "react";
import { EventWinner } from "@prisma/client";
import ExportEventWinner from "../../../components/ExportEventWinner";

import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";

import { Fireworks } from "@fireworks-js/react";

import { useTimeout } from "usehooks-ts";

const Raffle: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: eventData, isLoading } = api.event.details.useQuery({
    eventId: eventId as string,
  });

  const { data: eventWinner, refetch: refetchWinner } =
    api.event.getEventWinner.useQuery(
      {
        eventId: eventId as string,
      },
      {
        enabled: !!eventData,
      }
    );

  const { mutate: raffleDraw, isLoading: isDrawing } =
    api.event.raffleDraw.useMutation({
      onSuccess(data) {
        setWInner(data);
        setVisible(true);
        setTime(5000);
        void refetchWinner();
      },
    });

  const { mutate: claim } = api.event.claim.useMutation({
    onSuccess() {
      void refetchWinner();
    },
  });

  const [winner, setWInner] = useState<EventWinner | null>();
  const [price, setPrice] = useState("");
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState({
    finisher: false,
    km3: true,
    km5: true,
    km10: true,
    all: false,
  });

  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState<number | null>(null);

  const hide = () => {
    setTime(null);
    setVisible(false);
  };

  useTimeout(hide, time);

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
    <ScreenContainer id="fireworks-container" className="h-screen py-6">
      <div className="grid h-full grid-cols-6 grid-rows-6 border-2 border-solid border-black">
        <div className="col-span-4 row-span-4 border-b-2 border-solid border-black">
          <div className="relative flex h-full items-center justify-center">
            {!winner && (
              <Image
                src={RaffleLayout}
                alt="Raffle Layout"
                fill
                className="object-fill"
              />
            )}

            {winner && (
              <>
                <Image
                  src={RaffleWinner}
                  alt="Raffle Winner"
                  fill
                  className="object-fill"
                />

                <p className="absolute top-[150px] left-[280px] right-[100px] text-center text-8xl font-semibold text-gray-700 drop-shadow-2xl">
                  {winner.registrationNumber}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="col-span-2 row-span-6 border-l-2 border-solid border-black">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-center text-3xl font-semibold">WINNERS</h3>

            <ExportEventWinner
              eventId={eventData.id}
              className="cursor-pointer text-xl"
            />
          </div>
          <table className="w-full">
            <thead className="w-full">
              <tr className="grid grid-cols-6 border-y-2 border-solid border-black">
                <th className="col-span-2 border-r-2 border-solid border-black py-1">
                  REG #
                </th>
                <th className="col-span-4 py-1">
                  CLAIMED{" "}
                  <span className="rounded-sm bg-emerald-600 px-1 text-white">
                    YES
                  </span>
                  {"/"}
                  <span className="rounded-sm bg-[#efefef] px-1">NO</span>
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {eventWinner &&
                eventWinner.map(
                  ({ registrationNumber, price, id, isClaimed }, i) => (
                    <tr
                      key={id}
                      className="grid grid-cols-6 border-b-[.5px] border-solid border-gray-400"
                    >
                      <td className="col-span-2 grid grid-cols-5 border-r-2 border-solid border-black py-1 px-2 text-sm">
                        <p className="col-span-1">{i + 1}.</p>
                        <p className="col-span-4">{registrationNumber}</p>
                      </td>
                      {isClaimed && (
                        <td className="col-span-4 bg-emerald-600 py-1 px-2 text-center text-sm font-medium text-gray-100">
                          {price}
                        </td>
                      )}

                      {!isClaimed && (
                        <td className="relative col-span-4 bg-[#EFEFEF] py-1 px-2 text-center text-sm font-medium">
                          {price}

                          <AiFillCheckCircle
                            className="absolute top-1 right-1 z-10 cursor-pointer text-lg"
                            onClick={() => {
                              claim({ eventWinnerId: id });
                            }}
                          />
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
              className={
                "z-auto w-full border-2 border-black px-1 text-2xl font-semibold uppercase " +
                `${error ? "border-red-500" : " "}`
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setError(false);
                setPrice(event.target.value);
              }}
            />

            <h3 className="bg-slate-300 py-2 text-center text-xl font-medium">
              CONTROLS
            </h3>

            <div className="grid grid-cols-2 bg-slate-200 p-2">
              <div className="col-span-1">
                <label htmlFor="3km" className="flex items-center gap-2">
                  <input
                    id="3km"
                    type="checkbox"
                    className="accent-km3"
                    checked={filter.km3}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFilter((prevState) => {
                        return { ...prevState, km3: event.target.checked };
                      })
                    }
                  />
                  3 KM
                </label>
              </div>
              <div className="col-span-1">
                <label htmlFor="finisher" className="flex items-center gap-2">
                  <input
                    id="finisher"
                    type="checkbox"
                    checked={filter.finisher}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFilter((prevState) => {
                        return { ...prevState, finisher: event.target.checked };
                      })
                    }
                  />
                  FINISHER
                </label>
              </div>

              <div className="col-span-1">
                <label htmlFor="5km" className="flex items-center gap-2">
                  <input
                    id="5km"
                    type="checkbox"
                    className="accent-km5"
                    checked={filter.km5}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFilter((prevState) => {
                        return { ...prevState, km5: event.target.checked };
                      })
                    }
                  />
                  5 KM
                </label>
              </div>

              <div className="col-span-1">
                <label htmlFor="all" className="flex items-center gap-2">
                  <input
                    id="all"
                    type="checkbox"
                    checked={filter.all}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFilter((prevState) => {
                        return { ...prevState, all: event.target.checked };
                      })
                    }
                  />
                  INCLUDE WINNER
                </label>
              </div>
              <div className="col-span-1">
                <label htmlFor="10km" className="flex items-center gap-2">
                  <input
                    id="10km"
                    type="checkbox"
                    className="accent-km10"
                    checked={filter.km10}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFilter((prevState) => {
                        return { ...prevState, km10: event.target.checked };
                      })
                    }
                  />
                  10 KM
                </label>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex h-full items-center justify-center">
            <button
              disabled={isDrawing}
              className="z-50 flex h-5/6 w-5/6 items-center justify-center rounded-full bg-red-800 text-4xl text-white transition-all hover:bg-red-900 active:translate-y-1"
              onClick={() => {
                if (price.length === 0) {
                  setError(true);
                  return;
                }
                raffleDraw({
                  price,
                  eventId: eventData.id,
                  filter,
                });
                setTime(null);
              }}
            >
              {isDrawing ? <LoadSpinner /> : "DRAW!"}
            </button>
          </div>
        </div>
      </div>
      {visible && (
        <Fireworks
          options={{
            rocketsPoint: {
              min: 0,
              max: 100,
            },
          }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
          }}
        />
      )}
    </ScreenContainer>
  );
};

export default Raffle;
