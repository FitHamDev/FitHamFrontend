import React from "react";
import { Wedstrijd, Rangschikking } from "../../utils/types";
import { useRouter } from 'next/router';
import RangschikkingTable from "./rangschikking";

// Helper to parse dd/mm/yyyy to Date
function parseDDMMYYYY(dateStr: string) {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

type Props = {
  wedstrijd: Wedstrijd;
  rangschikking: Rangschikking[];
};

const CarrouselMatchItem: React.FC<Props> = ({ wedstrijd, rangschikking }) => { 
  const parsedDate = parseDDMMYYYY(wedstrijd.datum);
  const { basePath } = useRouter();

  return (
    <div className="relative min-h-screen w-full flex bg-white/70">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-blue-500/60 to-blue-900/80 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[8%] z-10"
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')` }}
      ></div>
      
      {/* Left side - Match info (smaller) */}
      <div className="relative z-50 w-1/3 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-[1.5rem] font-bold text-white drop-shadow-lg mb-4">{wedstrijd.thuisploeg.replace(/[+-]/g, '')} - {wedstrijd.bezoekersploeg.replace(/[+-]/g, '')}</h2>
        <p className="text-[2.5rem] text-white font-bold drop-shadow-lg mb-4">{wedstrijd.uitslag && wedstrijd.uitslag.trim() !== "" ? wedstrijd.uitslag : "0 - 0"}</p>
        <p className="text-[1.2rem] text-white drop-shadow-lg mb-2">{wedstrijd.reeksnaam && wedstrijd.reeksnaam.trim() !== "" ? wedstrijd.reeksnaam : wedstrijd.reeks}</p>
        <p className="text-[1.2rem] text-white drop-shadow-lg">{parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {wedstrijd.aanvangsuur}</p>
      </div>
      
      {/* Right side - Rangschikking table (larger) */}
      <div className="relative z-50 w-2/3 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <RangschikkingTable 
            rankschikking={rangschikking} 
            thuisploeg={wedstrijd.thuisploeg.replace(/[+-]/g, '')}
            bezoekersploeg={wedstrijd.bezoekersploeg.replace(/[+-]/g, '')}
          />
        </div>
      </div>
    </div>
  );
};

export default CarrouselMatchItem;