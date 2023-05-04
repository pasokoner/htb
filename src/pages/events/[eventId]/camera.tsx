import { type NextPage } from "next";
import { useRouter } from "next/router";

import { useState, type ChangeEvent, useEffect } from "react";

import { type Event } from "@prisma/client";

import dayjs from "dayjs";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

import { api } from "../../../utils/api";

import LoadingSpinner from "../../../components/LoadingSpinner";
import ManualScanner from "../../../components/ManualScanner";
import Scanner from "../../../components/Scanner";
import ScreenContainer from "../../../layouts/ScreenContainer";

import { IoClose } from "react-icons/io5";
import { SlReload } from "react-icons/sl";

import { toast } from "react-hot-toast";

type ManualRecord = {
  id: string;
  registrationNumber: number;
  timeFinished: Date;
  eventId: string;
};

type ScanRecord = {
  participantId: string;
  timeFinished: Date;
  id: string;
};

type SavedRecord = Partial<ManualRecord & ScanRecord>;

type SavedErrorRecord = SavedRecord & { error?: boolean };

const Camera: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const [ongoingRequest, setOngoingRequest] = useState("");

  const { data: eventData, isLoading } = api.event.details.useQuery(
    {
      eventId: eventId as string,
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 15000,
    }
  );

  const { mutate: cameraCheck } = api.scan.cameraCheck.useMutation({
    onSuccess: () => {
      toast.success("Participant successfully added!");

      setSavedRecords((prevState) => {
        return [...prevState.slice(1)];
      });

      setOngoingRequest(uuidv4());
    },
    onError: (e) => {
      if (e.shape) {
        toast.error(e.shape.message);
      } else {
        toast.error("Some error has occured!");
      }

      setSavedRecords((prevState) => {
        const errorRecord = prevState.shift();

        if (errorRecord) {
          setErrorRecords((prevState) => [
            ...prevState,
            { ...errorRecord, error: true },
          ]);
        }

        return [...prevState.slice(1)];
      });

      setOngoingRequest(uuidv4());
    },
  });

  const { mutate: manualCheck } = api.scan.manualCheck.useMutation({
    onSuccess: () => {
      toast.success("Participant successfully added!");

      setSavedRecords((prevState) => {
        return [...prevState.slice(1)];
      });

      setOngoingRequest(uuidv4());
    },
    onError: (e) => {
      if (e.shape) {
        toast.error(e.shape.message);
      } else {
        toast.error("Some error has occured!");
      }

      setSavedRecords((prevState) => {
        const errorRecord = prevState.shift();

        if (errorRecord) {
          setErrorRecords((prevState) => [
            ...prevState,
            { ...errorRecord, error: true },
          ]);
        }

        return [...prevState.slice(1)];
      });

      setOngoingRequest(uuidv4());
    },
  });

  const [savedRecords, setSavedRecords] = useLocalStorage<SavedRecord[]>(
    "saved-records",
    []
  );

  const [errorRecords, setErrorRecords] = useLocalStorage<SavedErrorRecord[]>(
    "error-records",
    []
  );

  const [cameraPassword, setCameraPassword] = useLocalStorage(
    "camera-password",
    ""
  );

  const cameraUpdate = (cameraResult: string, timeFinished: Date) => {
    // mutate({ kilometerId: cameraResultF[1], timeFinished });
    setSavedRecords([
      ...savedRecords,
      {
        participantId: cameraResult,
        timeFinished,
        id: uuidv4(),
      },
    ]);
    setOngoingRequest(uuidv4());
  };

  const manualUpdate = (
    query: string,
    timeFinished: Date,
    eventData: Event
  ) => {
    setSavedRecords([
      ...savedRecords,
      {
        registrationNumber: parseInt(query),
        timeFinished,
        eventId: eventData.id,
        id: uuidv4(),
      },
    ]);
    setOngoingRequest(uuidv4());
  };

  useEffect(() => {
    if (
      savedRecords.length !== 0 &&
      eventData &&
      cameraPassword === eventData.cameraPassword
    ) {
      if (savedRecords[0] && savedRecords[0].registrationNumber) {
        const data = savedRecords[0] as ManualRecord;
        manualCheck({
          timeFinished: new Date(data.timeFinished),
          eventId: data.eventId,
          registrationNumber: data.registrationNumber,
        });
      } else {
        const data = savedRecords[0] as ScanRecord;
        cameraCheck({
          timeFinished: new Date(data.timeFinished),
          participantId: data.participantId,
        });
      }
    }
  }, [ongoingRequest, cameraPassword]);

  if (isLoading) {
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
          <label htmlFor="cameraPassword">CAMERA PASSWORD</label>
          <input
            type="text"
            id="cameraPassword"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCameraPassword(e.target.value);
            }}
          />
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="pt-6">
      <div className="mb-4 grid grid-cols-6 gap-3 text-sm">
        <h3 className="col-span-3 font-semibold sm:col-span-2">
          <span className="rounded-md bg-km3 p-1 text-white sm:p-2">3KM</span> -{" "}
          {eventData.timeStart3km && eventData.raceFinished3km && "FINISHED"}
          {eventData.timeStart3km && !eventData.raceFinished3km && "ONGOING"}
          {!eventData.timeStart3km && "STANDBY"}
        </h3>
        <h3 className="col-span-3 font-semibold sm:col-span-2">
          <span className="rounded-md bg-km5 p-1 text-white sm:p-2">5KM</span> -{" "}
          {eventData.timeStart5km && eventData.raceFinished5km && "FINISHED"}
          {eventData.timeStart5km && !eventData.raceFinished5km && "ONGOING"}
          {!eventData.timeStart5km && "STANDBY"}
        </h3>
        <h3 className="col-span-3 font-semibold sm:col-span-2">
          <span className="rounded-md bg-km10 p-1 text-white sm:p-2">10KM</span>{" "}
          -{" "}
          {eventData.timeStart10km && eventData.raceFinished10km && "FINISHED"}
          {eventData.timeStart10km && !eventData.raceFinished10km && "ONGOING"}
          {!eventData.timeStart10km && "STANDBY"}
        </h3>
      </div>

      <Scanner updateParticipant={cameraUpdate} />
      <ManualScanner manualUpdate={manualUpdate} eventData={eventData} />

      {savedRecords &&
        savedRecords
          .reverse()
          .map(({ participantId, timeFinished, id, registrationNumber }) => {
            return (
              <div
                key={id}
                className="mt-4 grid w-full grid-cols-4 border-b-2 border-black pb-2 text-sm"
              >
                <p className="col-span-3">
                  <span className="font-semibold">Participant ID: </span>
                  {participantId ? participantId : registrationNumber}
                </p>
                <div className="col-span-1 row-span-2 ml-auto mr-2 flex flex-col items-center justify-center">
                  <IoClose
                    className="cursor-pointer text-2xl hover:text-slate-600"
                    onClick={() => {
                      setSavedRecords((prevState) =>
                        prevState.filter(({ id: idC }) => id !== idC)
                      );
                      setOngoingRequest(uuidv4());
                    }}
                  />
                </div>
                <p className="col-span-3">
                  <span className="font-semibold">Finished Time: </span>
                  {dayjs(timeFinished).format("hh")}
                  {" : "}
                  {dayjs(timeFinished).format("mm")}
                  {" : "}
                  {dayjs(timeFinished).format("ss")}{" "}
                  {dayjs(timeFinished).format("A")}
                </p>
              </div>
            );
          })}

      {errorRecords &&
        errorRecords.map((record) => {
          const { registrationNumber, timeFinished, id, error, participantId } =
            record;
          const errorStyle = "border-red-400 bg-red-100 px-4 py-3 text-red-700";

          return (
            <div
              key={id}
              className={`${
                error ? errorStyle : ""
              } mt-4 grid w-full grid-cols-4 border-b-2 border-black pb-2 text-sm`}
            >
              <p className="col-span-3">
                <span className="font-semibold">Participant ID: </span>
                {participantId ? participantId : registrationNumber}
              </p>
              <div className="col-span-1 row-span-2 ml-auto mr-2 flex items-center justify-center gap-3">
                <SlReload
                  className="cursor-pointer text-2xl hover:text-slate-600"
                  onClick={() => {
                    setErrorRecords((prevState) =>
                      prevState.filter(({ id: idC }) => record.id !== idC)
                    );
                    setSavedRecords((prevState) => [
                      ...prevState,
                      { ...record, error: false },
                    ]);
                    setOngoingRequest(uuidv4());
                  }}
                />
                <IoClose
                  className="cursor-pointer text-2xl hover:text-slate-600"
                  onClick={() => {
                    setErrorRecords(
                      errorRecords.filter(({ id: idC }) => record.id !== idC)
                    );
                    // setSavedRecords((prevState) => [...prevState, record]);
                    // setOngoingRequest(uuidv4());
                  }}
                />
              </div>
              <p className="col-span-3">
                <span className="font-semibold">Finished Time: </span>
                {dayjs(timeFinished).format("hh")}
                {" : "}
                {dayjs(timeFinished).format("mm")}
                {" : "}
                {dayjs(timeFinished).format("ss")}{" "}
                {dayjs(timeFinished).format("A")}
              </p>
            </div>
          );
        })}

      <div className="py-4"></div>
    </ScreenContainer>
  );
};

export default Camera;
