"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  const phoneNumber =
    "919081353523";

  const message = `
Hello,

SBS Financial Services,

I would like to learn more about your financial advisory and wealth planning services.

Please share further details regarding consultation and investment planning.

Thank you.
  `;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed
        bottom-6
        right-6
        z-50
        group
      "
    >
      {/* PULSE RING */}
      <span
        className="
          absolute
          inset-0
          rounded-full
          bg-green-500/30
          animate-ping
        "
      />

      {/* BUTTON */}
      <div
        className="
          relative
          w-16
          h-16
          rounded-full
          bg-[#25D366]
          flex
          items-center
          justify-center
          shadow-lg
          transition-transform
          duration-300
          group-hover:scale-105
        "
      >
        <FaWhatsapp
            className="text-white text-[34px]"
        />
      </div>
    </a>
  );
}