"use client";

import { Playfair_Display } from "next/font/google";
import { Send } from "lucide-react";
import { useState, type CSSProperties, type FormEvent } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic", "normal"],
});

// Replace these with your real profile links.
const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/sbs-financials/", icon: LinkedinIcon },
  { name: "Instagram", href: "https://www.instagram.com/sbsfinancial", icon: InstagramIcon },
  { name: "X", href: "https://x.com/services5272", icon: XIcon },
  { name: "Facebook", href: "https://www.facebook.com/share/1ETodRg3J2/", icon: FacebookIcon },
];

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

// (resets, UI-kit base layers, etc.) 
const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #D1D5DB",
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  background: "#FFFFFF",
  color: "#16162B",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const sectionStyle: CSSProperties = {
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  paddingTop: "4rem",
  paddingBottom: "4rem",
};

const cardWrapStyle: CSSProperties = {
  position: "relative",
  borderRadius: "1.5rem",
  overflow: "hidden",
};

const glassPanelStyle: CSSProperties = {
  borderRadius: "1rem",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  padding: "2.5rem",
  textAlign: "center",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // TODO: replace with your real submit logic (API route, Formspree, etc.)
    await new Promise((resolve) => setTimeout(resolve, 900));

    setStatus("sent");
    setForm(initialForm);
  }

  return (
    <section style={sectionStyle} className="w-full bg-white md:px-16! md:py-24!">
      <div
        className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16"
        style={{ alignItems: "stretch" }}
      >
        {/* Left: image + glass info card */}
        <div style={{ ...cardWrapStyle, minHeight: 560 }}>
          <img
            src="/images/contact us/contact-form.jpg"
            alt="Office workspace"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(15,27,51,0.8), rgba(15,27,51,0.55), rgba(15,27,51,0.85))",
            }}
          />

          <div
            style={{
              position: "relative",
              minHeight: 560,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "2.5rem 1.5rem",
            }}
          >
            <div style={glassPanelStyle}>
              <h3 style={{ color: "#E9C46A", fontSize: "1.25rem", fontWeight: 600 }}>
                Location
              </h3>
              <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
                1003, Span Trade Center
                <br />
                Pritam Nagar,Paldi,
                <br />
                Ahmedabad, Gujarat 380006
              </p>

              <h3 style={{ color: "#E9C46A", fontSize: "1.25rem", fontWeight: 600, marginTop: "2rem" }}>
                Contact Info
              </h3>
              <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
                advisors@sbsfinancials.in
                <br />
                +91 98765 43210
              </p>

              <h3 style={{ color: "#E9C46A", fontSize: "1.25rem", fontWeight: 600, marginTop: "2rem" }}>
                Follow Us
              </h3>
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(233,196,106,0.5)",
                      color: "#E9C46A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s",
                    }}
                    className="hover:bg-[#E9C46A]! hover:text-[#0F1B33]!"
                  >
                    <Icon style={{ width: "1rem", height: "1rem" }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2
            className={playfair.className}
            style={{ fontSize: "2.5rem", fontStyle: "italic", color: "#16162B" }}
          >
            Send a message.
          </h2>
          <p style={{ marginTop: "1rem", maxWidth: "36rem", color: "#4B5563" }}>
            Use the button above to book your free consultation. For other
            inquiries, fill out the form below and we&apos;ll get back to you
            within 48 hours.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <Field label="Name" required>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  style={inputStyle}
                />
              </Field>
              <Field label="Company">
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company"
                  style={inputStyle}
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  style={inputStyle}
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Field label="Subject">
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Field label="Message" required>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message"
                  required
                  rows={6}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderRadius: "9999px",
                  background: "#0F1B33",
                  color: "#E9C46A",
                  padding: "0.875rem 1.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  border: "none",
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  opacity: status === "sending" ? 0.7 : 1,
                  transition: "all 0.3s",
                }}
                className="hover:bg-[#16213b]! hover:shadow-lg!"
              >
                {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
                <Send style={{ width: "1rem", height: "1rem" }} />
              </button>

              {status === "sent" && (
                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#059669" }}>
                  Message sent — we&apos;ll be in touch soon.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "#16162B" }}>
        {label}
        {required && (
          <span style={{ marginLeft: "0.25rem", fontWeight: 400, color: "#9CA3AF" }}>
            (required)
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.24 3h2.86l-6.25 7.14L22.2 21h-5.76l-4.51-5.9L6.74 21H3.87l6.68-7.64L2.2 3h5.9l4.08 5.39L18.24 3Zm-1 16.2h1.58L7.84 4.7H6.14l11.1 14.5Z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.5 8.5h2V5.5h-2c-2.2 0-4 1.8-4 4v2H8.5v3H10.5v7h3v-7h2.2l.5-3H13.5v-2c0-.55.45-1 1-1Z" />
    </svg>
  );
}