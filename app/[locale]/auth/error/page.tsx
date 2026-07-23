import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  const errorMessages: Record<string, string> = {
    "No token hash or type": "Invalid confirmation link. Please try again.",
    "Token already used": "This confirmation link has already been used.",
  };

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          {errorMessages[params.error] || "An unexpected error occurred. Please try again."}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-3">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="p-3">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
