import type { DevelopmentDetailData } from "@/lib/types";

export const mockDevelopments: DevelopmentDetailData[] = [
  {
    id: "1",
    name: "Dubai Creek Harbour",
    slug: "dubai-creek-harbour",
    description:
      "A master-planned community by Emaar and Dubai Holding, featuring waterfront living, retail, and green spaces along Dubai Creek. Dubai Creek Harbour is a 6 km² waterfront development that promises to redefine urban living with its mix of residential, commercial, and hospitality spaces, all centred around the stunning Dubai Creek.",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-58545e4e1c0c?w=800&h=600&fit=crop",
    ],
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "garden", "spa", "sea_view",
    ],
    location: "UAE, Dubai, Dubai Creek",
    startingPrice: 1200000,
    startingPriceCurrency: "AED",
    propertyTypes: ["Apartment", "Penthouse", "Townhouse"],
    totalArea: 6000000,
    developerName: "Emaar Properties",
    developerSlug: "emaar-properties",
    developerLogo:
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
  },
  {
    id: "2",
    name: "Palm Jumeirah",
    slug: "palm-jumeirah",
    description:
      "The iconic man-made island by Nakheel, home to luxury villas, hotels, and beachfront residences. Palm Jumeirah is one of the most recognisable landmarks in the world, offering an unparalleled lifestyle with private beaches, world-class hotels, and exclusive residential communities.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "garden", "spa", "sea_view", "pet_friendly",
    ],
    location: "UAE, Dubai, Palm Jumeirah",
    startingPrice: 5000000,
    startingPriceCurrency: "AED",
    propertyTypes: ["Villa", "Penthouse", "Apartment"],
    totalArea: 5600000,
    developerName: "Nakheel Properties",
    developerSlug: "nakheel-properties",
    developerLogo:
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
  },
];
