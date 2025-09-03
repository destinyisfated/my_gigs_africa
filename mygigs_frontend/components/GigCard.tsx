import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define gig data structure
interface GigCardProps {
  id: number;
  title: string;
  price: number | string; // Updated to accept a string or number
  description: string;
  location: string;
  imageUrl: string;
}

const getGigTypeLabel = (gigType: string) => {
  const types: Record<string, string> = {
    WEB_DEV: "Web Development",
    MOBILE_DEV: "Mobile App Dev",
    GRAPHIC_DESIGN: "Graphic Design",
    WRITING: "Content Writing",
    VIDEO_EDITING: "Video Editing",
    OTHER: "Other",
  };
  return types[gigType] || "Unknown";
};

export function GigCard({
  id,
  title,
  price,
  description,
  location,
  imageUrl,
}: GigCardProps) {
  // Convert the price to a number to use toLocaleString()
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return (
    <Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center rounded-t-xl">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {title}
          </h3>
          <Badge className="bg-blue-600 text-white font-bold py-1 px-3">
            {numericPrice ? `Ksh ${numericPrice.toLocaleString()}` : "Ksh 0"}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
          <span>{location}</span>
        </div>
        <Button
          asChild
          className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
        >
          <Link href={`/gigs/${id}`}>Apply Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
