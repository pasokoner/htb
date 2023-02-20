import * as XLSX from "xlsx";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  distance?: number;
  eventId: string;
}

const ExportList = ({ distance, eventId, className }: Props) => {
  const [enableFetch, setEnableFetch] = useState(false);

  const { data } = api.participant.getList.useQuery(
    { distance, eventId },
    { enabled: enableFetch }
  );

  const convertDownload = () => {
    setEnableFetch(true);
  };

  useEffect(() => {
    if (enableFetch === true && data) {
      const dataFormatted = data?.map(
        ({ registrationNumber, profile, shirtSize, distance }) => {
          return {
            registrationNumber,
            shirtSize,
            firstName: profile.firstName,
            lastName: profile.lastName,
            distance,
            address: profile.address,
            municipality: profile.municipality,
            contactNumber: profile.contactNumber,
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
      link.download = `${distance ? distance : "ALL "}KM-REGISTRANTS.xlsx`;
      link.click();
      setEnableFetch(false);
    }
  }, [data]);

  return (
    <button
      className={className}
      onClick={() => {
        convertDownload();
      }}
    >
      EXPORT
    </button>
  );
};

export default ExportList;
