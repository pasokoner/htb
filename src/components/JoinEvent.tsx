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
};

const JoinEvent = ({
  distance,
  profileId,
  eventId,
  shirtSize,
  onSuccess,
  onError,
  show,
  showControl,
}: Props) => {
  const { mutate: join, isLoading: isJoining } =
    api.participant.join.useMutation({
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });

  const { mutate: editEventProfile, isLoading: isEditing } =
    api.participant.editEventProfile.useMutation({
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });

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
            defaultValue={shirtSize}
            {...register("shirtSize")}
          >
            <option value={""}>Select Shirt Size</option>
            {Object.keys(ShirtSize).map((size) => (
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
            {Object.keys(ShirtSize).map((size) => (
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
            className="col-span-1 flex items-center justify-center rounded-md border-2 border-solid bg-primary py-1.5 text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {isJoining ? <LoadingSpinner /> : "SAVE"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <Modal
      show={show}
      title={distance && shirtSize ? "EDIT EVENT DETAILS" : "JOIN EVENT"}
      onClose={() => showControl()}
    >
      {content}
    </Modal>
  );
};

export default JoinEvent;
