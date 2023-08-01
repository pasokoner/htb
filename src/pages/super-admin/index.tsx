import { type NextPage, type GetServerSideProps } from "next";

import { getSession } from "next-auth/react";

import { useState, useEffect, Fragment } from "react";

import { api } from "../../utils/api";

import { useInView } from "react-intersection-observer";

import LoadSpinner from "../../components/LoadingSpinner";
import ScreenContainer from "../../layouts/ScreenContainer";

import { BsChevronDoubleRight } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { MdEventNote } from "react-icons/md";

const events = [
  // { id: "cle1fx5dw0000f1e0j1wch7mf", name: "Bagac" },
  // { id: "clenx05d90000f1u4vaj7mwek", name: "Mariveles" },
  // { id: "clfzawnto0000fx54eplai1nq", name: "Orani" },
  { id: "clh8f55uk0000fxu8ld38mlkj", name: "Orion" },
  { id: "clicqkn8h0000fx5g4vkilw9e", name: "Dinalupihan" },
  { id: "cljprc7j70002fxaouk2e32mz", name: "Limay" },
  { id: "clkro9sc30000fx9sbtaznu6l", name: "Samal" },
];

const SuperAdmin: NextPage = () => {
  const { ref, inView } = useInView();

  const [queryName, setQueryName] = useState("");

  const {
    data,
    isLoading,
    refetch: refetchProfile,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = api.officials.get.useInfiniteQuery(
    {
      name: queryName ? queryName : undefined,
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const {
    data: officials,
    isLoading: isLoadingOfficials,
    refetch: refetchOfficials,
  } = api.officials.getOfficialsOnly.useQuery();

  const { mutate: makeOfficial, isLoading: isMakingOfficial } =
    api.officials.makeOfficial.useMutation({
      onSuccess() {
        void refetchOfficials();
        void refetchProfile();
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView]);

  return (
    <ScreenContainer className="grid grid-cols-2 gap-2 py-6">
      <div className="col-span-2 border-[1px] border-black sm:col-span-1">
        <h4 className="max-h-9 bg-primary py-1 text-center text-xl text-white">
          PROFILE
        </h4>
        <input
          type="text"
          className="w-full"
          value={queryName}
          onChange={(e) => setQueryName(e.target.value)}
        />
        {isLoading && <LoadSpinner />}
        <div className="col-span-6 grid max-h-[25vh] grid-cols-6 overflow-y-scroll sm:max-h-[60vh]">
          {data?.pages &&
            data.pages.map(({ data }) => {
              return data.map(({ id, firstName, lastName }) => (
                <Fragment key={id}>
                  <div className="col-span-5 h-7 border-b-[1px] border-r-[1px] border-black py-0.5 px-1">
                    {firstName} {lastName}
                  </div>
                  <button
                    disabled={isMakingOfficial}
                    onClick={() => {
                      makeOfficial({ profileId: id });
                    }}
                    className="col-span-1 flex h-7 cursor-pointer items-center justify-center border-b-[1px] border-black bg-emerald-500 px-1 py-0.5 text-white hover:bg-emerald-400"
                  >
                    <BsChevronDoubleRight className="text-xs font-semibold" />
                  </button>
                </Fragment>
              ));
            })}
        </div>
      </div>

      <div className="col-span-2 border-[1px] border-black sm:col-span-1">
        <h4 className="max-h-9 w-full bg-primary py-1 text-center text-xl text-white">
          OFFICIALS
        </h4>
        <input
          type="text"
          className="w-full"
          disabled
          placeholder="DISPLAY LANG"
        />
        <div className="grid max-h-[25vh] grid-cols-6 overflow-y-scroll sm:max-h-[60vh]">
          {isLoadingOfficials && <LoadSpinner />}
          {officials &&
            officials.map(
              ({ id: profileId, firstName, lastName, eventParticitpant }) => (
                <Fragment key={profileId}>
                  <div className="col-span-5 max-h-14 border-b-[1px] border-r-[1px] border-black py-0.5 px-1">
                    <p>
                      {firstName} {lastName}
                    </p>
                    <div className="flex gap-2">
                      {events.map(({ id: eventId, name }) => {
                        const eventParticipantData = eventParticitpant.find(
                          ({ eventId: i }) => i === eventId
                        );

                        if (eventParticipantData) {
                          return (
                            <EventButton
                              key={eventParticipantData.id}
                              eventId={eventId}
                              eventParticipant={eventParticipantData}
                              profileId={profileId}
                              eventName={name}
                              refetch={() => {
                                void refetchOfficials();
                              }}
                            />
                          );
                        } else {
                          return (
                            <EventButton
                              key={eventId}
                              eventId={eventId}
                              profileId={profileId}
                              eventName={name}
                              refetch={() => {
                                void refetchOfficials();
                              }}
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
                  <div className="col-span-1 flex max-h-14 items-center justify-center gap-2 border-b-[1px] border-black px-1 py-0.5">
                    <RxCross2 className="cursor-pointer hover:text-gray-700" />
                  </div>
                </Fragment>
              )
            )}
        </div>
      </div>
    </ScreenContainer>
  );
};

export default SuperAdmin;

import { Dialog, Transition } from "@headlessui/react";
import JoinEvent from "../../components/JoinEvent";
import { Event, EventParticipant, ShirtSize } from "@prisma/client";

import { useForm, type SubmitHandler } from "react-hook-form";

type EventButtonProps = {
  eventParticipant?: EventParticipant & { event: Event };
  profileId: string;
  eventId: string;
  eventName: string;
  refetch: () => void;
};

const EventButton = ({
  eventParticipant,
  profileId,
  eventId,
  eventName,
  refetch,
}: EventButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: join, isLoading: submitting } =
    api.officials.join.useMutation({
      onSuccess() {
        refetch();
        setIsOpen(false);
      },
    });

  const { register, handleSubmit } = useForm<{
    shirtSize: ShirtSize;
    distance: string;
    registrationNumber: string;
  }>();

  const onSubmit: SubmitHandler<{
    shirtSize: ShirtSize;
    distance: string;
    registrationNumber: string;
  }> = (data) => {
    if (data && eventParticipant) {
      join({
        distance: parseInt(data.distance),
        shirtSize: data.shirtSize,
        profileId: profileId,
        eventId: eventId,
        registrationNumber: eventParticipant.registrationNumber,
      });
    } else if (data && !eventParticipant) {
      join({
        distance: parseInt(data.distance),
        shirtSize: data.shirtSize,
        profileId: profileId,
        eventId: eventId,
        registrationNumber: parseInt(data.registrationNumber),
      });
    }
  };

  return (
    <>
      {eventParticipant && (
        <span
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded-sm bg-gray-500 p-1 text-xs text-white"
        >
          {eventParticipant.event.name}
        </span>
      )}

      {!eventParticipant && (
        <span
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded-sm border-[1px] border-black p-1 text-xs"
        >
          {eventName}
        </span>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={() => setIsOpen(false)}
          className="relative z-10"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900"
                  >
                    <span>{eventName} Leg</span>
                    <span>{eventParticipant?.registrationNumber}</span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      /* eslint-disable @typescript-eslint/no-misused-promises */
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex w-full flex-col gap-2 sm:min-w-[400px]"
                    >
                      {!eventParticipant && (
                        <div className="flex flex-col gap-1">
                          <label htmlFor="shirtSize">Registration Number</label>
                          <input
                            id="registrationNumber"
                            required
                            type="number"
                            {...register("registrationNumber")}
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <label htmlFor="shirtSize">Shirt Size</label>
                        <select
                          id="shirtSize"
                          required
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
                          disabled={submitting}
                          className="col-span-1 rounded-md border-2 border-solid bg-red-500 py-1.5 text-white disabled:opacity-60"
                          onClick={() => setIsOpen(false)}
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="col-span-1 flex items-center justify-center rounded-md border-2 border-solid bg-primary py-1.5 text-white hover:bg-primary-hover disabled:opacity-60"
                        >
                          {submitting ? (
                            <LoadSpinner />
                          ) : eventParticipant ? (
                            "EDIT"
                          ) : (
                            "JOIN"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

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

  if (session.user.role === "SUPERADMIN") {
    return {
      props: { session },
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
