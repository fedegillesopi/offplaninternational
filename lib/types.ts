export type UserRole = "developer" | "broker" | "private_seller";

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  company_website: string;
  operating_country: string;
  license_number: string;
  country_of_residence: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

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
