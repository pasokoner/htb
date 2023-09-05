import { type NextPage, type GetServerSideProps } from "next";

import { getSession, useSession } from "next-auth/react";

import React from "react";
import ScreenContainer from "../../layouts/ScreenContainer";
import { api } from "../../utils/api";
import EventCard from "../../components/EventCard";

const Edit: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: eventsData, isLoading } = api.event.getAll.useQuery();

  if (isLoading) {
    return (
      <ScreenContainer>
        <div className="pt-6">
          <div className="grid grid-cols-6 gap-4 pt-6">
            <div className="col-span-6 w-full animate-pulse rounded-md border border-slate-400 p-4 shadow sm:col-span-3 lg:col-span-2">
              <div className="">
                <div className="mb-2 h-36 rounded-md border-2 border-slate-400"></div>
                <div className="mb-2 space-y-6 py-1">
                  <div className="h-2 rounded bg-slate-400"></div>
                  <div className="h-2 rounded bg-slate-400"></div>
                  <div className="h-2 rounded bg-slate-400"></div>
                </div>
                <div className="h-14 rounded-md bg-slate-200 py-4"></div>
              </div>
            </div>

            <div className="col-span-6 w-full animate-pulse rounded-md border border-slate-300 p-4 shadow sm:col-span-3 lg:col-span-2">
              <div className="">
                <div className="mb-2 h-36 rounded-md border-2 border-slate-300"></div>
                <div className="mb-2 space-y-6 py-1">
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                </div>
                <div className="h-14 rounded-md bg-slate-200 py-4"></div>
              </div>
            </div>

            <div className="col-span-6 w-full animate-pulse rounded-md border border-slate-300 p-4 shadow sm:col-span-3 lg:col-span-2">
              <div className="">
                <div className="mb-2 h-36 rounded-md border-2 border-slate-300"></div>
                <div className="mb-2 space-y-6 py-1">
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                </div>
                <div className="h-14 rounded-md bg-slate-200 py-4"></div>
              </div>
            </div>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="py-6">
      <h3 className="mx-auto mb-6 max-w-4xl text-2xl font-medium text-gray-600">
        ALL EVENTS
      </h3>
      <div className="mx-auto grid max-w-4xl grid-cols-6 gap-4">
        {eventsData
          ?.filter(({ id }) => {
            if (sessionData?.user.role === "SUPERADMIN") {
              return true;
            }

            return id !== "cle7ygs6x0000f1fgbhvoa9ap";
            // return true;
          })
          .map(
            ({
              id,
              name,
              address,
              _count,
              scheduleTime,
              closeRegistration,
              timeStart10km,
              timeStart3km,
              timeStart5km,
              raceFinished10km,
              raceFinished3km,
              raceFinished5km,
              enableEdit,
              shirtLimit,
              reserve,
            }) => (
              <div
                className="col-span-6 w-full sm:col-span-3 lg:col-span-2"
                key={id}
              >
                <EventCard
                  eventId={id}
                  profileId={sessionData?.user.profileId}
                  name={name}
                  address={address}
                  numOfParticipants={_count.eventParticipant + reserve}
                  scheduleTime={scheduleTime}
                  closeRegistration={
                    closeRegistration ||
                    _count.eventParticipant + reserve >= (shirtLimit as number)
                  }
                  ongoing={!!(timeStart10km || timeStart5km || timeStart3km)}
                  ended={
                    !!(raceFinished10km && raceFinished3km && raceFinished5km)
                  }
                  enableEdit={enableEdit}
                />
              </div>
            )
          )}

        <div className="col-span-6 w-full sm:col-span-3 lg:col-span-2">
          <EventCard
            address="Brgy. Mabuco, Hermosa Bataan"
            name="Hermosa"
            numOfParticipants={3300}
            scheduleTime={new Date("2023-01-28T20:00:00.000Z")}
            eventId={"1"}
            closeRegistration={true}
            ongoing={true}
            ended={true}
          />
        </div>
      </div>
    </ScreenContainer>
  );
};

export default Edit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if ((session && !session.user.profileId) || session?.user?.unclaimed) {
    return {
      redirect: {
        destination: "/profile/setup",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
