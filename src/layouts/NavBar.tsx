import Link from "next/link";
import Image from "next/image";

import { useState, useRef } from "react";

import { useOnClickOutside } from "usehooks-ts";

import IconHatawBataan from "../assets/icon-hataw-bataan.webp";
import ScreenContainer from "./ScreenContainer";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

import Snackbar from "../components/Snackbar";

const currentEventId = "cln8b37d50000li7ck0qxck5g";

const NavBar: React.FC = () => {
  const [dropdown, setDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const { data: sessionData } = useSession();

  const { mutate } = api.profile.firstTime.useMutation();

  const { data: profileData } = api.profile.getProfile.useQuery(undefined, {
    enabled: !!sessionData?.user.profileId,
  });

  const [firstTime, setFirstTime] = useState(true);

  const handleClickOutside = () => {
    // Your custom logic here
    if (dropdown === true) {
      setDropdown(false);
    }
  };

  useOnClickOutside(dropdownRef, handleClickOutside);

  return (
    <header className="w-full border-b-2">
      <ScreenContainer
        as="nav"
        className="flex items-center justify-between py-4"
      >
        <Link
          href={"/"}
          className="flex items-center gap-2"
          onClick={() => setDropdown(false)}
        >
          <Image
            src={IconHatawBataan}
            height={50}
            width={50}
            alt="Hataw Bataan Icon"
          />
          <h1 className="hidden text-2xl font-semibold sm:block">
            <span className="text-[#0062ad]">Hataw </span>
            <span className="text-[#d33d49]">Takbo </span>
            <span className="text-[#0d632b]">Bataan</span>
          </h1>
        </Link>

        {(profileData || !sessionData) && !sessionData?.user.unclaimed && (
          <Link
            href={"/events"}
            className="inline-flex rounded-md border border-primary bg-white py-1.5 px-2.5 text-primary transition-all sm:ml-auto sm:mr-4"
            onClick={() => setDropdown(false)}
          >
            EVENTS
          </Link>
        )}

        {!sessionData && (
          <button
            className="rounded-md border-2 border-primary py-1.5 px-2.5 text-center text-xs font-semibold text-primary shadow-md transition-all hover:bg-primary hover:text-white active:bg-primary-hover md:px-4 md:py-2"
            onClick={() => {
              void signIn("google");
            }}
          >
            LOGIN
          </button>
        )}

        {sessionData &&
          (!sessionData.user.profileId || sessionData.user.unclaimed) && (
            <button
              className="rounded-md border-2 border-primary py-1.5 px-2.5 text-center text-xs font-semibold text-primary shadow-md md:px-4 md:py-2"
              onClick={() => {
                void signOut();
              }}
            >
              Logout
            </button>
          )}

        {sessionData && profileData && !sessionData.user.unclaimed && (
          <div
            ref={dropdownRef}
            className="z-20 inline-flex rounded-md border border-primary bg-white text-primary transition-all"
          >
            <a
              className="cursor-pointer rounded-l-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700"
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
                      href="/profile/my-profile"
                      className="block w-full rounded-lg px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => setDropdown(false)}
                    >
                      My Profile
                    </Link>

                    {sessionData.user.role === "SUPERADMIN" && (
                      <>
                        <Link
                          href="/admin"
                          className="block w-full rounded-lg px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          onClick={() => setDropdown(false)}
                        >
                          Admin
                        </Link>
                        <Link
                          href={`/super-admin`}
                          className="block w-full rounded-lg px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          onClick={() => setDropdown(false)}
                        >
                          Super Admin
                        </Link>
                      </>
                    )}

                    {(sessionData.user.role === "SUPERADMIN" ||
                      sessionData.user.role === "ADMIN") && (
                      <>
                        <Link
                          href={`/events/${currentEventId}/raffle`}
                          className="block w-full rounded-lg px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          onClick={() => setDropdown(false)}
                        >
                          Raffle
                        </Link>
                        <Link
                          href={`/events/${currentEventId}`}
                          className="block w-full rounded-lg px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          onClick={() => setDropdown(false)}
                        >
                          Event Control
                        </Link>
                      </>
                    )}

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
            message="Congratulations on setting up your account!"
          />
        )}
      </ScreenContainer>
    </header>
  );
};

export default NavBar;
