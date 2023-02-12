import { type NextPage, type GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

import ScreenContainer from "../../layouts/ScreenContainer";
import { api } from "../../utils/api";

const MyProfile = () => {
  const { data: sessionData } = useSession();

  const { data: profileData, isLoading } = api.profile.getProfile.useQuery(
    undefined,
    {
      enabled: !!sessionData?.user.profileId,
    }
  );

  if (isLoading) {
    return <></>;
  }

  return (
    <ScreenContainer className="pt-6">
      <h2 className="mx-auto mb-4 w-full max-w-4xl text-2xl font-semibold uppercase">
        My Profile
      </h2>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 rounded-md border-2 bg-gray-100 p-4 text-sm">
        <h5 className="text col-span-2 text-lg">PERSONAL INFORMATION</h5>

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">First Name</p>
          <p>{profileData?.firstName}</p>
        </div>

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">Last Name</p>
          <p>{profileData?.lastName}</p>
        </div>

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">Gender</p>
          <p>{profileData?.gender}</p>
        </div>

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">Birthdate</p>
          <p>{profileData?.birthdate?.toLocaleDateString()}</p>
        </div>

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">
            Contact Number
          </p>
          <p>{profileData?.contactNumber}</p>
        </div>

        <div className="col-span-2 border-b-2"></div>

        {profileData?.municipality && (
          <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
            <p className="font-medium underline underline-offset-2">
              Municipality
            </p>
            <p>{profileData?.municipality}</p>
          </div>
        )}

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">Address</p>
          <p>{profileData?.address}</p>
        </div>

        <div className="col-span-2 border-b-2"></div>

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">
            Emergency Contact
          </p>
          <p>{profileData?.emergencyContact}</p>
        </div>

        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <p className="font-medium underline underline-offset-2">
            Emergency Contact Number
          </p>
          <p>{profileData?.emergencyContactNumber}</p>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default MyProfile;

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

  if (session && !session.user.profileId) {
    return {
      redirect: {
        destination: "/profile/setup",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
