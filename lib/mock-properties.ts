import type { PropertyData } from "@/lib/types";

export const mockProperties: PropertyData[] = [
  {
    id: "1",
    slug: "2-bedroom-apartment-torch-tower-dubai-marina",
    title: "2 bedroom apartment Torch Tower, Dubai Marina",
    description: "2 bedroom apartment Torch Tower, Dubai Marina.",
    descriptionFull:
      "Off Plan is proud to present this spacious and fully upgraded 2 bedroom, 2 bathroom apartment in the very popular community, Torch Tower, Dubai Marina. The apartment offers an open plan living, dining and kitchen space, perfect for entertaining friends and family. This is accompanied by 2 large bedrooms that include an ensuite bathroom, plenty of built-in wardrobes/storage and a generous balcony that overlooks the marina community. Residents can enjoy a vast array of retail, coffee shops and multi cuisine restaurants on the Marina Promenade/Mall directly from the rear of the complex. You are also within walking distance to the famous JBR Walk/ Beach and marina metro where there is easy connectivity to other great communities in Dubai.",

    listed_by_id: "user-1",
    listed_by_type: "developer",
    developer_id: "dev-1",
    development_id: "devt-1",

    status: "available",
    country: "UAE",
    city: "Dubai",
    community: "Dubai Marina",
    address: null,

    property_type: "apartment",
    category: "Apartment",
    subcategory: "Apartment",
    beds: 2,
    baths: 2,
    area: 1258,
    area_sqft: 1258,
    area_sqm: 116.9,
    floor: 15,
    has_balcony: true,
    has_garden: false,

    price: 2250000,
    currency: "AED",
    deposit_percentage: 10,
    deposit_amount: 225000,

    has_post_handover: true,
    handover_date: "2025-06-30",
    handoverDate: "Q2 - 2025",
    payment_plan_months: 36,

    images: [
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4052de538431ee07e51_lisa-anna-HQ7NEiRj9So-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e5e2fc954ebe89d35d_abdul-raheem-kannath-VG8ei9adxlQ-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e5b685f609419c4255_gerda-kauks-KYM5QsbRsxk-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e51331d5416cddaedf_zac-gudakov-EKUtjWUtPC0-unsplash.jpg",
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4e4ec7aacc33f10bafc_zac-gudakov-hNKl4PQNVNo-unsplash.jpg",
    ],
    cover_image:
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa4052de538431ee07e51_lisa-anna-HQ7NEiRj9So-unsplash.jpg",
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "garden", "balcony", "spa",
    ],
    tags: ["Family", "Highway", "Gym"],

    is_featured: true,
    is_active: true,
    addedOn: "February 10, 2026",
    created_at: "2026-02-10T00:00:00Z",
    updated_at: "2026-02-10T00:00:00Z",

    developer_name: "Off Plan International",
    developer_slug: "off-plan-international",
    developer_logo:
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
    development_name: "SERA 2 - Townhouses",
    development_slug: "sera-2-townhouses",
    development_total_area: 1133555,
    development_amenities: [
      "pool", "gym", "security", "concierge", "garden",
    ],
    community_name: "Dubai Marina",
    community_slug: "dubai-marina",
    community_total_area: 1133555,
    community_description:
      "Dubai Marina is one of the most popular residential districts, known for its vibrant waterfront lifestyle, luxury towers, and yachting culture. This area offers strong rental returns, making it a top choice for investors.",

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

    listed_by_id: "user-2",
    listed_by_type: "developer",
    developer_id: "dev-2",
    development_id: "devt-2",

    status: "available",
    country: "UAE",
    city: "Dubai",
    community: "Palm Jumeirah",
    address: null,

    property_type: "villa",
    category: "Villa",
    subcategory: "Villa",
    beds: 3,
    baths: 4,
    area: 3200,
    area_sqft: 3200,
    area_sqm: 297.3,
    floor: null,
    has_balcony: true,
    has_garden: true,

    price: 8500000,
    currency: "AED",
    deposit_percentage: 20,
    deposit_amount: 1700000,

    has_post_handover: false,
    handover_date: "2024-03-31",
    handoverDate: "Q1 - 2024",
    payment_plan_months: 24,

    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "garden", "spa", "sea_view", "pet_friendly",
    ],
    tags: ["Luxury", "Beachfront", "Family", "Pool"],

    is_featured: false,
    is_active: true,
    addedOn: "January 15, 2026",
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",

    developer_name: "Arada Developments",
    developer_slug: "arada-developments",
    developer_logo:
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
    development_name: "Palm Crescent",
    development_slug: "palm-crescent",
    development_total_area: 2500000,
    development_amenities: [
      "pool", "gym", "security", "concierge", "sea_view",
    ],
    community_name: "Palm Jumeirah",
    community_slug: "palm-jumeirah",
    community_total_area: 5600000,
    community_description:
      "Palm Jumeirah is an iconic artificial archipelago and one of Dubai's most prestigious residential areas. Known for its luxury villas, 5-star hotels, and pristine beaches, it offers an unparalleled lifestyle with stunning sea views and world-class amenities.",

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

    listed_by_id: "user-3",
    listed_by_type: "developer",
    developer_id: "dev-3",
    development_id: "devt-3",

    status: "available",
    country: "UAE",
    city: "Dubai",
    community: "Business Bay",
    address: null,

    property_type: "apartment",
    category: "Studio",
    subcategory: "Apartment",
    beds: 1,
    baths: 1,
    area: 520,
    area_sqft: 520,
    area_sqm: 48.3,
    floor: 22,
    has_balcony: false,
    has_garden: false,

    price: 890000,
    currency: "AED",
    deposit_percentage: 10,
    deposit_amount: 89000,

    has_post_handover: true,
    handover_date: "2026-12-31",
    handoverDate: "Q4 - 2026",
    payment_plan_months: 36,

    images: [
      "https://images.unsplash.com/photo-1598928506311-58545e4e1c0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1598928506311-58545e4e1c0c?w=800&h=600&fit=crop",
    amenities: [
      "pool", "gym", "parking", "security", "concierge",
      "smart_home", "sea_view",
    ],
    tags: ["Investment", "Skyline View", "Metro Access"],

    is_featured: false,
    is_active: true,
    addedOn: "March 1, 2026",
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",

    developer_name: "Mered Developments",
    developer_slug: "mered-developments",
    developer_logo:
      "https://cdn.prod.website-files.com/68ada6f5bc65af392b69f8d7/693aa06a75bcbd3c9305ee1b_IsoLogotype-Color.png",
    development_name: "Bay Central Tower",
    development_slug: "bay-central-tower",
    development_total_area: 850000,
    development_amenities: [
      "pool", "gym", "security", "concierge",
    ],
    community_name: "Business Bay",
    community_slug: "business-bay",
    community_total_area: 4200000,
    community_description:
      "Business Bay is Dubai's central business district, featuring a mix of commercial and residential towers along the Dubai Canal. It offers easy access to Downtown Dubai, world-class dining, and vibrant nightlife, making it a popular choice for young professionals and investors.",

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
