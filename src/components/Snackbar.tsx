import React from "react";

import { IoClose } from "react-icons/io5";

type Props = {
  message: string;
  title?: string;
  type: "success" | "error";
  onClose: () => void;
};

const Snackbar = ({ message, type, title, onClose }: Props) => {
  if (type === "error") {
    return (
      <div
        className="fixed inset-0 top-2 bottom-auto z-50 mx-auto max-w-screen-lg rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 opacity-95"
        role="alert"
      >
        <p className="font-bold">{title ? title : "Error"}</p>
        <span className="block sm:inline">{message}</span>
        <span className="absolute top-0 bottom-0 right-0 cursor-pointer px-4 py-3">
          <IoClose
            onClick={onClose}
            className="text-xl text-red-500 md:text-2xl"
          />
        </span>
      </div>
    );
  }

  if (type === "success") {
    return (
      <div
        className="fixed inset-0 top-2 bottom-auto z-50 mx-auto max-w-screen-lg rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 opacity-95"
        role="alert"
      >
        <p className="font-bold">Success</p>
        <span className="block sm:inline">{message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <IoClose
            onClick={onClose}
            className="cursor-pointer text-xl text-green-500 md:text-2xl"
          />
        </span>
      </div>
    );
  }

  return <></>;
};

export default Snackbar;
