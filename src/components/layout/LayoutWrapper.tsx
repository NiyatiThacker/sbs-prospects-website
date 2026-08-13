"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotFloat from "@/components/ui/ChatbotFloat";
import CustomCursor from "@/components/ui/CustomCursor";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHrApp = pathname?.startsWith("/hr360");

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [pathname]);

  return (
    <>
      {!isHrApp && <Navbar />}
      <main>{children}</main>
      {!isHrApp && <Footer />}
      {!isHrApp && <ChatbotFloat />}
      {!isHrApp && <CustomCursor />}
    </>
  );
}
