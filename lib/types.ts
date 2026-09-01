export type UserRole = "developer" | "broker" | "private_seller";

export type PropertyStatus = "available" | "sold" | "reserved" | "off_market";

export type PropertyCurrency = "AED" | "USD" | "EUR" | "GBP";

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

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  country: string | null;
  cover_image: string | null;
  city: string | null;
  on_time_completion: number | null;
  email: string | null;
  phone: string | null;
  is_verified: boolean;
  user_profile_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrokerProfile {
  id: string;
  user_profile_id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  personal_url: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  email_public: string | null;
  phone: string | null;
  whatsapp: string | null;
  closed_transactions: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Development {
  id: string;
  name: string;
  slug: string;
  developer_id: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  community: string | null;
  cover_image: string | null;
  images: string[] | null;
  amenities: string[] | null;
  handover_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentPlanMilestone {
  id: string;
  property_id: string;
  milestone_name: string;
  percentage: number;
  amount: number | null;
  due_date: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface PropertyData {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionFull: string;

  listed_by_id: string;
  listed_by_type: UserRole;
  developer_id: string | null;
  development_id: string | null;

  status: PropertyStatus;
  country: string;
  city: string;
  community: string;
  address: string | null;

  subcategory: string;
  beds: number;
  baths: number;
  area: number;
  area_sqft: number | null;
  area_sqm: number | null;
  floor: number | null;
  has_balcony: boolean;
  has_garden: boolean;

  price: number;
  currency: PropertyCurrency;
  deposit_percentage: number | null;
  deposit_amount: number | null;

  has_post_handover: boolean;
  handover_date: string | null;
  handoverDate: string;
  payment_plan_months: number | null;

  images: string[];
  cover_image: string | null;
  amenities: string[];
  amenity_names: Record<string, string>;
  tags: string[];

  is_featured: boolean;
  is_active: boolean;
  addedOn: string;
  created_at: string;
  updated_at: string;

  developer_name: string;
  developer_slug: string;
  developer_logo: string;
  broker_name: string;
  broker_slug: string;
  private_seller_name: string;
  development_name: string;
  development_slug: string;
  development_total_area: number;
  development_amenities: string[];
  community_name: string;
  community_slug: string;
  community_total_area: number;
  community_description: string;

  paymentPlan: {
    length: string;
    depositPercentage: string;
    depositValue: string;
    description: string;
  };
  phone: string;
  whatsapp: string;
}

export interface DevelopmentDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  amenities: string[];
  location: string;
  startingPrice: number;
  startingPriceCurrency: PropertyCurrency;
  propertyTypes: string[];
  totalArea: number;
  developerName: string;
  developerSlug: string;
  developerLogo: string;
}

export interface MarketNewsArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

export type MarketNewsCardSize = "sm" | "md" | "lg";
