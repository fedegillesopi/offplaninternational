"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const COUNTRIES = [
  { label: "UAE", value: "AE" },
  { label: "Mexico", value: "MX" },
  { label: "Portugal", value: "PT" },
  { label: "Indonesia", value: "ID" },
  { label: "Montenegro", value: "ME" },
];

export default function SignUpPage() {
  const [companyName, setCompanyName] = useState("");
  const [operatingCountry, setOperatingCountry] = useState("AE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("User not created");

      const { error: profileError } = await supabase
        .from("developer_profiles")
        .update({
          company_name: companyName,
          operating_country: operatingCountry,
        })
        .eq("id", data.user.id);

      if (profileError) throw profileError;

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-bold">Create account</h1>
          <p className="mb-3 text-sm text-gray-500">
            Enter your details to create a developer account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input
                className="h-7"
                id="companyName"
                placeholder="ABC Developers"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="operatingCountry">Operating country</Label>
              <select
                id="operatingCountry"
                value={operatingCountry}
                onChange={(e) => setOperatingCountry(e.target.value)}
                className="flex h-7 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="h-7"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  className="h-7 pr-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-2 w-2" /> : <Eye className="h-2 w-2" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="font-heading inline-flex items-center justify-center whitespace-nowrap rounded-1 bg-primary-main text-white px-8 py-2 text-center text-base transition-colors hover:bg-primary-main/90 h-6" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-main hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden md:block md:w-1/2">
        <Image
          src="/images/miscelaneous/blog-example3.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
