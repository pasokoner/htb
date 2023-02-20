import React, { useState } from "react";

interface Participant {
  name: string;
  id: number;
}

interface Props {
  participants: Participant[];
}

const RaffleDraw: React.FC<Props> = ({ participants }) => {
  const [winner, setWinner] = useState<Participant | null>(null);

  const handleDraw = () => {
    const randomIndex = Math.floor(Math.random() * participants.length);
    setWinner(participants[randomIndex] as Participant);
  };

  return (
    <div>
      <h2>Raffle Draw</h2>
      <button onClick={handleDraw}>Draw winner</button>
      {winner && (
        <p>
          The winner is: {winner.name} (ID: {winner.id})
        </p>
      )}
    </div>
  );
};

export default RaffleDraw;
