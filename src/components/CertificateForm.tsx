import { useForm, type SubmitHandler } from "react-hook-form";

import Image from "next/image";

import { api } from "../utils/api";

import { useEffect, useState } from "react";

import { AiOutlineQrcode } from "react-icons/ai";
import { TbUserSearch } from "react-icons/tb";
import ScannerCert from "./ScannerCert";
import { useRouter } from "next/router";

import HTBLogo from "../assets/hataw-takbo-bataan.webp";
import { signIn } from "next-auth/react";

type ParticipantForm = {
  firstName: string;
  lastName: string;
  birthdate: string;
  registrationNumber: string;
};

type Props = {
  // eventId: string;
  // handleParticipant: (
  //   participant: Participant & { kilometers: Kilometer[] }
  // ) => void;
  setProfileId: (profileId: string) => void;
};

const CertificateForm = ({}: Props) => {
  const { register, handleSubmit } = useForm<ParticipantForm>();

  const [cameraResult, setCameraResult] = useState("");

  const [userExist, setUserExist] = useState(false);

  const router = useRouter();

  const { mutate: findById, isLoading: idLoading } =
    api.scan.findById.useMutation({
      onSuccess(data) {
        if (!data?.profile.user) {
          //eslint-disable-next-line @typescript-eslint/no-floating-promises
          router.push(`/profile/${data?.profile.id as string}`);
        } else {
          setUserExist(true);
        }
      },
    });

  const { mutate: findByDetails, isLoading: detailsLoading } =
    api.scan.findByDetails.useMutation({
      onSuccess(data) {
        if (!data?.profile.user) {
          //eslint-disable-next-line @typescript-eslint/no-floating-promises
          router.push(`/profile/${data?.profile.id as string}`);
        } else {
          setUserExist(true);
        }
      },
    });

  const onSubmit: SubmitHandler<ParticipantForm> = (data) => {
    if (data) {
      findByDetails({
        ...data,
        registrationNumber: parseInt(data.registrationNumber),
      });
    }
  };

  const cameraUpdate = (cameraResult: string) => {
    setCameraResult(cameraResult);
  };

  useEffect(() => {
    if (cameraResult.length > 0) {
      findById({
        eventParticipantId: cameraResult,
      });
    }
  }, [cameraResult]);

  if (userExist) {
    return (
      <div className="max-w-[500px]">
        <Image
          src={HTBLogo}
          width={100}
          className="mx-auto mb-2 h-28"
          alt="hataw takbo bataan logo"
        />

        <p className="py-0.5 text-xs text-gray-500">
          This account is already tied to an existing user, login first to claim
          your certificate
        </p>
        <button
          className="col-span-1 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 font-semibold text-white shadow-md shadow-primary-hover transition-all hover:border-2 hover:border-primary hover:bg-white hover:text-primary"
          onClick={() => {
            void signIn("google");
          }}
        >
          Login first
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center md:justify-center">
      <div className="flex w-11/12 max-w-[24rem] flex-col items-center gap-4 rounded-md border-2 border-solid border-[#f4f4f4] sm:w-96">
        <ScannerCert update={cameraUpdate} />

        {/* eslint-disable @typescript-eslint/no-misused-promises */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-2"
        >
          <div className="col-span-2 flex w-10/12 flex-col gap-2 md:col-span-1">
            <input
              type="text"
              id="registrationNumber"
              placeholder="Registration Number"
              required
              {...register("registrationNumber")}
              className="uppercase"
            />
          </div>
          <div className="col-span-2 flex w-10/12 flex-col gap-2 md:col-span-1">
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              required
              {...register("firstName")}
              className="uppercase"
            />
          </div>
          <div className="col-span-2 flex w-10/12 flex-col gap-2 md:col-span-1">
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              required
              {...register("lastName")}
              className="uppercase"
            />
          </div>

          {!idLoading && !detailsLoading && (
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-primary py-3 text-sm text-white hover:bg-[#0d6cb5]"
            >
              FIND MY ACCOUNT <TbUserSearch className="inline" />
            </button>
          )}

          {(idLoading || detailsLoading) && (
            <button
              type="submit"
              // disabled={idLoading || detailsLoading}
              className="flex w-full items-center justify-center gap-2 bg-primary py-3 text-white hover:bg-[#0d6cb5] disabled:bg-[#0d6cb5]"
            >
              FIND MY ACCOUNT <TbUserSearch className="inline animate-spin" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CertificateForm;
