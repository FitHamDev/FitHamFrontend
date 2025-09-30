import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import CarrouselMatchItem from "./carrouselMatchItem";
import { Rangschikking, Wedstrijd, VolleyAdminKlassement, VolleyAdminRangschikking } from "../../utils/types";
import matchService from "../../service/matchService";
import CarrouselSponserItem from "./carrouselSponserItem";
import rankschikkingService from "../../service/rangschikkingService";
import { filterWedstrijdenThisWeek } from "../../utils/dateUtils";



const Carrousel: React.FC = ({}) => {
  const [wedstrijden, setWedstrijden] = useState<Wedstrijd[]>([]);
  const [rangsсhikking, setRangschikking] = useState<Rangschikking[]>([]);
  const [volleyAdminRangschikking, setVolleyAdminRangschikking] = useState<VolleyAdminRangschikking[]>([]);
  const [currentReeks, setCurrentReeks] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const { basePath } = useRouter();

  const sponsorImages = [
    "algorythm_group.png",
    "alpaca_pachmana.jpg",
    "apotheek_wim.jpeg",
    "asbeter.png",
    "aveve.jpeg",
    "belfius.jpeg",
    "bnp_paribas_fortis.jpeg",
    "cafea.jpeg",
    "camps.jpeg",
    "catronics.png",
    "deferm.png",
    "dryking.png",
    "enona.jpeg",
    "eurorepar.jpeg",
    "forigi.jpeg",
    "frituur_kristel.svg",
    "g&s_cooling.png",
    "getax.jpeg",
    "hermosa.jpg",
    "imagie.jpeg",
    "interieurhuis_gerda.jpeg",
    "iverans_fietscafé.png",
    "jacobsmode.jpeg",
    "jos_beckx.jpeg",
    "matimmo.png",
    "mobifrit.webp",
    "mozaver.jpeg",
    "peugeot.jpeg",
    "plm_services.jpeg",
    "ren_tessenderlo.jpeg",
    "ronnie_en_zoon.jpeg",
    "schilderwerken_vds.png",
    "silverfish.jpeg",
    "tennisclub_ham.jpeg",
    "tuinwerken_beyens.jpeg",
    "uva_doro.png",
    "vicus.jpeg",
    "vrijsens.png",
    "vyanova.jpg",
    "wijckmans.jpeg",
    "wilfried_geukens.jpeg",
    "willems.jpeg"
  ].map(filename => `${basePath}/sponsors/${filename}`);

  const sortWedstrijden = (wedstrijden: Wedstrijd[]) => {
    wedstrijden.sort((a:Wedstrijd, b:Wedstrijd) => {
      const [dayA, monthA, yearA] = a.datum.split("/");
      const [dayB, monthB, yearB] = b.datum.split("/");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}T${a.aanvangsuur}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}T${b.aanvangsuur}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const fetchWedstrijden = async () => {
      try {
        const response = await matchService.getWedstrijdenByStamnummer("L-0759");
        const data = await response.json();

        const allWedstrijden = (data.data || []).slice();
        const thisWeekWedstrijden = filterWedstrijdenThisWeek(allWedstrijden);

        sortWedstrijden(thisWeekWedstrijden);
        setWedstrijden(thisWeekWedstrijden);
      } catch (error) {
        console.error("Error fetching wedstrijden:", error);
      }
    };

  // Convert VolleyAdmin data to the format expected by the component
  const convertVolleyAdminToRangschikking = (volleyAdminData: VolleyAdminRangschikking[]): Rangschikking[] => {
    return volleyAdminData.map(team => ({
      volgorde: team.volgorde,
      ploegnaam: team.ploegnaam.replace(/[+-]/g, ''),
      puntentotaal: team.puntentotaal,
      isVCM: team.ploegnaam.toLowerCase().includes('ham')
    }));
  };

  // Map reeks codes from matches to VolleyAdmin API reeks codes
  const mapReeksToVolleyAdmin = (reeks: string): string => {
    // Common mappings based on the test page examples
    const reeksMapping: { [key: string]: string } = {
      // Add known mappings here - you may need to adjust these based on actual data
      'VDP2-B': 'LDM1', // Example: Dames A -> LDM1
      'VDP4-B': 'LDM2', // Example: Dames B -> LDM2  
      // Add more mappings as needed
    };
    
    // Return mapped reeks or original if no mapping found
    return reeksMapping[reeks] || reeks;
  };

  const fetchRangschikking = async (reeks: string) => {
    console.log("Fetching rangschikking for reeks:", reeks);
    
    // Try with the mapped reeks code first
    const mappedReeks = mapReeksToVolleyAdmin(reeks);
    console.log("Mapped reeks:", mappedReeks);
    
    try {
      // Use VolleyAdmin API like in the test page
      const volleyAdminData = await rankschikkingService.getRangschikkingFromVolleyAdmin(mappedReeks, "L-0759");
      
      if (volleyAdminData && volleyAdminData.rangschikking && volleyAdminData.rangschikking.length > 0) {
        console.log("Successfully fetched VolleyAdmin data:", volleyAdminData.rangschikking.length, "teams");
        setVolleyAdminRangschikking(volleyAdminData.rangschikking);
        // Convert to the format expected by the existing components
        const convertedData = convertVolleyAdminToRangschikking(volleyAdminData.rangschikking);
        setRangschikking(convertedData);
        return; // Success, no need to try other approaches
      } else {
        console.log("No rangschikking data received from VolleyAdmin for mapped reeks");
      }
    } catch (error) {
      console.error("Error fetching rangschikking from VolleyAdmin with mapped reeks:", error);
    }
    
    // If mapped reeks failed, try with original reeks
    if (mappedReeks !== reeks) {
      try {
        console.log("Trying VolleyAdmin with original reeks:", reeks);
        const volleyAdminData = await rankschikkingService.getRangschikkingFromVolleyAdmin(reeks, "L-0759");
        
        if (volleyAdminData && volleyAdminData.rangschikking && volleyAdminData.rangschikking.length > 0) {
          console.log("Successfully fetched VolleyAdmin data with original reeks:", volleyAdminData.rangschikking.length, "teams");
          setVolleyAdminRangschikking(volleyAdminData.rangschikking);
          const convertedData = convertVolleyAdminToRangschikking(volleyAdminData.rangschikking);
          setRangschikking(convertedData);
          return;
        }
      } catch (error) {
        console.error("Error fetching rangschikking from VolleyAdmin with original reeks:", error);
      }
    }
    
    // Fallback: try the old API
    try {
      console.log("Trying fallback API for reeks:", reeks);
      const response = await rankschikkingService.getRangschikkingByReeks(reeks, "L-0759");
      if (response.success && response.data) {
        console.log("Fallback API successful:", response.data.length, "teams");
        setRangschikking(response.data);
      } else {
        console.log("Fallback API returned no data");
      }
    } catch (fallbackError) {
      console.error("Fallback API also failed:", fallbackError);
    }
  };

  // continiously loop through matches and sponsors
  const totalItems = Math.max(wedstrijden.length, sponsorImages.length) * 2;
  const carouselItems = Array.from({ length: totalItems }, (_, i) => {
    if (i % 2 === 0 && wedstrijden.length > 0) {
      // Even index: match
      const match = wedstrijden[(i / 2) % wedstrijden.length];
      if (match) return { type: 'match', data: match };
    } else if (sponsorImages.length > 0) {
      // Odd index: sponsor
      const sponsor = sponsorImages[Math.floor(i / 2) % sponsorImages.length];
      if (sponsor) return { type: 'sponsor', data: sponsor };
    }
    // fallback: skip if no data
    return null;
  }).filter((item): item is { type: string; data: any } => item !== null && item !== undefined);

  useEffect(() => {
    fetchWedstrijden();
  }, []);

  // Fetch ranking when the current match changes
  useEffect(() => {
    if (carouselItems.length > 0 && carouselItems[index]?.type === 'match') {
      const match = carouselItems[index].data as Wedstrijd;
      if (match.reeks && match.reeks !== currentReeks) {
        setCurrentReeks(match.reeks);
        fetchRangschikking(match.reeks);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, carouselItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % (carouselItems.length || 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div className="min-h-screen w-full">
      {carouselItems.length > 0 && carouselItems[index] != null && (
        <div className="w-full h-full">
          {carouselItems[index]?.type === 'match' && typeof carouselItems[index]?.data !== 'string' ? (
            <CarrouselMatchItem wedstrijd={carouselItems[index]?.data as Wedstrijd} rangschikking={rangsсhikking} />
          ) : null}
          {carouselItems[index]?.type === 'sponsor' && typeof carouselItems[index]?.data === 'string' ? (
            <CarrouselSponserItem images={[carouselItems[index]?.data as string]} />
          ) : null}
        </div>
      )}
    </div>

    );
}

export default Carrousel;