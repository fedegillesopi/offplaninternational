import Image from "next/image";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full">
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center">
        <Image
          src="/images/miscelaneous/blog-example3.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="flex flex-col gap-4">
            <Suspense>
              <SignUpForm />
            </Suspense>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline self-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
