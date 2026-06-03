export interface PropertyData {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionFull: string;
  category: string;
  subcategory: string;
  beds: number;
  baths: number;
  area: number;
  currency: string;
  price: number;
  location: {
    country: string;
    city: string;
    community: string;
  };
  developer: {
    name: string;
    slug: string;
    logo: string;
  };
  development: {
    name: string;
    slug: string;
    totalArea: number;
    amenities: string[];
  };
  community: {
    name: string;
    slug: string;
    totalArea: number;
    description: string;
  };
  images: string[];
  amenities: string[];
  status: string;
  handoverDate: string;
  addedOn: string;
  tags: string[];
  paymentPlan: {
    length: string;
    depositPercentage: string;
    depositValue: string;
    description: string;
  };
  phone: string;
  whatsapp: string;
}
