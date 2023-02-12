import { type NextPage, type GetServerSideProps } from "next";

import { getSession, useSession } from "next-auth/react";

import React from "react";
import ScreenContainer from "../../layouts/ScreenContainer";
import Image from "next/image";

const Edit: NextPage = () => {
  const { data: sessionData } = useSession();

  return <ScreenContainer className="py-6"></ScreenContainer>;
};

export default Edit;

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

  return {
    props: { session },
  };
};
