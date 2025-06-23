import React from "react";
import { Wedstrijd } from "../../utils/types";
import { useRouter } from 'next/router';

// Helper to parse dd/mm/yyyy to Date
function parseDDMMYYYY(dateStr: string) {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

type Props = {
  wedstrijd: Wedstrijd;
};

const CarrouselMatchItem: React.FC<Props> = ({ wedstrijd }) => { 
  const parsedDate = parseDDMMYYYY(wedstrijd.datum);
  const { basePath } = useRouter();
  return (
    <div className="relative h-[27rem] w-[55%] flex flex-col items-center justify-center rounded-lg shadow-lg overflow-hidden bg-white/70">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-blue-500/60 to-blue-900/80 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[8%] z-10"
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')` }}
      ></div>
      <div className="absolute flex flex-col items-center justify-start h-full w-full z-50 text-center">
        <h2 className="text-[2rem] font-bold text-white drop-shadow-lg mt-[4rem] w-full">{wedstrijd.thuisploeg} - {wedstrijd.bezoekersploeg}</h2>
        <p className="text-[4rem] mt-[1rem] text-white font-bold drop-shadow-lg w-full">{wedstrijd.uitslag && wedstrijd.uitslag.trim() !== "" ? wedstrijd.uitslag : "0 - 0"}</p>
        <p className="text-[1.5rem] mt-[3rem] text-white drop-shadow-lg w-full">{wedstrijd.reeksnaam && wedstrijd.reeksnaam.trim() !== "" ? wedstrijd.reeksnaam : wedstrijd.reeks}</p>
        <p className="text-[1.5rem] mt-[1rem] text-white drop-shadow-lg w-full">{parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {wedstrijd.aanvangsuur}</p>
      </div>
    </div>
  );
};

export default CarrouselMatchItem;