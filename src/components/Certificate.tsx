import { useState, useRef, type RefObject } from "react";

import { FiDownload } from "react-icons/fi";

import html2canvas from "html2canvas";
import { getFinishedTime } from "../utils/convertion";
import Image from "next/image";

type Props = {
  eventName: string;
  participantName: string;
  distance: number;
  time: string;
};

const Certificate = ({ eventName, participantName, distance, time }: Props) => {
  const certL = useRef<HTMLDivElement>(null);
  const certMd = useRef<HTMLDivElement>(null);
  const certSm = useRef<HTMLDivElement>(null);
  const certXs = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async (cert: RefObject<HTMLDivElement>) => {
    const element = cert.current;
    const canvas = await html2canvas(element as HTMLDivElement);

    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "hataw-bataan-certificate.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  return (
    <>
      <>
        <div
          ref={certL}
          className="relative hidden h-[571px] w-[800px] lg:block"
        >
          <img
            src={`/certificates/${eventName.toLocaleLowerCase()}.jpg`}
            alt="certificate"
            // width={800}
            // height={571}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-40 left-0 top-0"
          ></img>
          <div className="absolute inset-60 top-[215px] left-[350px] right-[65px] z-10 flex justify-center text-2xl ">
            <p className="text-[24px] font-semibold">{participantName}</p>
          </div>
          <div className="absolute top-[263px] right-[250px] left-[450px] flex justify-center">
            <p className="text-[19px] font-bold">{distance} KM</p>
          </div>
          <div className="absolute top-[348px] right-[100px] left-[560px]">
            <p className="text-[13px] font-medium">{time}</p>
          </div>
        </div>
        <button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await handleDownloadImage(certL);
          }}
          className="mt-4 hidden w-full animate-bounce cursor-pointer gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 lg:flex lg:items-center lg:justify-center"
        >
          DOWNLOAD CERTIFICATE <FiDownload />
        </button>
      </>

      <>
        <div
          ref={certMd}
          className="relative hidden h-[428px] w-[600px] md:block lg:hidden"
        >
          <img
            src={`/certificates/${eventName.toLocaleLowerCase()}.jpg`}
            onContextMenu={(e) => e.preventDefault()}
            // height={428}
            // width={600}
            alt="hermosa certificate"
            className="absolute inset-40 left-0 top-0"
          ></img>
          <div className="absolute inset-60 top-[158px] left-[270px] right-[50px] z-10 flex justify-center text-xl">
            <p className="text-[20px] font-semibold ">{participantName}</p>
          </div>
          <div className="absolute top-[196px] right-[195px] left-[345px] flex justify-center">
            <p className="text-[15px] font-bold">{distance} KM</p>
          </div>
          <div className="absolute top-[261px] right-[60px] left-[420px]">
            <p className="text-[10px] font-medium">{time}</p>
          </div>
        </div>

        <button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await handleDownloadImage(certMd);
          }}
          className="mt-4 hidden w-full animate-bounce cursor-pointer gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 md:flex md:items-center md:justify-center lg:hidden"
        >
          DOWNLOAD CERTIFICATE <FiDownload />
        </button>
      </>

      <>
        <div
          ref={certSm}
          className="relative hidden h-[356px] w-[500px] sm:block md:hidden lg:hidden"
        >
          <img
            src={`/certificates/${eventName.toLocaleLowerCase()}.jpg`}
            onContextMenu={(e) => e.preventDefault()}
            // width={500}
            // height={356}
            alt="hermosa certificate"
            className="absolute inset-40 left-0 top-0"
          ></img>
          <div className="absolute inset-60 top-[128px] left-[220px] right-[44px] z-10 flex justify-center text-xl">
            <p className="text-[18px] font-semibold ">{participantName}</p>
          </div>
          <div className="absolute top-[162px] right-[165px] left-[285px] flex justify-center">
            <p className="text-[13px] font-bold">{distance} KM</p>
          </div>
          <div className="absolute top-[218px] right-[50px] left-[350px]">
            <p className="text-[8px] font-medium">{time}</p>
          </div>
        </div>
        <button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await handleDownloadImage(certSm);
          }}
          className="mt-4 hidden w-full animate-bounce cursor-pointer gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 sm:flex sm:items-center sm:justify-center md:hidden"
        >
          DOWNLOAD CERTIFICATE <FiDownload />
        </button>
      </>

      <>
        <div
          ref={certXs}
          className="relative h-[214px]  w-[300px]  sm:hidden md:hidden lg:hidden"
        >
          <img
            src={`/certificates/${eventName.toLocaleLowerCase()}.jpg`}
            onContextMenu={(e) => e.preventDefault()}
            alt="hermosa certificate"
            // height={214}
            // width={300}
            className="absolute inset-40 left-0 top-0"
          ></img>
          <div className="absolute inset-60 top-[72px] left-[130px] right-[27px] z-10 flex justify-center text-xl">
            <p className="text-[10px] font-semibold ">{participantName}</p>
          </div>
          <div className="absolute top-[97px] right-[100px] left-[173px] flex justify-center">
            <p className="text-[7px] font-bold">{distance} KM</p>
          </div>
          <div className="absolute top-[131px] right-[60px] left-[211px]">
            <p className="text-[4px] font-medium">{time}</p>
          </div>
        </div>
        <button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await handleDownloadImage(certXs);
          }}
          className="mt-4 flex w-full animate-bounce cursor-pointer items-center justify-center gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 sm:hidden"
        >
          DOWNLOAD CERTIFICATE <FiDownload />
        </button>
      </>
    </>
  );
};

export default Certificate;
