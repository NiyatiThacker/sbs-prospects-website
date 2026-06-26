import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`
        w-full
        max-w-360
        mx-auto
        px-4
        sm:px-6
        lg:px-10
        xl:px-16
        ${className}
      `}
    >
      {children}
    </div>
  );
}