import * as XLSX from "xlsx";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

import { TbFileExport } from "react-icons/tb";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  eventId: string;
}

const ExportEventWinner = ({ eventId, className }: Props) => {
  const [enableFetch, setEnableFetch] = useState(false);

  const { data } = api.event.getEventWinner.useQuery(
    { eventId: eventId },
    { enabled: enableFetch }
  );

  const convertDownload = () => {
    setEnableFetch(true);
  };

  useEffect(() => {
    if (enableFetch === true && data) {
      const dataFormatted = data?.map(
        ({ registrationNumber, name, price, isClaimed }) => {
          return {
            registrationNumber,
            name,
            prize: price,
            isClaimed,
          };
        }
      );
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataFormatted);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `raffle-winner.xlsx`;
      link.click();
      setEnableFetch(false);
    }
  }, [data]);

  return (
    <TbFileExport
      className={className}
      onClick={() => {
        convertDownload();
      }}
    ></TbFileExport>
  );
};

export default ExportEventWinner;
