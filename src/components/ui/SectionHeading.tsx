interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`
        mb-16
        ${align === "center" ? "text-center" : "text-left"}
      `}
    >
      <p className="section-label">
        {label}
      </p>

      <h2 className="headline-md text-sbs-charcoal mb-6">
        {title}
      </h2>

      {description && (
        <p
          className={`
            body-lg
            text-sbs-charcoal-light
            max-w-2xl
            ${
              align === "center"
                ? "mx-auto"
                : ""
            }
          `}
        >
          {description}
        </p>
      )}
    </div>
  );
}