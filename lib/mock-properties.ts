import type { PropertyData } from "@/lib/types";

export const mockProperties: PropertyData[] = [
  {
    id: "1",
    slug: "2-bedroom-apartment-torch-tower-dubai-marina",
    title: "2 bedroom apartment Torch Tower, Dubai Marina",
    description: "2 bedroom apartment Torch Tower, Dubai Marina.",
    descriptionFull:
      "Off Plan is proud to present this spacious and fully upgraded 2 bedroom, 2 bathroom apartment in the very popular community, Torch Tower, Dubai Marina. The apartment offers an open plan living, dining and kitchen space, perfect for entertaining friends and family. This is accompanied by 2 large bedrooms that include an ensuite bathroom, plenty of built-in wardrobes/storage and a generous balcony that overlooks the marina community. Residents can enjoy a vast array of retail, coffee shops and multi cuisine restaurants on the Marina Promenade/Mall directly from the rear of the complex. You are also within walking distance to the famous JBR Walk/ Beach and marina metro where there is easy connectivity to other great communities in Dubai.",
    category: "Apartment",
    subcategory: "Apartment",
    beds: 2,
    baths: 2,
    area: 1258,
    currency: "AED",
    price: 2250000,
    location: {
      country: "UAE",
      city: "Dubai",
      community: "Dubai Marina",
    },
    developer: {
      name: "Off Plan International",
      slug: "off-plan-international",
      logo: "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
    },
    development: {
      name: "SERA 2 - Townhouses",
      slug: "sera-2-townhouses",
      totalArea: 1133555,
      amenities: [
        "pool", "gym", "security", "concierge", "garden",
      ],
    },
    community: {
      name: "Dubai Marina",
      slug: "dubai-marina",
      totalArea: 1133555,
      description:
        "Dubai Marina is one of the most popular residential districts, known for its vibrant waterfront lifestyle, luxury towers, and yachting culture. This area offers strong rental returns, making it a top choice for investors.",
    },
    images: [
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4052de538431ee07e51_lisa-anna-HQ7NEiRj9So-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e5e2fc954ebe89d35d_abdul-raheem-kannath-VG8ei9adxlQ-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e5b685f609419c4255_gerda-kauks-KYM5QsbRsxk-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e51331d5416cddaedf_zac-gudakov-EKUtjWUtPC0-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e4ec7aacc33f10bafc_zac-gudakov-hNKl4PQNVNo-unsplash.jpg",
    ],
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "garden", "balcony", "spa",
    ],
    status: "planned",
    handoverDate: "Q2 - 2025",
    addedOn: "February 10, 2026",
    tags: ["Family", "Highway", "Gym"],
    paymentPlan: {
      length: "2–4 years",
      depositPercentage: "10–20%",
      depositValue: "AED 100,000–200,000",
      description:
        "10% on booking / 10–15% every 6–9 months / 20–40% at handover.",
    },
    phone: "+1-555-345-6789",
    whatsapp: "+15553456789",
  },
  {
    id: "2",
    slug: "3-bedroom-villa-palm-jumeirah",
    title: "3 bedroom villa Palm Jumeirah",
    description: "Stunning 3 bedroom villa with private pool and garden on Palm Jumeirah.",
    descriptionFull:
      "Discover luxury living at its finest in this stunning 3-bedroom villa on the iconic Palm Jumeirah. This meticulously designed villa offers spacious living areas, a private pool, and lush garden spaces perfect for family living and entertaining. The open-plan layout connects the living, dining, and kitchen areas seamlessly, while large windows flood the space with natural light and offer breathtaking views of the Dubai skyline and Arabian Gulf. Each bedroom features an en-suite bathroom and built-in wardrobes. The master suite includes a private terrace overlooking the sea. Residents enjoy access to world-class amenities including private beach access, multiple swimming pools, a fully equipped gym, and 24/7 concierge service.",
    category: "Villa",
    subcategory: "Villa",
    beds: 3,
    baths: 4,
    area: 3200,
    currency: "AED",
    price: 8500000,
    location: {
      country: "UAE",
      city: "Dubai",
      community: "Palm Jumeirah",
    },
    developer: {
      name: "Arada Developments",
      slug: "arada-developments",
      logo: "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
    },
    development: {
      name: "Palm Crescent",
      slug: "palm-crescent",
      totalArea: 2500000,
      amenities: [
        "pool", "gym", "security", "concierge", "sea_view",
      ],
    },
    community: {
      name: "Palm Jumeirah",
      slug: "palm-jumeirah",
      totalArea: 5600000,
      description:
        "Palm Jumeirah is an iconic artificial archipelago and one of Dubai's most prestigious residential areas. Known for its luxury villas, 5-star hotels, and pristine beaches, it offers an unparalleled lifestyle with stunning sea views and world-class amenities.",
    },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
    ],
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "garden", "spa", "sea_view", "pet_friendly",
    ],
    status: "ready",
    handoverDate: "Q1 - 2024",
    addedOn: "January 15, 2026",
    tags: ["Luxury", "Beachfront", "Family", "Pool"],
    paymentPlan: {
      length: "1–2 years",
      depositPercentage: "20%",
      depositValue: "AED 1,700,000",
      description:
        "20% on booking / 30% during construction / 50% at handover.",
    },
    phone: "+1-555-345-6790",
    whatsapp: "+15553456790",
  },
  {
    id: "3",
    slug: "studio-apartment-business-bay",
    title: "Studio Apartment Business Bay",
    description: "Modern studio apartment in the heart of Business Bay with skyline views.",
    descriptionFull:
      "Modern studio apartment in the heart of Business Bay offering stunning skyline views and premium finishes. This efficiently designed studio features a fully integrated living and sleeping area, a modern kitchen with built-in appliances, and a sleek bathroom. Large floor-to-ceiling windows provide panoramic views of the Dubai skyline and the Dubai Canal. Building amenities include a rooftop swimming pool, state-of-the-art gym, 24/7 security, and concierge service. Located steps away from business districts, fine dining, and retail options, this is the perfect investment opportunity or starter home in one of Dubai's most dynamic neighborhoods.",
    category: "Studio",
    subcategory: "Apartment",
    beds: 1,
    baths: 1,
    area: 520,
    currency: "AED",
    price: 890000,
    location: {
      country: "UAE",
      city: "Dubai",
      community: "Business Bay",
    },
    developer: {
      name: "Mered Developments",
      slug: "mered-developments",
      logo: "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
    },
    development: {
      name: "Bay Central Tower",
      slug: "bay-central-tower",
      totalArea: 850000,
      amenities: [
        "pool", "gym", "security", "concierge",
      ],
    },
    community: {
      name: "Business Bay",
      slug: "business-bay",
      totalArea: 4200000,
      description:
        "Business Bay is Dubai's central business district, featuring a mix of commercial and residential towers along the Dubai Canal. It offers easy access to Downtown Dubai, world-class dining, and vibrant nightlife, making it a popular choice for young professionals and investors.",
    },
    images: [
      "https://images.unsplash.com/photo-1598928506311-58545e4e1c0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop",
    ],
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "smart_home", "sea_view",
    ],
    status: "construction",
    handoverDate: "Q4 - 2026",
    addedOn: "March 1, 2026",
    tags: ["Investment", "Skyline View", "Metro Access"],
    paymentPlan: {
      length: "3 years",
      depositPercentage: "10%",
      depositValue: "AED 89,000",
      description:
        "10% on booking / 40% during construction (10% every 9 months) / 50% at handover.",
    },
    phone: "+1-555-345-6791",
    whatsapp: "+15553456791",
  },
];
