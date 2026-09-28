"use client";

import dynamic from "next/dynamic";

// Dynamically import the HR app root to disable SSR for the React Router DOM application
const HrApp = dynamic(() => import("@/hr360-app/main-next"), { ssr: false });

export default function Hr360CatchAll() {
  return <HrApp />;
}
