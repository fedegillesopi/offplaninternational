import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-3">
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-6">
          <Card className="p-3">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account. After confirming, you&apos;ll be guided to
                complete your profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
