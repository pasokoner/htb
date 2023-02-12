type Props = {
  eventName: string;
  emergencyContact: string;
  emergencyContactNumber: string;
};

const Waiver = ({
  eventName,
  emergencyContact,
  emergencyContactNumber,
}: Props) => {
  return (
    <>
      <div className="flex flex-col gap-4 p-4 text-sm ">
        <p>
          <span className="ml-10"></span>I attest that I am physically and
          mentally fit to participate in the Hataw Takbo, Bataan ({eventName})
          and have full knowledge of and assume all the risks associated with my
          decision to voluntarily participate in the said event.
        </p>
        <p>
          <span className="ml-10"></span>I also understand and accept that
          during the event, the medical assistance available to me is limited to
          first aid treatment. I am aware and agree that medical expenses for
          injuries or medical treatment incurred at the event are my sole
          responsibility as a participant.
        </p>
        <p>
          <span className="ml-10"></span>I give my permission for the free use
          of my names, photos and voice in any broadcast, telecast, digital,
          print material or any other material in any medium for this event.
        </p>
        <p>
          <span className="ml-10"></span>In consideration of being permitted to
          participate, I do hereby waive and release forever, any and all rights
          to claims and damages I may have against the race organizers,
          sponsors, volunteers, race officials, and all parties involved with
          this event, arising from any and all liability for injury, death or
          damages or any other claims, demands, losses or damages incurred by me
          in connection with my participation in this event.
        </p>
        <p>
          <span className="ml-10"></span>I agree to abide by any decision of the
          race official relative to any aspect of my participation in this
          event. I attest that I have read the rules of the race, understood it
          and agree to abide by them.
        </p>
        <p>
          Participants Signature: _____________________ (parents must sign if
          participant is below 18 years old)
        </p>
        <p>
          In case of emergency, contact:{" "}
          <span className="underline">
            {emergencyContact ? emergencyContact : "_____________________"}
          </span>{" "}
        </p>
        <p>
          Contact No.:{" "}
          <span className="underline">
            {emergencyContactNumber
              ? emergencyContactNumber
              : "_____________________"}
          </span>
        </p>

        <button
          onClick={() => {
            return null;
          }}
          className="col-span-2 rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5]"
        >
          Accept Race Agreement
        </button>
      </div>
    </>
  );
};

export default Waiver;
