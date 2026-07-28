"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { Building2, Briefcase, User } from "lucide-react";
import type { UserRole } from "@/lib/types";

const COUNTRIES = [
  { label: "United Arab Emirates", value: "AE" },
  { label: "United Kingdom", value: "GB" },
  { label: "Spain", value: "ES" },
  { label: "Portugal", value: "PT" },
  { label: "Mexico", value: "MX" },
  { label: "Brazil", value: "BR" },
  { label: "Argentina", value: "AR" },
  { label: "Indonesia", value: "ID" },
  { label: "Montenegro", value: "ME" },
];

const ROLE_CONFIG: Record<UserRole, { title: string; icon: React.ReactNode; description: string }> = {
  developer: {
    title: "Developer Profile",
    icon: <Building2 className="h-5 w-5" />,
    description: "Complete your developer profile to start listing properties",
  },
  broker: {
    title: "Broker Profile",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Complete your broker profile to start listing properties",
  },
  private_seller: {
    title: "Private Seller Profile",
    icon: <User className="h-5 w-5" />,
    description: "Complete your profile to start listing your property",
  },
};

export default function OnboardingPage() {
  const params = useParams();
  const role = params.role as UserRole;
  const router = useRouter();
  const config = ROLE_CONFIG[role];

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [operatingCountry, setOperatingCountry] = useState("AE");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("AE");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!config) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <p className="text-red-500">Invalid role</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updateData: Record<string, string | boolean> = {
        phone,
        profile_completed: true,
      };

      if (role === "developer" || role === "broker") {
        updateData.company_name = companyName;
        updateData.company_website = companyWebsite;
        updateData.operating_country = operatingCountry;
      }

      if (role === "broker") {
        updateData.license_number = licenseNumber;
      }

      if (role === "private_seller") {
        updateData.country_of_residence = countryOfResidence;
      }

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) throw updateError;

      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-main/10 text-primary-main">
              {config.icon}
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {(role === "developer" || role === "broker") && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company name *</Label>
                    <Input
                      id="companyName"
                      placeholder="ABC Developers"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="companyWebsite">Company website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      placeholder="https://example.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="operatingCountry">Operating country *</Label>
                    <select
                      id="operatingCountry"
                      value={operatingCountry}
                      onChange={(e) => setOperatingCountry(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {role === "broker" && (
                <div className="grid gap-2">
                  <Label htmlFor="licenseNumber">License number *</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="BRK-12345"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
              )}

              {role === "private_seller" && (
                <div className="grid gap-2">
                  <Label htmlFor="countryOfResidence">Country of residence *</Label>
                  <select
                    id="countryOfResidence"
                    value={countryOfResidence}
                    onChange={(e) => setCountryOfResidence(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
