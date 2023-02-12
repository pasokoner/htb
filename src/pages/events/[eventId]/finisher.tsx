import { type NextPage } from "next";

import React, { useState, useRef, useEffect } from "react";

import { useRouter } from "next/router";

import { api } from "../../../utils/api";

import { useInView } from "react-intersection-observer";
import { useLocalStorage } from "usehooks-ts";

import LoadingSpinner from "../../../components/LoadingSpinner";
import ScreenContainer from "../../../layouts/ScreenContainer";

import ExportFinisher from "../../../components/ExportFinisher";
import { getFinishedTime } from "../../../utils/convertion";

const Finished: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { ref, inView } = useInView();

  const [distance, setDistance] = useState(10);
  const tableRef = useRef<HTMLTableElement>(null);
  const [cameraPassword, setCameraPassword] = useLocalStorage(
    "camera-password",
    ""
  );

  const {
    data: raceData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = api.participant.getFinishersBatch.useInfiniteQuery(
    {
      eventId: eventId as string,
      distance: distance,
      limit: 20,
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
        refetchInterval: 60000,
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
          <label htmlFor="cameraPassword">FINISHERS PASSWORD</label>
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
      <h2 className="mb-2 text-2xl font-semibold">{distance} KM FINISHERS</h2>

      <div className="mb-2 grid w-full grid-cols-6 gap-2 text-sm md:w-6/12">
        <button
          onClick={() => setDistance(3)}
          className="col-span-3 flex items-center justify-center rounded-sm border-2 border-black bg-km3 py-2 font-bold text-white hover:bg-opacity-95 md:col-span-2"
        >
          3 KM
        </button>
        <button
          onClick={() => setDistance(5)}
          className="col-span-3 flex items-center justify-center rounded-sm border-2 border-black bg-km5 py-2 font-bold text-white hover:bg-opacity-95 md:col-span-2"
        >
          5 KM
        </button>
        <button
          onClick={() => setDistance(10)}
          className="col-span-6 flex items-center justify-center rounded-sm  border-2 border-black bg-km10 py-2 font-bold text-white hover:bg-opacity-95 md:col-span-2"
        >
          10 KM
        </button>
      </div>

      <div className="flex w-full">
        <div className="flex items-center justify-center rounded-sm border-2 bg-black py-1 px-2 text-2xl font-semibold text-white">
          FINISHERS: {raceData?.pages[0]?.finishersCount}
        </div>
        {/* <button
          onClick={exportToExcel}
          className="ml-auto rounded-sm border-2 bg-emerald-400 py-1 px-2 text-xl font-semibold text-white"
        >
          EXPORT
        </button> */}
        <ExportFinisher
          distance={distance}
          eventId={eventData.id}
          eventData={eventData}
          className="ml-auto rounded-sm border-2 bg-emerald-400 py-1 px-2 text-xl font-semibold text-white"
        />
      </div>

      <table className="w-full" ref={tableRef}>
        <thead className="w-full">
          <tr className="grid grid-cols-6 rounded-t-md bg-primary-hover text-white">
            <th className="col-span-1 py-1">RANKING</th>
            <th className="col-span-3 py-1">NAME</th>
            <th className="col-span-2 py-1">TIME</th>
          </tr>
        </thead>
        <tbody>
          {raceData?.pages &&
            raceData?.pages.map(({ finishers }, pageIndex) => {
              return finishers.map(
                ({ id, timeFinished, registrationNumber, profile }, index) => {
                  let timeStart: Date | null = null;

                  if (distance === 3) {
                    timeStart = eventData.timeStart3km;
                  }

                  if (distance === 5) {
                    timeStart = eventData.timeStart5km;
                  }

                  if (distance === 10) {
                    timeStart = eventData.timeStart10km;
                  }

                  const time = getFinishedTime(
                    timeFinished as Date,
                    timeStart as Date
                  );

                  const rankers =
                    index < 10 && pageIndex === 0
                      ? " bg-yellow-400 font-medium"
                      : "";

                  return (
                    <tr
                      key={id}
                      className={
                        "grid grid-cols-6 border-2 border-r-2 border-solid text-xs md:text-lg" +
                        rankers
                      }
                    >
                      <td className="col-span-1 flex items-center justify-between border-r-2 p-2 ">
                        {index + 1 + pageIndex * 20}
                      </td>
                      <td className="col-span-3 flex items-center justify-between border-r-2 p-2">
                        {registrationNumber} - {profile.firstName}{" "}
                        {profile.lastName}
                      </td>
                      <td className="col-span-2 flex items-center justify-between p-2 ">
                        {time}
                      </td>
                    </tr>
                  );
                }
              );
            })}

          <span style={{ visibility: "hidden" }} ref={ref}>
            intersection observer marker
          </span>
        </tbody>
      </table>

      {isFetchingNextPage ? <LoadingSpinner /> : null}
    </ScreenContainer>
  );
};

export default Finished;
