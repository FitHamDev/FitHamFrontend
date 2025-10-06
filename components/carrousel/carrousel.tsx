
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/router';
import CarrouselMatchItem from "./carrouselMatchItem";
import CarrouselSponserItem from "./carrouselSponserItem";
import { Rangschikking, Wedstrijd, VolleyAdminRangschikking } from "../../utils/types";
import matchService from "../../service/matchService";
import rangschikkingService from "../../service/rangschikkingService";
import { filterWedstrijdenThisWeek } from "../../utils/dateUtils";

// --- Custom hooks for fetching and mapping logic ---
function useSponsorImages(basePath: string) {
  const sponsorFilenames = [
    "algorythm_group.png", "alpaca_pachmana.jpg", "apotheek_wim.jpeg", "asbeter.png", "aveve.jpeg",
    "belfius.jpeg", "bnp_paribas_fortis.jpeg", "cafea.jpeg", "camps.jpeg", "catronics.png", "deferm.png",
    "dryking.png", "enona.jpeg", "eurorepar.jpeg", "forigi.jpeg", "frituur_kristel.svg", "g&s_cooling.png",
    "getax.jpeg", "hermosa.jpg", "imagie.jpeg", "interieurhuis_gerda.jpeg", "iverans_fietscafé.png",
    "jacobsmode.jpeg", "jos_beckx.jpeg", "matimmo.png", "mobifrit.webp", "mozaver.jpeg", "peugeot.jpeg",
    "plm_services.jpeg", "ren_tessenderlo.jpeg", "ronnie_en_zoon.jpeg", "schilderwerken_vds.png",
    "silverfish.jpeg", "tennisclub_ham.jpeg", "tuinwerken_beyens.jpeg", "uva_doro.png", "vicus.jpeg",
    "vrijsens.png", "vyanova.jpg", "wijckmans.jpeg", "wilfried_geukens.jpeg", "willems.jpeg"
  ];
  return sponsorFilenames.map(filename => `${basePath}/sponsors/${filename}`);
}

function useSortedWedstrijden() {
  const [wedstrijden, setWedstrijden] = useState<Wedstrijd[]>([]);
  useEffect(() => {
    async function fetchWedstrijden() {
      try {
        const response = await matchService.getWedstrijdenByStamnummer("L-0759");
        const data = await response.json();
        const allWedstrijden = (data.data || []).slice();
        const thisWeekWedstrijden = filterWedstrijdenThisWeek(allWedstrijden);
        thisWeekWedstrijden.sort((a, b) => {
          const [dayA, monthA, yearA] = a.datum.split("/");
          const [dayB, monthB, yearB] = b.datum.split("/");
          const dateA = new Date(`${yearA}-${monthA}-${dayA}T${a.aanvangsuur}`);
          const dateB = new Date(`${yearB}-${monthB}-${dayB}T${b.aanvangsuur}`);
          return dateA.getTime() - dateB.getTime();
        });
        setWedstrijden(thisWeekWedstrijden);
      } catch (error) {
        console.error("Error fetching wedstrijden:", error);
      }
    }
    fetchWedstrijden();
  }, []);
  return wedstrijden;
}

