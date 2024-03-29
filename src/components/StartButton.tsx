import dayjs from "dayjs";

import { api } from "../utils/api";

import { FaPlay, FaStop } from "react-icons/fa";

type Props = {
  kilometer: "3" | "5" | "10" | "16";
  raceFinished: boolean;
  timeStart: Date | null;
  eventId: string;
  color: "km3" | "km5" | "km10" | "km16";
  refetchEvent: () => void;
};

const StartButton = ({
  kilometer,
  timeStart,
  eventId,
  raceFinished,
  refetchEvent,
  color,
}: Props) => {
  const { mutate: startRace, isLoading: starting } =
    api.event.start.useMutation({
      onSuccess: () => {
        refetchEvent();
      },
    });

  const { mutate: endRace, isLoading: ending } = api.event.end.useMutation({
    onSuccess: () => {
      refetchEvent();
    },
  });

  const updateTimeStart = (
    kilometer: "3" | "5" | "10" | "16",
    timeStart: Date,
    eventId: string
  ) => {
    startRace({ kilometer: kilometer, timeStart, eventId });
  };

  const updateRaceStatus = (
    kilometer: "3" | "5" | "10" | "16",
    eventId: string
  ) => {
    endRace({ kilometer, eventId });
  };

  let content;

  if (timeStart) {
    content = (
      <>
        <p className="text-2xl text-gray-700 sm:text-3xl">
          {dayjs(timeStart).format("hh")}
          {" : "}
          {dayjs(timeStart).format("mm")}
          {" : "}
          {dayjs(timeStart).format("ss")} {dayjs(timeStart).format("A")}
        </p>
        {raceFinished ? (
          <div
            className={`flex w-8/12 items-center justify-center gap-4 bg-${color} py-3 px-2 text-xl font-semibold text-white`}
          >
            RACE END
          </div>
        ) : (
          <button
            onClick={() => {
              updateRaceStatus(kilometer, eventId);
            }}
            className={`flex w-8/12 items-center justify-center gap-4 bg-${color} py-3 px-2 text-xl font-semibold text-white hover:opacity-80 disabled:opacity-70`}
            disabled={ending}
          >
            END RACE
            <FaStop />
          </button>
        )}
      </>
    );
  } else {
    content = (
      <>
        <p className="text-2xl text-gray-700 sm:text-3xl">-- : -- : -- --</p>
        <button
          onClick={() => {
            updateTimeStart(kilometer, new Date(), eventId);
          }}
          className={`flex w-8/12 items-center justify-center gap-4 bg-${color} py-3 px-2 text-xl font-semibold text-white hover:opacity-80 disabled:opacity-70`}
          disabled={starting}
        >
          START
          <FaPlay />
        </button>
      </>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">{content}</div>
  );
};

export default StartButton;
