"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/platform/image-upload";
import { useRouter } from "next/navigation";
import { Building2, Briefcase, User } from "lucide-react";
import type { UserRole } from "@/lib/types";
import { slugify } from "@/lib/utils";

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
  const locale = useLocale();
  const router = useRouter();
  const config = ROLE_CONFIG[role];

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [operatingCountry, setOperatingCountry] = useState("AE");
  const [reraCardUrl, setReraCardUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [agencyOrn, setAgencyOrn] = useState("");
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("AE");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    loadUser();
  }, []);

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

      if (role === "private_seller") {
        updateData.country_of_residence = countryOfResidence;
      }

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) throw updateError;

      if (role === "broker") {
        const { data: brokerRow } = await supabase
          .from("broker_profiles")
          .select("id")
          .eq("user_profile_id", user.id)
          .maybeSingle();

        if (brokerRow) {
          const { error: brokerUpdateError } = await supabase
            .from("broker_profiles")
            .update({
              rera_card_url: reraCardUrl || null,
              qr_code_url: qrCodeUrl || null,
              agency_orn: agencyOrn || null,
              details_confirmed: detailsConfirmed,
            })
            .eq("id", brokerRow.id);
          if (brokerUpdateError) throw brokerUpdateError;
        } else {
          const { error: brokerInsertError } = await supabase
            .from("broker_profiles")
            .insert({
              user_profile_id: user.id,
              name: companyName || user.user_metadata?.full_name || "Broker",
              slug: slugify(companyName || user.user_metadata?.full_name || "broker"),
              rera_card_url: reraCardUrl || null,
              qr_code_url: qrCodeUrl || null,
              agency_orn: agencyOrn || null,
              details_confirmed: detailsConfirmed,
            });
          if (brokerInsertError) throw brokerInsertError;
        }
      }

      router.push(`/${locale}/auth/payment`);
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
                <>
                  <div className="space-y-1">
                    <Label>RERA Broker Card / ID *</Label>
                    <ImageUpload
                      label="RERA Broker Card / ID"
                      value={reraCardUrl}
                      onChange={setReraCardUrl}
                      userId={userId}
                      folder="rera"
                      bucket="broker-images"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>QR Code</Label>
                    <ImageUpload
                      label="QR Code"
                      value={qrCodeUrl}
                      onChange={setQrCodeUrl}
                      userId={userId}
                      folder="qr"
                      bucket="broker-images"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="agencyOrn">Agency ORN (Office Registration Number)</Label>
                    <Input
                      id="agencyOrn"
                      placeholder="e.g. ORN-12345"
                      value={agencyOrn}
                      onChange={(e) => setAgencyOrn(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The enterprise that employs you must provide its Office
                      Registration Number.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="detailsConfirmed"
                      checked={detailsConfirmed}
                      onCheckedChange={(v) => setDetailsConfirmed(v === true)}
                    />
                    <Label htmlFor="detailsConfirmed" className="text-sm">
                      I confirm these details are up to date
                    </Label>
                  </div>
                </>
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
