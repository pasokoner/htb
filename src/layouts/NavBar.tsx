import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import IconHatawBataan from "../assets/icon-hataw-bataan.webp";
import ScreenContainer from "./ScreenContainer";
import { signIn, signOut, useSession } from "next-auth/react";
import Modal from "../components/Modal";

import { FcGoogle } from "react-icons/fc";
import { api } from "../utils/api";

import Snackbar from "../components/Snackbar";

const NavBar: React.FC = () => {
  const [dropdown, setDropdown] = useState(false);

  const { data: sessionData } = useSession();

  const { mutate } = api.profile.firstTime.useMutation();

  const { data: profileData } = api.profile.getProfile.useQuery(undefined, {
    enabled: !!sessionData?.user.profileId,
  });

  const [showModal, setShowModal] = useState(false);

  const [firstTime, setFirstTime] = useState(true);

  return (
    <header className="w-full">
      <ScreenContainer
        as="nav"
        className="flex items-center justify-between border-b-2 py-4"
      >
        <Link href={"/"} className="flex items-center  gap-2">
          <Image
            src={IconHatawBataan}
            height={50}
            width={50}
            alt="Hataw Bataan Icon"
          />
          <h1 className="text-lg font-semibold md:text-3xl">
            <span className="text-[#0062ad]">Hataw </span>
            <span className="text-[#d33d49]">Takbo </span>
            <span className="text-[#0d632b]">Bataan</span>
          </h1>
        </Link>

        {!sessionData && (
          <button
            className="rounded-md border-2 border-primary py-1.5 px-2.5 text-center text-xs font-semibold text-primary shadow-md transition-all hover:bg-primary hover:text-white active:bg-primary-hover md:px-4 md:py-2"
            onClick={() => setShowModal(true)}
          >
            BE A MEMBER?
          </button>
        )}

        <Modal
          show={showModal}
          title="Register"
          onClose={() => setShowModal(false)}
        >
          <div className="md:min-w-[450px]">
            <button
              className="rounded-md border-2 border-slate-400 py-2 px-2"
              onClick={() => {
                void signIn();
              }}
            >
              Click here to register
              <FcGoogle className="ml-1 inline text-2xl" />
            </button>
          </div>
        </Modal>

        {sessionData && !sessionData.user.profileId && (
          <button
            className="rounded-md border-2 border-primary py-1.5 px-2.5 text-center text-xs font-semibold text-primary shadow-md md:px-4 md:py-2"
            onClick={() => {
              void signOut();
            }}
          >
            Logout
          </button>
        )}

        {sessionData && profileData && (
          <div className="text-rpimary inline-flex rounded-md border border-primary bg-white transition-all">
            <a
              href="#"
              className="rounded-l-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setDropdown((prevState) => !prevState)}
            >
              Hi, {profileData.firstName.split(" ")[0]}
            </a>

            <div className="relative">
              <button
                type="button"
                className="inline-flex h-full items-center justify-center rounded-r-md border-l border-gray-100 px-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setDropdown((prevState) => !prevState)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdown && (
                <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg">
                  <div className="p-2">
                    <Link
                      href="/"
                      className="block w-full rounded-lg px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    >
                      My Profile
                    </Link>
                    <button
                      className="block w-full rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => {
                        void signOut();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {profileData && profileData.firstTime && firstTime && (
          <Snackbar
            onClose={() => {
              mutate({ profileId: profileData.id });
              setFirstTime(false);
            }}
            type="success"
            message="Congratulation on setting up your account!"
          />
        )}
      </ScreenContainer>
    </header>
  );
};

export default NavBar;
