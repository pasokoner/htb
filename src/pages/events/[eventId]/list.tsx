import { type NextPage } from "next";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { api } from "../../../utils/api";

import { useLocalStorage } from "usehooks-ts";

import EditName from "../../../components/EditName";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ScreenContainer from "../../../layouts/ScreenContainer";

import { RiLoader5Fill } from "react-icons/ri";
import ExportList from "../../../components/ExportList";

import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";

const List: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { ref, inView } = useInView();

  const { data: sessionData } = useSession();

  const [listQuery, setListQuery] = useState<{
    registrationNumber: number | null;
    name: string | null;
  } | null>(null);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [cameraPassword, setCameraPassword] = useLocalStorage(
    "camera-password",
    ""
  );

  const {
    data: registrants,
    isLoading,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = api.participant.getByQuery.useInfiniteQuery(
    {
      eventId: eventId as string,
      registrationNumber: listQuery?.registrationNumber
        ? listQuery?.registrationNumber
        : undefined,
      name: listQuery?.name ? listQuery?.name : undefined,
      limit: 20,
      distance: distance,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { data: eventData, isLoading: eventLoading } =
    api.event.details.useQuery(
      {
        eventId: eventId as string,
      },
      {
        refetchOnWindowFocus: false,
        refetchInterval: 15000,
      }
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchNextPage();
    }
  }, [inView]);

  if (eventLoading) {
    return <LoadingSpinner />;
  }

  if (!eventData) {
    return (
      <ScreenContainer className="py-6">
        <div className="mx-auto pt-20">
          <p className="text-3xl">Event not found!</p>
        </div>
      </ScreenContainer>
    );
  }

  if (cameraPassword !== eventData.cameraPassword) {
    return (
      <ScreenContainer className="py-6">
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <label htmlFor="cameraPassword">LIST PASSWORD</label>
          <input
            type="text"
            id="cameraPassword"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCameraPassword(e.target.value);
            }}
          />
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="py-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="mb-2">
            <label htmlFor="maxItems" className="mr-4">
              Distance
            </label>
            <select
              id="maxItems"
              value={distance}
              onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                if (e.currentTarget.value === "") {
                  setDistance(undefined);
                  return;
                }

                setDistance(parseInt(e.currentTarget.value));
              }}
            >
              <option value={""}>ALL</option>
              {[3, 5, 10].map((distance) => (
                <option key={distance} value={distance}>
                  {distance}
                </option>
              ))}
            </select>
          </div>

          <ExportList
            timeStart10km={eventData.timeStart10km}
            timeStart5km={eventData.timeStart5km}
            timeStart3km={eventData.timeStart3km}
            distance={distance}
            eventId={eventId as string}
            className="rounded-sm bg-primary py-1.5 px-2 font-medium text-white hover:bg-primary-hover md:py-2"
          />
        </div>
        <input
          placeholder="Search by name or registration #"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            if (isNaN(parseInt(e.currentTarget.value))) {
              setListQuery({
                registrationNumber: null,
                name: e.currentTarget.value,
              });
              return;
            }

            setListQuery({
              registrationNumber: parseInt(e.currentTarget.value),
              name: null,
            });
          }}
          className="mb-2 w-full"
        />
        <div className="grid grid-cols-6 bg-primary text-lg font-semibold text-white">
          <p className="col-span-2 border-r-2 border-white p-2 md:col-span-1">
            NO. & KM
          </p>
          <p className="col-span-4 p-2 md:col-span-5">NAME</p>
        </div>
        {isLoading && (
          <RiLoader5Fill className="mx-auto mt-6 animate-spin text-center text-5xl" />
        )}
        {registrants?.pages &&
          registrants.pages.map(({ registrants }) => {
            return registrants.map(
              ({ profile, registrationNumber, id, distance }) => (
                <div
                  key={id}
                  className="grid grid-cols-6 border-2 border-r-2 border-solid text-xs md:text-sm"
                >
                  <div className="col-span-2 flex items-center justify-between border-r-2 p-2 md:col-span-1">
                    <p>
                      {registrationNumber} - {distance} KM
                    </p>
                  </div>
                  <div className="col-span-4 flex items-center justify-between p-2 md:col-span-5">
                    <p>
                      {profile.firstName} {profile.lastName}
                    </p>
                    {sessionData?.user.role === "SUPERADMIN" && (
                      <EditName
                        participantId={id}
                        registrationNumber={registrationNumber}
                        firstName={profile.firstName}
                        lastName={profile.lastName}
                        refetchFn={() => {
                          void refetch();
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            );
          })}

        <span style={{ visibility: "hidden" }} ref={ref}>
          intersection observer marker
        </span>
        {isFetchingNextPage ? <LoadingSpinner /> : null}
      </div>
    </ScreenContainer>
  );
};

export default List;

import { type GetServerSideProps } from "next";

import { getSession } from "next-auth/react";

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
