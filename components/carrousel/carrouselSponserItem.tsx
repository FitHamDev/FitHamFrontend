import { useRouter } from "next/router";

type Props = {
    images: string[];
}


const CarrouselSponserItem: React.FC<Props> = ({ images }) => {
  const image = images[0];
  const { basePath } = useRouter();
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white/70">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-blue-500/60 to-blue-900/80 z-0"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[8%] z-10"
        style={{ backgroundImage: `url('${basePath}/carrousel_item_pattern.png')` }}
      ></div>
      <div className="absolute flex flex-col items-center justify-center h-full w-full z-50 text-center">
        <img
          src={image}
          alt="Sponsor"
          className="object-contain max-h-[60%] max-w-[80%] drop-shadow-lg"
        />
      </div>
    </div>
  );
}

export default CarrouselSponserItem;