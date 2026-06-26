import React from "react";

export default function ContactInfoMap() {
  const mapSrc =
    "https://maps.google.com/maps?q=Span%20Trade%20Center,%20Paldi%20Rd,%20Near%20Bony%20Travels,%20Pritam%20Nagar,%20Paldi,%20Ahmedabad,%20Gujarat%20380006&z=16&output=embed";

  return (
    <section className="w-full py-16 px-6 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Title Section */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-[#b8974a] text-sm font-semibold tracking-widest uppercase mb-2" style={{ marginBottom: "8px", marginTop: "15px" }}>
            Find Us
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#0d1b3e]" style={{ marginBottom: "16px", marginTop: "8px" }} >
            Visit Our Office
          </h2>
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white h-87.5 md:h-125 w-full">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SBS Financials Office Location"
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}