import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import CarrouselMatchItem from "./carrouselMatchItem";
import { Wedstrijd } from "../../utils/types";
import matchService from "../../service/matchService";
import CarrouselSponserItem from "./carrouselSponserItem";



const Carrousel: React.FC = ({}) => {
  const [wedstrijden, setWedstrijden] = useState<Wedstrijd[]>([]);
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

  useEffect(() => {
    const fetchWedstrijden = async () => {
      try {
        const response = await matchService.getWedstrijdenByStamnummer("L-0759");
        const data = await response.json();

        const wedstrijden = (data.data || []).slice();

        sortWedstrijden(wedstrijden);
        setWedstrijden(wedstrijden);
      } catch (error) {
        console.error("Error fetching wedstrijden:", error);
      }
    };
    fetchWedstrijden();
  }, []);

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
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % (carouselItems.length || 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div>
      {carouselItems.length > 0 && carouselItems[index] != null && (
        <div className="m-auto w-full h-full flex justify-center items-center">
          {carouselItems[index]?.type === 'match' && typeof carouselItems[index]?.data !== 'string' ? (
            <CarrouselMatchItem wedstrijd={carouselItems[index]?.data as Wedstrijd} />
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