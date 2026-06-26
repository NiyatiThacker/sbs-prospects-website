"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  //* { label: "Products", href: "/products" }, *//
  { label: "Calculator", href: "/calculator" },
  { label: "Contact", href: "/contact" },
];

const NavbarSection: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fbf3e4] border-b border-[#e8e8e8]">
      
      {/* CONTAINER FIX (IMPORTANT) */}
      <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 font-[Montserrat]">

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/Sbs-1.png"
            alt="SBS Financial Services"
            width={140}
            height={45}
            className="object-contain"
            priority
          />
        </Link>

        {/* RIGHT SIDE (NAV + CTA) */}
        <div className="hidden lg:flex items-center gap-6">

          {/* NAV LINKS */}
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-[12px] font-semibold tracking-[0.08em] uppercase pb-[2px] border-b-2 transition-all duration-200
                    ${
                      isActive
                        ? "text-[#111] border-[#C9A84C]"
                        : "text-[#333] border-transparent hover:text-[#111] hover:border-[#C9A84C]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* MOBILE MENU BUTTON (FIXED SPACING) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
        >
        <span className="w-6 h-[2px] bg-black"></span>
        <span className="w-6 h-[2px] bg-black"></span>
        <span className="w-6 h-[2px] bg-black"></span>
      </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#fbf3e4] flex flex-col items-center justify-center gap-8 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-3xl"
        >
          ✕
        </button>

        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-lg font-semibold uppercase tracking-[0.08em]
              ${isActive ? "text-black" : "text-gray-600 hover:text-black"}`}
            >
              {link.label}
            </Link>
          );
        })}

        <Link
          href="/contact"
          onClick={() => setMenuOpen(false)}
          className="border border-black px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] hover:bg-black hover:text-white"
        >
          Contact Us
        </Link>
      </div>
    </nav>
  );
};

export default NavbarSection;