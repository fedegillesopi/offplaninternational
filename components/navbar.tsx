"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Developers", href: "/developers/developers-list" },
  { label: "Developments", href: "/developments/developments-list" },
  { label: "Communities", href: "/communities/communities-list" },
  { label: "Properties", href: "/properties/properties-list" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header id="navbar" className="bg-[--text-primary]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-2 py-2 md:px-6">
        <Link href="/">
          <Image
            src="/images/brand/IsoLogotype-White&Color.png"
            alt="Off Plan International"
            width={180}
            height={45}
            className="h-[30px] w-auto"
            priority
          />
        </Link>

        <button
          className="flex size-8 items-center justify-center text-white md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
          </svg>
        </button>

        <nav className="hidden gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading px-2 py-1 text-base font-light text-white no-underline transition-all duration-200 hover:text-[--primary-main] hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex bg-[--text-primary] md:hidden">
          <div className="relative flex w-full flex-col">
            <button
              className="absolute right-2 top-2 flex size-8 items-center justify-center text-white"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <nav className="flex flex-col pt-16">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-heading px-4 py-3 text-base font-light text-white no-underline transition-all duration-200 hover:text-[--primary-main] hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
