import { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<
    HTMLButtonElement
  > {
  children: React.ReactNode;

  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex
    items-center
    justify-center
    px-8
    py-4
    text-sm
    uppercase
    tracking-[0.18em]
    transition-all
    duration-500
    border
    font-medium
    whitespace-nowrap
  `;

  const variants = {
    primary: `
      bg-sbs-navy
      text-sbs-cream
      border-sbs-navy
      hover:bg-sbs-gold
      hover:text-sbs-navy
      hover:border-sbs-gold
    `,

    ghost: `
      bg-transparent
      text-sbs-cream
      border-sbs-outline-light

      hover:border-sbs-gold
      hover:text-sbs-gold
    `,
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}