function useRangschikking(currentReeks: string | null) {
  const [rangschikking, setRangschikking] = useState<Rangschikking[]>([]);
  useEffect(() => {
    if (!currentReeks) return;
    let cancelled = false;
    async function fetchRangschikking() {
      // Map reeks codes for VolleyAdmin
      const mapReeksToVolleyAdmin = (reeks: string): string => {
        const mapping: Record<string, string> = {
          'VDP2-B': 'LDM1',
          'VDP4-B': 'LDM2',
        };
        return mapping[reeks] || reeks;
      };
      const convertVolleyAdminToRangschikking = (data: VolleyAdminRangschikking[]): Rangschikking[] =>
        data.map(team => ({
          volgorde: team.volgorde,
          ploegnaam: team.ploegnaam.replace(/[+-]/g, ''),
          puntentotaal: team.puntentotaal,
          isVCM: team.ploegnaam.toLowerCase().includes('ham') ||
            team.ploegnaam.toLowerCase().includes('vbc') ||
            team.ploegnaam.toLowerCase().includes('fit') 
        }));
      try {
        const mappedReeks = mapReeksToVolleyAdmin(currentReeks!);
        const volleyAdminData = await rangschikkingService.getRangschikkingFromVolleyAdmin(mappedReeks, "L-0759");
        if (volleyAdminData && volleyAdminData.rangschikking && volleyAdminData.rangschikking.length > 0) {
          if (!cancelled) setRangschikking(convertVolleyAdminToRangschikking(volleyAdminData.rangschikking));
          return;
        }
      } catch {}
      try {
        const volleyAdminData = await rangschikkingService.getRangschikkingFromVolleyAdmin(currentReeks!, "L-0759");
        if (volleyAdminData && volleyAdminData.rangschikking && volleyAdminData.rangschikking.length > 0) {
          if (!cancelled) setRangschikking(convertVolleyAdminToRangschikking(volleyAdminData.rangschikking));
          return;
        }
      } catch {}
      try {
        const response = await rangschikkingService.getRangschikkingByReeks(currentReeks!, "L-0759");
        if (response.success && response.data) {
          if (!cancelled) setRangschikking(response.data);
        }
      } catch {}
    }
    fetchRangschikking();
    return () => { cancelled = true; };
  }, [currentReeks]);
  return rangschikking;
}

const Carrousel: React.FC = () => {
  const { basePath } = useRouter();
  const sponsorImages = useSponsorImages(basePath);
  const wedstrijden = useSortedWedstrijden();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentReeks, setCurrentReeks] = useState<string | null>(null);
  const rangschikking = useRangschikking(currentReeks);

  // Compose carousel items (alternating match/sponsor)
  const carouselItems = useMemo(() => {
    const total = Math.max(wedstrijden.length, sponsorImages.length) * 2;
    return Array.from({ length: total }, (_, i) => {
      if (i % 2 === 0 && wedstrijden.length > 0) {
        const match = wedstrijden[(i / 2) % wedstrijden.length];
        if (match) return { type: 'match', data: match };
      } else if (sponsorImages.length > 0) {
        const sponsor = sponsorImages[Math.floor(i / 2) % sponsorImages.length];
        if (sponsor) return { type: 'sponsor', data: sponsor };
      }
      return null;
    }).filter(Boolean) as { type: string; data: any }[];
  }, [wedstrijden, sponsorImages]);

  // Update current reeks when match changes
  useEffect(() => {
    if (carouselItems.length > 0 && carouselItems[carouselIndex]?.type === 'match') {
      const match = carouselItems[carouselIndex].data as Wedstrijd;
      if (match.reeks && match.reeks !== currentReeks) {
        setCurrentReeks(match.reeks);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselIndex, carouselItems]);

  // Auto-advance carousel
  useEffect(() => {
  if (carouselItems.length === 0) return;

  const currentItem = carouselItems[carouselIndex];
  const delay = currentItem?.type === "sponsor" ? 5000 : 10000; 

  const timeout = setTimeout(() => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  }, delay);

  return () => clearTimeout(timeout);
}, [carouselIndex, carouselItems]);

  return (
    <div className="min-h-screen w-full">
      {carouselItems.length > 0 && carouselItems[carouselIndex] != null && (
        <div className="w-full h-full">
          {carouselItems[carouselIndex]?.type === 'match' && typeof carouselItems[carouselIndex]?.data !== 'string' ? (
            <CarrouselMatchItem wedstrijd={carouselItems[carouselIndex]?.data as Wedstrijd} rangschikking={rangschikking} />
          ) : null}
          {carouselItems[carouselIndex]?.type === 'sponsor' && typeof carouselItems[carouselIndex]?.data === 'string' ? (
            <CarrouselSponserItem images={[carouselItems[carouselIndex]?.data as string]} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Carrousel;