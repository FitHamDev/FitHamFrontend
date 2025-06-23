type Props = {
    images: string[];
}


const CarrouselSponserItem: React.FC<Props> = ({ images }) => {
  const image = images[0];
  return (
    <div className="relative h-[27rem] w-[55%] flex flex-col items-center justify-center rounded-lg shadow-lg overflow-hidden bg-white/70">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-blue-500/60 to-blue-900/80 z-0"></div>
      <div className="absolute inset-0 bg-[url('/carrousel_item_pattern.png')] bg-cover bg-center opacity-[8%] z-10"></div>
      <div className="absolute flex flex-col items-center justify-center h-full w-full z-50 text-center">
        <img
          src={image}
          alt="Sponsor"
          className="object-contain max-h-[60%] max-w-[80%] min-w-[45rem] m-auto drop-shadow-lg"
        />
      </div>
    </div>
  );
}

export default CarrouselSponserItem;