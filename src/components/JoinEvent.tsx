import { ShirtSize } from "@prisma/client";
import React, { useState } from "react";
import Modal from "./Modal";
import { api } from "../utils/api";

import { useForm, type SubmitHandler } from "react-hook-form";

import LoadingSpinner from "./LoadingSpinner";

type Props = {
  shirtSize?: ShirtSize;
  profileId: string;
  eventId: string;
  distance?: number;
  show?: boolean;
  showControl: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  registrationNumber?: number;
};

const EDIT = false;

const NUMBER_FROM_DISABLED = 12200;

const JoinEvent = ({
  distance,
  profileId,
  eventId,
  shirtSize,
  onSuccess,
  onError,
  show,
  showControl,
  registrationNumber,
}: Props) => {
  const { mutate: join, isLoading: isJoining } =
    api.participant.join.useMutation({
      onSuccess: () => {
        setError("");
        if (onSuccess) onSuccess();
      },
      onError: (e) => {
        if (e.message.includes("constraint")) {
          setError(
            "Seems like there is an error, try pressing the join button again"
          );
        } else {
          setError(
            "Seems like there is an error, try pressing the join button again"
          );
        }
      },
    });

  const { mutate: editEventProfile, isLoading: isEditing } =
    api.participant.editEventProfile.useMutation({
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
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
      if (distance && shirtSize) {
        editEventProfile({
          profileId: profileId,
          eventId: eventId,
          ...data,
          distance: parseInt(data.distance),
        });
      } else {
        join({
          profileId: profileId,
          eventId: eventId,
          ...data,
          distance: parseInt(data.distance),
        });
      }
    }
  };

  let content = <></>;

  if (distance && shirtSize) {
    /* eslint-disable @typescript-eslint/no-misused-promises */
    content = (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2 sm:min-w-[400px]"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="shirtSize">Shirt Size</label>
          <select
            id="shirtSize"
            required
            disabled={
              registrationNumber
                ? registrationNumber <= NUMBER_FROM_DISABLED
                : false
            }
            defaultValue={shirtSize}
            {...register("shirtSize")}
          >
            <option value={""}>Select Shirt Size</option>
            {Object.keys(ShirtSize)
              .filter((size) => !["S", "XS"].includes(size))
              .map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="distance">Select Distance</label>
          <select
            id="distance"
            disabled={
              registrationNumber
                ? registrationNumber <= NUMBER_FROM_DISABLED
                : false
            }
            required
            defaultValue={distance}
            {...register("distance")}
          >
            <option value={""}>Select Distance</option>
            {[3, 5, 10].map((d) => (
              <option key={d} value={d}>
                {d} Kilometers
              </option>
            ))}
          </select>
        </div>

        {registrationNumber && registrationNumber <= NUMBER_FROM_DISABLED && (
          <div className="text-sm text-gray-500">
            Edit disabled: bib generation started
          </div>
        )}

        <div className="grid grid-cols-2">
          <button
            type="button"
            disabled={isEditing}
            onClick={() => showControl()}
            className="col-span-1 rounded-md border-2 border-solid bg-red-500 py-1.5 text-white disabled:opacity-60"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={
              registrationNumber
                ? registrationNumber <= NUMBER_FROM_DISABLED
                : false || isEditing
            }
            className="col-span-1 flex items-center justify-center rounded-md border-2 border-solid bg-primary py-1.5 text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {isEditing ? <LoadingSpinner /> : "SAVE"}
          </button>
        </div>
      </form>
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
              .filter((size) => !["S", "XS"].includes(size))
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
            {[3, 5, 10].map((d) => (
              <option key={d} value={d}>
                {d} Kilometers
              </option>
            ))}
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
            ? `EDIT DETAILS - ${registrationNumber as number}`
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

export default JoinEvent;
