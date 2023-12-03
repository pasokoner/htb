import { ShirtSize } from "@prisma/client";
import React, { useState } from "react";
import Modal from "./Modal";
import { api } from "../utils/api";

import { useForm, type SubmitHandler } from "react-hook-form";

import LoadingSpinner from "./LoadingSpinner";
import QrMaker from "./QrMaker";
import { AiOutlineInfo } from "react-icons/ai";

type Props = {
  shirtSize?: ShirtSize;
  profileId: string;
  eventId: string;
  distance?: number;
  show?: boolean;
  showControl: () => void;
  onSuccess?: () => void;
  registrationNumber?: number;
  enableEdit: boolean;
  shirtLimit: number;
  noTshirt: boolean;
  eventParticipantId: string | null | undefined;
};

const JoinEventWithLimit = ({
  distance,
  profileId,
  eventId,
  shirtSize,
  onSuccess,
  show,
  showControl,
  registrationNumber,
  shirtLimit,
  noTshirt,
  eventParticipantId,
}: Props) => {
  const { mutate: join, isLoading: isJoining } =
    api.participant.joinWithLimit.useMutation({
      onSuccess: () => {
        setError("");
        if (onSuccess) onSuccess();
      },
      onError: (e) => {
        console.log(e.message);
        if (e.message.includes("constraint")) {
          setError(
            "Seems like there is an error, try pressing the join button again"
          );
        } else if (e.message.includes("Limit")) {
          setError(e.message);
        } else {
          setError(
            "Seems like there is an error, try pressing the join button again"
          );
        }
      },
    });

  const { data: km3Limit } = api.event.getLimitByDistance.useQuery({
    eventId,
    distance: 3,
  });

  const { data: km5Limit } = api.event.getLimitByDistance.useQuery({
    eventId,
    distance: 5,
  });

  const { data: km10Limit } = api.event.getLimitByDistance.useQuery({
    eventId,
    distance: 10,
  });

  const { data: km16Limit } = api.event.getLimitByDistance.useQuery({
    eventId,
    distance: 16,
  });

  const [showAgreement, setShowAgreement] = useState(false);
  const [acceptAgreement, setAcceptAgreement] = useState(false);

  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm<{
    shirtSize: ShirtSize;
    distance: string;
  }>();

  const onSubmit: SubmitHandler<{ shirtSize: ShirtSize; distance: string }> = (
    data
  ) => {
    if (data) {
      join({
        profileId: profileId,
        eventId: eventId,
        ...data,
        distance: parseInt(data.distance),
      });
    }
  };

  let content = <></>;

  if (!!km3Limit || !!km5Limit || km10Limit || km16Limit) {
    return true;
  }

  if (distance && shirtSize && eventParticipantId) {
    /* eslint-disable @typescript-eslint/no-misused-promises */
    content = (
      <div className="w-full sm:min-w-[450px]">
        <div className="mb-2 flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="font-semibold">Shirt Size</div>
              <div>{shirtSize}</div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="font-semibold">Distance</div>
              <div>{distance} Kilometers</div>
            </div>
          </div>

          <QrMaker value={eventParticipantId} size={5} />
        </div>
        <div className="rounded-md bg-blue-200 p-2">
          <div className="flex gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300 p-1">
                  <AiOutlineInfo className="h-6 w-6" />
                </div>
                Hello Hataw Takbo Participant!
              </div>
              <p className="pl-2 font-semibold"></p>
              {noTshirt && (
                <p className="pl-2 text-justify text-xs sm:text-sm">
                  <span className="font-semibold text-red-600">
                    Dahil naabot na ang limit ng ipinapamigay na t-shirt
                  </span>
                  , hinihikayat naming isuot nalang muli ang inyong HTB t-shirts
                  para sa parating na HTB event. Maaring ipa-scan ang QR code sa
                  Finish Line upang opisyal na ma-record ang inyong time.
                  Maraming salamat sa inyong pag unawa.
                </p>
              )}
              {!noTshirt && (
                <p className="pl-2 text-justify text-sm">
                  <span className="font-semibold text-green-600">
                    Ikaw ay pasok para sa libreng t-shirt
                  </span>
                  . Sa pagkakataon na mawala ang iyong Bib maaaring ipa-scan ang
                  QR code sa Finish Line upang opisyal na ma-record ang inyong
                  time. Maraming salamat.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    /* eslint-disable @typescript-eslint/no-misused-promises */
    content = (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2 sm:min-w-[400px]"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="shirtSize">Shirt Size</label>
          <select id="shirtSize" required {...register("shirtSize")}>
            <option value={""}>Select Shirt Size</option>
            {Object.keys(ShirtSize)
              .filter((size) =>
                ["XS", "S", "MD", "L", "XL", "XXL"].includes(size)
              )
              .map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="distance">Select Distance</label>
          <select id="distance" required {...register("distance")}>
            <option value={""}>Select Distance</option>

            {km3Limit !== undefined && km3Limit < 1300 && (
              <option value={3}>3 Kilometers</option>
            )}

            {km5Limit !== undefined && km5Limit < 1300 && (
              <option value={5}>5 Kilometers</option>
            )}

            {km10Limit !== undefined && km10Limit < 1100 && (
              <option value={10}>10 Kilometers</option>
            )}

            {km16Limit !== undefined && km16Limit < 300 && (
              <option value={16}>16 Kilometers</option>
            )}
          </select>
        </div>

        <button
          className="block w-full cursor-pointer rounded-md border-2 border-primary py-2 text-sm  text-primary hover:text-primary-hover"
          type="button"
          onClick={() => setShowAgreement(true)}
        >
          CLICK HERE TO ACCEPT RACE AGREEMENT
        </button>

        {error && <div className="text-xs text-red-500">{error}</div>}

        <div className="grid grid-cols-2">
          <button
            type="button"
            disabled={isJoining}
            onClick={() => showControl()}
            className="col-span-1 rounded-md border-2 border-solid bg-red-500 py-1.5 text-white disabled:opacity-60"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={!acceptAgreement || isJoining}
            className="col-span-1 flex items-center justify-center rounded-md border-2 border-solid bg-primary py-1.5 text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {isJoining ? <LoadingSpinner /> : "JOIN"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <Modal
        show={show}
        title={
          distance && shirtSize
            ? `PARTICIPANT NO.${registrationNumber as number}`
            : "JOIN EVENT"
        }
        onClose={() => showControl()}
      >
        {content}
      </Modal>

      {!registrationNumber && showAgreement && (
        <Modal
          title="LIABILITY WAIVER AND RACE AGREEMENT"
          show={showAgreement}
          onClose={() => {
            setShowAgreement(false);
          }}
        >
          <div className="flex flex-col gap-4 p-4 text-sm ">
            <p>
              <span className="ml-10"></span>I attest that I am physically and
              mentally fit to participate in the Hataw Takbo, Bataan and have
              full knowledge of and assume all the risks associated with my
              decision to voluntarily participate in the said event.
            </p>
            <p>
              <span className="ml-10"></span>I also understand and accept that
              during the event, the medical assistance available to me is
              limited to first aid treatment. I am aware and agree that medical
              expenses for injuries or medical treatment incurred at the event
              are my sole responsibility as a participant.
            </p>
            <p>
              <span className="ml-10"></span>I give my permission for the free
              use of my names, photos and voice in any broadcast, telecast,
              digital, print material or any other material in any medium for
              this event.
            </p>
            <p>
              <span className="ml-10"></span>In consideration of being permitted
              to participate, I do hereby waive and release forever, any and all
              rights to claims and damages I may have against the race
              organizers, sponsors, volunteers, race officials, and all parties
              involved with this event, arising from any and all liability for
              injury, death or damages or any other claims, demands, losses or
              damages incurred by me in connection with my participation in this
              event.
            </p>
            <p>
              <span className="ml-10"></span>I agree to abide by any decision of
              the race official relative to any aspect of my participation in
              this event. I attest that I have read the rules of the race,
              understood it and agree to abide by them.
            </p>
            <p>
              Participants Signature: _____________________ (parents must sign
              if participant is below 18 years old)
            </p>

            <button
              onClick={() => {
                setAcceptAgreement(true);
                setShowAgreement(false);
              }}
              className="col-span-2 rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5]"
            >
              Accept Race Agreement
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default JoinEventWithLimit;
