import Image from "next/image";
import React, { useContext, useState } from "react";

import { ImLocation } from "react-icons/im";

import { JoinContext } from "../context/join";

import dayjs from "dayjs";
import { api } from "../utils/api";
import { GoPrimitiveDot } from "react-icons/go";
import JoinEvent from "./JoinEvent";

type Props = {
  name: string;
  scheduleTime: Date;
  numOfParticipants: number;
  address: string;
  profileId?: string;
  eventId: string;
  closeRegistration?: boolean;
  ended?: boolean;
  ongoing?: boolean;
  registrationNumber?: number;
};

const EventCard = ({
  name,
  scheduleTime,
  numOfParticipants,
  address,
  profileId,
  eventId,
  closeRegistration,
  ended,
  ongoing,
}: Props) => {
  const {
    data: eventProfileData,
    refetch,
    isLoading,
  } = api.participant.getEventProfile.useQuery({
    profileId,
    eventId,
  });

  const { toggleJoin } = useContext(JoinContext);

  const [showJoin, setShowJoin] = useState(false);

  if (isLoading && profileId) {
    return <></>;
  }

  return (
    <div className="rounded-md border-2 border-slate-200">
      <div className="relative h-40">
        {eventProfileData?.registrationNumber && (
          <div className="absolute top-0 right-0 z-10 rounded-md border-2 border-black bg-black px-2 text-lg font-medium text-white">
            {eventProfileData.distance}KM -{" "}
            {eventProfileData.registrationNumber}
          </div>
        )}
        <div className="absolute bottom-2 left-2 z-10 rounded-md border-2 border-gray-400 bg-gray-200 p-1 text-xs font-semibold text-slate-600 opacity-90">
          {!closeRegistration && (
            <div className="flex items-center gap-1 text-xs">
              REGISTRATION - LIVE{" "}
              <GoPrimitiveDot className="text-emerald-600" />
            </div>
          )}
          {closeRegistration && !ongoing && (
            <div className="flex items-center gap-1 text-xs">
              REGISTRATION - ENDED
              <GoPrimitiveDot className="text-red-600" />
            </div>
          )}

          {closeRegistration && !ended && ongoing && (
            <div className="flex items-center gap-1 text-xs">
              EVENT ONGOING
              <GoPrimitiveDot className="text-orange-600" />
            </div>
          )}

          {closeRegistration && ended && ongoing && (
            <div className="flex items-center gap-1 text-xs">
              EVENT ENDED
              <GoPrimitiveDot className="text-gray-600" />
            </div>
          )}
        </div>

        <Image
          src={`/event-image/${name.toLocaleLowerCase()}.webp`}
          alt=""
          fill
          className="object-fill"
        />
      </div>

      <div className="mb-6 flex w-full flex-col items-center">
        <h3 className="py-6 text-lg">{name} Leg</h3>

        <div className="flex items-center gap-1 text-xs">
          <ImLocation className="inline text-red-700" /> {address}
        </div>
        <p className="text-xs">
          {dayjs(scheduleTime).format("dddd")},{" "}
          {dayjs(scheduleTime).format("MMMM")}{" "}
          {dayjs(scheduleTime).format("DD")}{" "}
          <span className="font-black">&#183; </span>
          {dayjs(scheduleTime).format("h")}
          {" : "}
          {dayjs(scheduleTime).format("mm")} {dayjs(scheduleTime).format("A")}{" "}
        </p>
        <p className="text-xs">Registered participants - {numOfParticipants}</p>
      </div>

      {eventProfileData?.timeFinished && (
        <a className="mb-2 block cursor-pointer text-center text-sm text-primary underline hover:text-primary-hover">
          CLAIM CERTIFICATE
        </a>
      )}

      {!profileId && !closeRegistration && (
        <button
          className="w-full rounded-b-md bg-primary py-2 uppercase text-white hover:bg-primary-hover active:bg-primary-hover"
          onClick={() => toggleJoin()}
        >
          REGISTER
        </button>
      )}

      {closeRegistration && (
        <button
          disabled
          className="w-full rounded-b-md bg-primary py-2 uppercase text-white hover:bg-primary-hover active:bg-primary-hover disabled:bg-gray-400 disabled:text-gray-700"
        >
          CLOSED
        </button>
      )}

      {profileId && !eventProfileData && !closeRegistration && (
        <button
          className="w-full rounded-b-md bg-primary py-2 uppercase text-white hover:bg-primary-hover active:bg-primary-hover"
          onClick={() => setShowJoin(true)}
        >
          JOIN
        </button>
      )}

      {profileId && eventProfileData && !closeRegistration && (
        <button
          className="w-full rounded-b-md bg-primary py-2 uppercase text-white hover:bg-primary-hover active:bg-primary-hover"
          onClick={() => setShowJoin(true)}
        >
          EDIT
        </button>
      )}

      <JoinEvent
        shirtSize={eventProfileData?.shirtSize}
        distance={eventProfileData?.distance}
        profileId={profileId as string}
        eventId={eventId}
        show={showJoin}
        showControl={() => setShowJoin(false)}
        onSuccess={() => {
          void refetch();
          setShowJoin(false);
        }}
        registrationNumber={eventProfileData?.registrationNumber}
      />
    </div>
  );
};

export default EventCard;
