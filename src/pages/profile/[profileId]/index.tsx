import { type NextPage, type GetServerSideProps } from "next";

import { getSession, useSession, signIn } from "next-auth/react";

import { useEffect } from "react";

import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import LoadSpinner from "../../../components/LoadingSpinner";

const ProfileId: NextPage = () => {
  const router = useRouter();

  const { data: sessionData } = useSession();

  const { profileId } = router.query;

  const { data: profileData, isLoading } = api.profile.getById.useQuery(
    {
      profileId: profileId as string,
    },
    {
      enabled: !!profileId,
    }
  );

  const { mutate: claim, isLoading: isClaiming } =
    api.profile.connectWithUnclaimed.useMutation({
      onSuccess() {
        void router.reload();
      },
    });

  useEffect(() => {
    if (!isLoading) {
      if (
        profileData &&
        !profileData.user &&
        sessionData &&
        !sessionData.user.profileId &&
        !sessionData.user.unclaimed
      ) {
        //insert the profile here
        claim({
          profileId: profileData.id,
        });
        // } else if (sessionData?.user.unclaimed && profileData?.user) {
        //   router.push("/");
      } else if (!profileData?.user && !sessionData) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        signIn("google");
      }
    }
  }, [profileData]);

  if (isLoading) {
    return <LoadSpinner />;
  }

  if (isClaiming) {
    return (
      <h3 className="text-center text-xl font-medium">
        Wait while we check if this account is authorized to claim this profile
      </h3>
    );
  }

  return <></>;
};

export default ProfileId;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user.unclaimed) {
    return {
      redirect: { destination: "/profile/setup", permanent: false },
    };
  }

  if (session?.user.profileId && !session.user.unclaimed) {
    return {
      redirect: { destination: "/events", permanent: false },
    };
  }

  return {
    props: { session },
  };
};
