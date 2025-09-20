// import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface GigCardProps {
  gig: Gig;
  onApply: (gig: Gig) => void;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onApply }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative w-full h-48">
        {gig.image ? (
          <img
            src={`http://localhost:8000${gig.image}`}
            alt={gig.title}
            layout="fill"
            objectFit="cover"
            className="object-fit"
          />
        ) : (
          <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
              {gig.title}
            </h2>
            <p className="text-sm font-bold text-[#323833] ml-4 bg-green-200 rounded-md p-2">
              KES{gig.price}
            </p>
          </div>
          <p className="text-sm text-gray-500 line-clamp-3 mb-4">
            {gig.description}
          </p>
          {/* We'll remove the location display since the data is not available from the backend */}
          <div className="flex items-center text-gray-400 text-sm">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{gig.location}</span>
          </div>
        </div>
        <button
          onClick={() => onApply(gig)}
          className="w-full bg-[#E5E5E5] text-gray-700 font-semibold py-2 rounded-lg mt-4 transition duration-300 hover:bg-[#D4D4D4]"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default GigCard;
