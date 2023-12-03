import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { type EventParticipant } from "@prisma/client";

import { api } from "../../../utils/api";

import LoadingSpinner from "../../../components/LoadingSpinner";
import ScreenContainer from "../../../layouts/ScreenContainer";

import StartButton from "../../../components/StartButton";

import { GoPrimitiveDot } from "react-icons/go";
import { GiCheckeredFlag } from "react-icons/gi";

const SingeEvent: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;
  const { data: sessionData } = useSession();

  const {
    data: eventData,
    isLoading,
    refetch,
  } = api.event.fullDetails.useQuery({
    eventId: eventId as string,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!eventData) {
    return (
      <ScreenContainer>
        <div className="mx-auto pt-20">
          <p className="text-3xl">Event not found!</p>
        </div>
      </ScreenContainer>
    );
  }

  const refetchEvent = async () => {
    await refetch();
  };

  const filterParticipants = (
    distanceF: number,
    kilometer: EventParticipant[]
  ) => {
    const filteredParticipants = kilometer.filter(({ distance }) => {
      return distance === distanceF;
    });

    return filteredParticipants.length;
  };

  return (
    <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
      <div className="mb-2 grid grid-cols-6 text-xs sm:text-sm">
        <Link
          href={`/events/${eventData.id}/camera`}
          className="col-span-2 flex items-center justify-center border-2 border-dotted border-slate-400 py-2 font-semibold"
        >
          CAMERA
        </Link>

        {sessionData?.user.role === "ADMIN" && (
          <Link
            href={`/events/${eventData.id}/raffle`}
            className="col-span-2 flex items-center justify-center  border-2 border-dotted border-slate-400 py-2 font-semibold"
          >
            RAFFLE
          </Link>
        )}

        {sessionData?.user.role === "SUPERADMIN" && (
          <Link
            href={`/events/${eventData.id}/config`}
            className="col-span-2 flex items-center justify-center  border-2 border-dotted border-slate-400 py-2 font-semibold"
          >
            CONFIGURATION
          </Link>
        )}
        <Link
          href={`/events/${eventData.id}/list`}
          className="col-span-2 flex items-center justify-center border-2  border-dotted border-slate-400 py-2 font-semibold"
        >
          PARTICIPANTS LIST
        </Link>
      </div>

      <div className="mx-auto grid grid-cols-6 gap-4">
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md border-2 border-km3 font-semibold text-black md:col-span-3">
          <h2 className="flex w-full justify-center rounded-t-sm bg-km3 py-2 text-4xl text-white">
            3 KM
          </h2>
          {/* <CustomClock /> */}

          <StartButton
            kilometer="3"
            timeStart={eventData?.timeStart3km}
            eventId={eventData.id}
            raceFinished={eventData.raceFinished3km}
            /* eslint-disable @typescript-eslint/no-misused-promises */
            refetchEvent={refetchEvent}
            color="km3"
          />

          {eventData.timeStart3km && (
            <Link
              href={`/events/${eventData.id}/finisher`}
              className="flex w-full justify-center"
            >
              <div className="w-8/12 border-2 border-dashed border-white text-xl font-semibold">
                {eventData.raceFinished3km ? (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km3 py-2 text-km3">
                    CHECK STATUS <GiCheckeredFlag className="text-4xl" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km3 py-2 text-km3">
                    LIVE FEED{" "}
                    <GoPrimitiveDot className="text-4xl text-red-700" />
                  </div>
                )}
              </div>
            </Link>
          )}

          <div className="mt-6 w-full border-b-2 border-double border-b-slate-100"></div>
          <div>
            <p className="mb-1 text-center text-xl font-medium text-gray-700">
              Registered Participants
            </p>
            <p className="text-center text-xl font-medium text-gray-700">
              {filterParticipants(3, eventData.eventParticipant)}
            </p>
          </div>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md border-2 border-km5 font-semibold text-white md:col-span-3">
          <h2 className="flex w-full justify-center rounded-t-sm bg-km5 py-2 text-4xl text-white">
            5 KM
          </h2>
          {/* <CustomClock /> */}
          <StartButton
            kilometer="5"
            timeStart={eventData?.timeStart5km}
            eventId={eventData.id}
            raceFinished={eventData.raceFinished5km}
            /* eslint-disable @typescript-eslint/no-misused-promises */
            refetchEvent={refetchEvent}
            color="km5"
          />

          {eventData.timeStart5km && (
            <Link
              href={`/events/${eventData.id}/finisher`}
              className="flex w-full justify-center"
            >
              <div className="w-8/12 border-2 border-dashed border-white text-xl font-semibold">
                {eventData.raceFinished5km ? (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km5 py-2 text-km5">
                    CHECK STATUS <GiCheckeredFlag className="text-4xl" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km5 py-2 text-km5">
                    LIVE FEED{" "}
                    <GoPrimitiveDot className="text-4xl text-red-700" />
                  </div>
                )}
              </div>
            </Link>
          )}
          <div className="mt-6 w-full border-b-2 border-double border-b-slate-100"></div>
          <div>
            <p className="mb-1 text-center text-xl font-medium text-gray-700">
              Registered Participants
            </p>
            <p className="text-center text-xl font-medium text-gray-700">
              {filterParticipants(5, eventData.eventParticipant)}
            </p>
          </div>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md border-2 border-km10 font-semibold text-white md:col-span-3">
          <h2 className="flex w-full justify-center rounded-t-sm bg-km10 py-2 text-4xl text-white">
            10 KM
          </h2>
          {/* <CustomClock /> */}
          <StartButton
            kilometer="10"
            timeStart={eventData?.timeStart10km}
            eventId={eventData.id}
            raceFinished={eventData.raceFinished10km}
            /* eslint-disable @typescript-eslint/no-misused-promises */
            refetchEvent={refetchEvent}
            color="km10"
          />

          {eventData.timeStart10km && (
            <Link
              href={`/events/${eventData.id}/finisher`}
              className="flex w-full justify-center"
            >
              <div className="w-8/12 border-2 border-dashed border-white text-xl font-semibold">
                {eventData.raceFinished10km ? (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km10 py-2 text-km10">
                    CHECK STATUS <GiCheckeredFlag className="text-4xl" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km10 py-2 text-km10">
                    LIVE FEED{" "}
                    <GoPrimitiveDot className="text-4xl text-red-700" />
                  </div>
                )}
              </div>
            </Link>
          )}
          <div className="mt-6 w-full border-b-2 border-double border-b-slate-100"></div>
          <div>
            <p className="mb-1 text-center text-xl font-medium text-gray-700">
              Registered Participants
            </p>
            <p className="text-center text-xl font-medium text-gray-700">
              {filterParticipants(10, eventData.eventParticipant)}
            </p>
          </div>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md border-2 border-km16 font-semibold text-white md:col-span-3">
          <h2 className="flex w-full justify-center rounded-t-sm bg-km16 py-2 text-4xl text-white">
            16 KM
          </h2>
          {/* <CustomClock /> */}
          <StartButton
            kilometer="16"
            timeStart={eventData?.timeStart16km}
            eventId={eventData.id}
            raceFinished={eventData.raceFinished16km}
            /* eslint-disable @typescript-eslint/no-misused-promises */
            refetchEvent={refetchEvent}
            color="km16"
          />

          {eventData.timeStart16km && (
            <Link
              href={`/events/${eventData.id}/finisher`}
              className="flex w-full justify-center"
            >
              <div className="w-8/12 border-2 border-dashed border-white text-xl font-semibold">
                {eventData.raceFinished16km ? (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km16 py-2 text-km16">
                    CHECK STATUS <GiCheckeredFlag className="text-4xl" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 border-[1px] border-km16 py-2 text-km16">
                    LIVE FEED{" "}
                    <GoPrimitiveDot className="text-4xl text-red-700" />
                  </div>
                )}
              </div>
            </Link>
          )}
          <div className="mt-6 w-full border-b-2 border-double border-b-slate-100"></div>
          <div>
            <p className="mb-1 text-center text-xl font-medium text-gray-700">
              Registered Participants
            </p>
            <p className="text-center text-xl font-medium text-gray-700">
              {filterParticipants(16, eventData.eventParticipant)}
            </p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default SingeEvent;
import { type GetServerSideProps } from "next";

import { getSession, useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") {
    return {
      props: { session },
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
