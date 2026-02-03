import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

type Props = {
    images: string[];
}


const CarrouselSponsorItem: React.FC<Props> = ({ images }) => {
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
        <div className="relative h-[75%] w-[90%]">
          <Image
            src={image}
            alt="Sponsor"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default CarrouselSponsorItem;