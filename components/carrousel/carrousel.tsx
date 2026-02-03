
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/router';
import CarrouselMatchItem from "./CarrouselMatchItem";
import CarrouselSponsorItem from "./CarrouselSponsorItem";
import { Rangschikking, Wedstrijd, VolleyAdminRangschikking } from "../../utils/types";
import matchService from "../../service/matchService";
import rangschikkingService from "../../service/rangschikkingService";
import { filterWedstrijdenThisWeek } from "../../utils/dateUtils";

// --- Custom hooks for fetching and mapping logic ---
function useSponsorImages(basePath: string) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const response = await fetch(`${basePath || ''}/api/sponsors`);
        if (response.ok) {
          const filenames: string[] = await response.json();
          setImages(filenames.map(filename => `${basePath || ''}/sponsors/${filename}`));
        }
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
      }
    }
    fetchSponsors();
  }, [basePath]);

  return images;
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
    const interval = setInterval(fetchWedstrijden, 300000);
    return () => clearInterval(interval);
  }, []);
  return wedstrijden;
}

function useRankingsCache(wedstrijden: Wedstrijd[]) {
  const [cache, setCache] = useState<Record<string, Rangschikking[]>>({});

  useEffect(() => {
    if (wedstrijden.length === 0) return;

    // Get unique reeks codes
    const uniqueReeks = Array.from(new Set(wedstrijden.map(w => w.reeks).filter(Boolean)));
    
    // Helper to fetch a single reeks
    const fetchReeksDada = async (reeks: string): Promise<Rangschikking[]> => {
      const mapReeksToVolleyAdmin = (r: string): string => {
        const mapping: Record<string, string> = {
          'VDP2-B': 'LDM1',
          'VDP4-B': 'LDM2',
        };
        return mapping[r] || r;
      };
      
      const convertToRangschikking = (data: VolleyAdminRangschikking[]): Rangschikking[] =>
        data.map(team => ({
          volgorde: team.volgorde,
          ploegnaam: team.ploegnaam.replace(/[+-]/g, ''),
          puntentotaal: team.puntentotaal,
          isVCM: team.ploegnaam.toLowerCase().includes('ham') ||
            team.ploegnaam.toLowerCase().includes('fit') 
        }));

      try {
        const mapped = mapReeksToVolleyAdmin(reeks);
        const data = await rangschikkingService.getRangschikkingFromVolleyAdmin(mapped, "L-0759");
        if (data?.rangschikking?.length) return convertToRangschikking(data.rangschikking);
      } catch {}

      if (mapReeksToVolleyAdmin(reeks) !== reeks) {
        try {
          const data = await rangschikkingService.getRangschikkingFromVolleyAdmin(reeks, "L-0759");
           if (data?.rangschikking?.length) return convertToRangschikking(data.rangschikking);
        } catch {}
      }

      try {
        const data = await rangschikkingService.getRangschikkingByReeks(reeks, "L-0759");
         if (data?.rangschikking?.length) return convertToRangschikking(data.rangschikking);
      } catch {}
      
      return [];
    };

    let cancelled = false;

    // Fetch all in parallel
    const loadAll = async () => {
      const results: Record<string, Rangschikking[]> = {};
      await Promise.all(uniqueReeks.map(async (reeks) => {
        const data = await fetchReeksDada(reeks);
        if (data.length > 0) results[reeks] = data;
      }));
      
      if (!cancelled) {
        setCache(prev => ({ ...prev, ...results }));
      }
    };

    loadAll();

    // Refresh every 5 minutes
    const interval = setInterval(loadAll, 300000);
    return () => { 
      cancelled = true; 
      clearInterval(interval);
    };
  }, [wedstrijden]);

  return cache;
}

const Carrousel: React.FC = () => {
  const { basePath } = useRouter();
  const sponsorImages = useSponsorImages(basePath);
  const wedstrijden = useSortedWedstrijden();
  const rankingsCache = useRankingsCache(wedstrijden);
  const [carouselIndex, setCarouselIndex] = useState(0);

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
      {carouselItems[carouselIndex] && (
        <div className="w-full h-full">
          {carouselItems[carouselIndex].type === 'match' ? (
            <CarrouselMatchItem 
              wedstrijd={carouselItems[carouselIndex].data as Wedstrijd} 
              rangschikking={rankingsCache[(carouselItems[carouselIndex].data as Wedstrijd).reeks]} 
            />
          ) : (
            <CarrouselSponsorItem 
              images={[carouselItems[carouselIndex].data as string]} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Carrousel;