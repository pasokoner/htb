import React, { useState, createContext } from "react";
import Modal from "../components/Modal";
import { signIn } from "next-auth/react";

import HTBLogo from "../assets/hataw-takbo-bataan.png";
import Image from "next/image";

interface ContextProps {
  joinVisibility: boolean;
  toggleJoin: () => void;
}

export const JoinContext = createContext<ContextProps>({
  joinVisibility: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleJoin: () => {},
});

type Props = {
  children: React.ReactNode;
};

const JoinProvider = ({ children }: Props) => {
  const [joinVisibility, setJoinVisibility] = useState(false);

  const toggleJoin = () => {
    setJoinVisibility((prevVisibility) => !prevVisibility);
  };

  return (
    <JoinContext.Provider value={{ joinVisibility, toggleJoin }}>
      <JoinToggler />
      {children}
    </JoinContext.Provider>
  );
};

const JoinToggler: React.FC = () => {
  const { joinVisibility, toggleJoin } = React.useContext(JoinContext);

  return (
    <Modal
      show={joinVisibility}
      title="JOIN US NOW"
      onClose={() => toggleJoin()}
    >
      <div className="max-w-[500px]">
        <Image
          src={HTBLogo}
          width={150}
          className="mx-auto mb-2"
          alt="hataw takbo bataan logo"
        />

        <p className="py-0.5 text-xs text-gray-500">
          After clicking, a prompt will appear requesting your email
          information.
        </p>
        <button
          className="col-span-1 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 font-semibold text-white shadow-md shadow-primary-hover transition-all hover:border-2 hover:border-primary hover:bg-white hover:text-primary"
          onClick={() => {
            void signIn("google");
          }}
        >
          Click here to join
        </button>
      </div>
    </Modal>
  );
};

export default JoinProvider;
