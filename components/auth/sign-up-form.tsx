"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import type { UserRole } from "@/lib/types";
import { useTranslations } from "next-intl";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations("auth.sign_up");
  const params = useParams();
  const locale = useLocale();
  const initialRole = (params.role as UserRole) || "developer";
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: activeTab,
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/${locale}/auth/confirm`,
        },
      });

      if (error?.message?.toLowerCase().includes("already registered")) {
        setError(t("email_exists"));
        setIsLoading(false);
        return;
      }

      if (error) throw error;
      router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setError(null);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as UserRole);
    router.push(`/auth/sign-up/${value}`);
    resetForm();
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex rounded-lg bg-muted p-1">
        {(["developer", "broker", "private_seller"] as UserRole[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => handleTabChange(role)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-all",
              activeTab === role
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{t(`roles.${role}`)}</span>
          </button>
        ))}
      </div>

      <Card className="p-3">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold">
            {t("title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSignUp} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="fullName">{t("full_name")}</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="repeat-password">{t("repeat_password")}</Label>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button variant={"default"} type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("loading") : t("submit")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col border-none p-0 mt-2">
          <p className="text-center text-xs text-muted-foreground">
            {t("has_account")}{" "}
            <Link
              href="/auth/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
