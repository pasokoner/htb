import React, { useState } from "react";

import { api } from "../../utils/api";
import LoadSpinner from "../LoadingSpinner";
import Modal from "../Modal";
import Certificate from "../Certificate";

type Props = {
  profileId: string;
  eventId: string;
  name: string;
};

const RaceStatsCard = ({ profileId, eventId, name }: Props) => {
  const {
    data: eventProfileData,
    refetch,
    isLoading,
  } = api.participant.getEventProfile.useQuery({
    profileId: profileId,
    eventId,
  });

  const [showCertificate, setShowCertificate] = useState(false);

  if (isLoading) {
    <LoadSpinner />;
  }

  return (
    <>
      <div className="col-span-2 grid grid-cols-6 grid-rows-2 justify-center gap-2 border-2 border-solid bg-slate-300 p-2">
        <div className="col-span-6 row-span-2 flex  items-center justify-center bg-slate-400 py-2 text-base font-semibold text-white sm:col-span-1 sm:py-5 sm:text-lg">
          {name}
        </div>
        <div className="col-span-6 row-span-2 grid grid-cols-2 gap-2 sm:col-span-5">
          <div className="col-span-1">
            <p className="font-medium underline underline-offset-2">
              REGISTRATION NO.
            </p>
            <p>{eventProfileData?.registrationNumber}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium underline underline-offset-2">
              SHIRT SIZE
            </p>
            <p>{eventProfileData?.shirtSize}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium underline underline-offset-2">DISTANCE</p>
            <p>{eventProfileData?.distance} Kilometers</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium underline underline-offset-2">
              TIME FINISHED
            </p>
            {eventProfileData?.time ? (
              <p>
                {eventProfileData?.time} -{" "}
                <span
                  className="cursor-pointer rounded-md border-[1px] border-solid bg-primary-hover p-0.5 font-medium text-white hover:bg-primary"
                  onClick={() => setShowCertificate(true)}
                >
                  CERTIFICATE
                </span>
              </p>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      </div>

      {eventProfileData?.profile &&
        eventProfileData?.time &&
        showCertificate && (
          <Modal
            show={showCertificate}
            title="CONGRATULATIONS!"
            onClose={() => setShowCertificate(false)}
          >
            <div className="relative flex flex-col items-center justify-center">
              <Certificate
                eventName={eventProfileData.event.name}
                participantName={`${eventProfileData.profile.firstName} ${eventProfileData.profile.lastName}`}
                distance={eventProfileData.distance}
                time={eventProfileData.time}
              />
            </div>
          </Modal>
        )}
    </>
  );
};

export default RaceStatsCard;
