import { type NextPage, type GetServerSideProps } from "next";

import { getSession } from "next-auth/react";

import { useState } from "react";

import { Gender, Municipality } from "@prisma/client";
import { type z } from "zod";
import { type profileSchema } from "../../server/api/routers/profile";

import { useForm, type SubmitHandler } from "react-hook-form";

import dayjs from "dayjs";

import { api } from "../../utils/api";

import { RiLoader5Fill } from "react-icons/ri";
import ScreenContainer from "../../layouts/ScreenContainer";
import { useRouter } from "next/router";
import Snackbar from "../../components/Snackbar";

type Profile = z.infer<typeof profileSchema>;

const Setup: NextPage = () => {
  const [error, setError] = useState("");

  const router = useRouter();

  const { mutate, isLoading } = api.profile.setup.useMutation({
    onSuccess: () => {
      router.reload();
    },
    onError: (error) => {
      if (error.message.includes("constraint")) {
        setError("Seems like you are already registered");
      } else {
        setError("Seems like there is an error - Sorry for inconvenience");
      }
    },
  });

  const { register, handleSubmit } = useForm<Profile>();

  const onSubmit: SubmitHandler<Profile> = (data) => {
    if (data) {
      const { address, firstName, lastName, emergencyContact } = data;
      mutate({
        ...data,
        birthdate: dayjs(data.birthdate).toDate(),
        address: address.trim().toUpperCase(),
        municipality: data.municipality ? data.municipality : undefined,
        firstName: firstName.trim().toUpperCase(),
        lastName: lastName.trim().toUpperCase(),
        emergencyContact: emergencyContact.trim().toUpperCase(),
      });
    }
  };

  const [outsideBataan, setOutsideBataan] = useState(false);

  // const [showModal, setShowModal] = useState(false);

  // const [agree, setAgree] = useState(false);

  const handleToggleAddress = () => {
    setOutsideBataan((prevState) => !prevState);
  };

  const toggleClass = " transform translate-x-6 bg-blue-600";

  return (
    /* eslint-disable @typescript-eslint/no-misused-promises */
    <ScreenContainer className="py-6">
      <h2 className="mx-auto mb-4 w-full max-w-4xl text-2xl font-semibold uppercase">
        Account Setup
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto grid max-w-3xl grid-cols-2 gap-4 rounded-md border-2 bg-gray-100 p-4 text-sm"
      >
        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            required
            {...register("firstName")}
            className="uppercase"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            required
            {...register("lastName")}
            className="uppercase"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="gender">Gender</label>
          <select id="gender" required {...register("gender")}>
            <option value={""}>Select Gender</option>
            {Object.keys(Gender).map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="birthdate">Birthdate</label>
          <input
            type="date"
            id="birthdate"
            required
            {...register("birthdate")}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            placeholder="09XXXXXXXXX"
            pattern="^(09)[0-9]{9}$"
            title="Format: 09XXXXXXXXX"
            maxLength={11}
            required
            {...register("contactNumber")}
          />
        </div>

        <div className="col-span-2 border-b-2"></div>

        {/*   Switch Container */}
        <div className="col-span-2 flex items-center gap-4">
          <p>Outside Bataan:</p>
          <div
            className="h-5 w-12 cursor-pointer items-center rounded-full bg-gray-400 p-1 md:h-7 md:w-14"
            onClick={handleToggleAddress}
          >
            {/* Switch */}
            <div
              className={
                `mr-auto h-3 w-5 transform rounded-full bg-slate-600 shadow-md duration-300 ease-in-out md:h-5 md:w-6` +
                `${outsideBataan ? toggleClass : ""}`
              }
            ></div>
          </div>
        </div>

        {!outsideBataan && (
          <div className="col-span-2 flex flex-col gap-2">
            <label htmlFor="municipality">Municipality</label>
            <select id="municipality" required {...register("municipality")}>
              <option value={""}>Select Municipality</option>
              {Object.keys(Municipality).map((municipality) => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="col-span-2 flex flex-col gap-2">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="House Number/Street Name, Barangay, Municipality, Province"
            required
            {...register("address")}
          />
        </div>

        <div className="col-span-2 border-b-2 "></div>

        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="emergencyContact">
            In case of emergency, contact
          </label>
          <input
            type="text"
            id="emergencyContact"
            required
            {...register("emergencyContact")}
            className="uppercase"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="emergencyContactNumber">Contact Number</label>
          <input
            type="text"
            id="emergencyContactNumber"
            placeholder="09XXXXXXXXX"
            pattern="^(09)[0-9]{9}$"
            title="Format: 09XXXXXXXXX"
            maxLength={11}
            required
            {...register("emergencyContactNumber")}
          />
        </div>

        {/* {!agree && (
          <button
            type="button"
            className={`col-span-2 rounded-md border-2 bg-[#0062ad] p-2 uppercase text-white hover:bg-[#0d6cb5] disabled:opacity-60`}
            onClick={() => setShowModal(true)}
          >
            Submit
          </button>
        )} */}

        <div className="col-span-2 rounded-md border-2 bg-slate-100 p-2 text-xs sm:text-sm">
          Please be advised that any changes made to your account on our website
          will be permanent and cannot be undone. It is important to thoroughly
          review the details of the information you input before confirming
          them. If you have any questions or concerns, please contact our
          customer support team.
        </div>

        {!isLoading && (
          <button
            type="submit"
            className={`col-span-2 rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5] disabled:opacity-60`}
          >
            Submit
          </button>
        )}
        {isLoading && (
          <button
            disabled
            className={`col-span-2 flex justify-center rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5] disabled:opacity-60`}
          >
            <RiLoader5Fill className="animate-spin text-center text-2xl" />
          </button>
        )}
      </form>
      {error && (
        <Snackbar
          type="error"
          message={error}
          onClose={() => {
            setError("");
          }}
        />
      )}

      {/* <Modal
        show={showModal}
        title="Saving Changes"
        onClose={() => {
          setShowModal(false);
        }}
      >
        <p className="mb-4 text-sm sm:text-[1rem]">
          Please be advised that any changes made to your account on our website
          will be permanent and cannot be undone. It is important to thoroughly
          review the details of the information you input before confirming
          them. If you have any questions or concerns, please contact our
          customer support team.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="rounded-md border-2  border-red-400 py-1.5 font-medium uppercase text-red-500 sm:py-2"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className="rounded-md border-2  bg-[#0062ad] py-1.5 uppercase text-white hover:bg-[#0d6cb5] disabled:opacity-60 sm:py-2">
            Submit
          </button>
        </div>
      </Modal> */}
    </ScreenContainer>
  );
};

export default Setup;

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

  if (session.user.profileId) {
    return {
      redirect: {
        destination: "/events",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
