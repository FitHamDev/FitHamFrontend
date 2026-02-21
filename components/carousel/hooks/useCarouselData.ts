import { useEffect, useState } from "react";
import { Rangschikking, Wedstrijd } from "../../../utils/types";
import matchService from "../../../service/matchService";
import rangschikkingService from "../../../service/rangschikkingService";
import { filterWedstrijdenThisWeek } from "../../../utils/dateUtils";
import {
  convertVolleyAdminToRanking,
  mapSeriesToVolleyAdmin,
  sortWedstrijdenByDateTime,
} from "../helpers/carouselHelpers";

const PRIMARY_CLUB_ID = "L-0759";
const FALLBACK_CLUB_ID = "L-0715";
const REFRESH_INTERVAL_MS = 300000;

const warmupSponsorImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const image = new Image();
    image.src = url;

    if (typeof image.decode === "function") {
      image.decode().catch(() => undefined);
    }
  });
};

const preloadSponsorLinks = (imageUrls: string[]) => {
  const urlsToPreload = imageUrls.slice(0, 3);

  urlsToPreload.forEach((url) => {
    if (document.head.querySelector(`link[rel=\"preload\"][as=\"image\"][href=\"${url}\"]`)) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Loads sponsor image URLs from the sponsors API endpoint.
 */
export function useSponsorImages(basePath: string): string[] {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const response = await fetch(`${basePath || ""}/api/sponsors`);
        if (response.ok) {
          const filenames: string[] = await response.json();
          const imageUrls = filenames.map((filename) => `${basePath || ""}/sponsors/${filename}`);
          setImages(imageUrls);

          warmupSponsorImages(imageUrls);
          preloadSponsorLinks(imageUrls);
        }
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
      }
    }

    fetchSponsors();
  }, [basePath]);

  return images;
}

/**
 * Loads and sorts this week's matches by kickoff date/time.
 */
export function useSortedMatches(): Wedstrijd[] {
  const [matches, setMatches] = useState<Wedstrijd[]>([]);

  useEffect(() => {
    async function fetchWedstrijden() {
      try {
        const response = await matchService.getWedstrijdenByStamnummer(PRIMARY_CLUB_ID);
        const data = await response.json();
        const allMatches = (data.data || []).slice();
        const thisWeekMatches = filterWedstrijdenThisWeek(allMatches);
        setMatches(sortWedstrijdenByDateTime(thisWeekMatches));
      } catch (error) {
        console.error("Error fetching wedstrijden:", error);
      }
    }

    fetchWedstrijden();
    const interval = setInterval(fetchWedstrijden, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return matches;
}

/**
 * Caches ranking data per series code and refreshes it on an interval.
 */
export function useRankingsCache(matches: Wedstrijd[]): Record<string, Rangschikking[]> {
  const [cache, setCache] = useState<Record<string, Rangschikking[]>>({});

  useEffect(() => {
    if (matches.length === 0) return;

    const uniqueReeks = Array.from(new Set(matches.map((match) => match.reeks).filter(Boolean)));

    const fetchReeksData = async (reeks: string): Promise<Rangschikking[]> => {
      const tryFetch = async (stamnummer: string): Promise<Rangschikking[] | null> => {
        try {
          const mapped = mapSeriesToVolleyAdmin(reeks);
          const data = await rangschikkingService.getRangschikkingFromVolleyAdmin(mapped, stamnummer);
          if (data?.rangschikking?.length) return convertVolleyAdminToRanking(data.rangschikking);
        } catch {}

        if (mapSeriesToVolleyAdmin(reeks) !== reeks) {
          try {
            const data = await rangschikkingService.getRangschikkingFromVolleyAdmin(reeks, stamnummer);
            if (data?.rangschikking?.length) return convertVolleyAdminToRanking(data.rangschikking);
          } catch {}
        }

        try {
          const data = await rangschikkingService.getRangschikkingByReeks(reeks, stamnummer);
          if (data?.rangschikking?.length) return convertVolleyAdminToRanking(data.rangschikking);
        } catch {}

        return null;
      };

      let result = await tryFetch(PRIMARY_CLUB_ID);
      if (!result || result.length === 0) {
        result = await tryFetch(FALLBACK_CLUB_ID);
      }

      return result || [];
    };

    let cancelled = false;

    const loadAll = async () => {
      const results: Record<string, Rangschikking[]> = {};
      await Promise.all(
        uniqueReeks.map(async (reeks) => {
          const data = await fetchReeksData(reeks);
          if (data.length > 0) results[reeks] = data;
        })
      );

      if (!cancelled) {
        setCache((previous) => ({ ...previous, ...results }));
      }
    };

    loadAll();

    const interval = setInterval(loadAll, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [matches]);

  return cache;
}
