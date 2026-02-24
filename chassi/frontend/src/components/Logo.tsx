import { useTheme } from "@/contexts/ThemeContext";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  /**
   * xs: h-7 (28px)
   * sm: h-8 (32px)
   * md: h-10 (40px)
   * lg: h-16 (64px)
   * xl: h-24 (96px)
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, variant = "full", size = "md" }: LogoProps) {
  const { resolvedTheme } = useTheme();

  const sizeClasses = {
    xs: "h-7",
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
    xl: "h-24"
  };

  // ALTRS-SGO-LOGO-DARK.svg -> Light colored stroke (for Dark Theme)
  // ALTRS-SGO-LOGO-LIGHT.svg -> Dark colored stroke (for Light Theme)
  const fullLogo = resolvedTheme === "dark" 
    ? "/ALTRS-SGO-LOGO-DARK.svg" 
    : "/ALTRS-SGO-LOGO-LIGHT.svg";

  const imgSrc = variant === "icon" ? "/ALTRS-SGO-LOGO-ICON.svg" : fullLogo;

  return (
    <img
      src={imgSrc}
      alt="SGO Core"
      className={`${sizeClasses[size]} w-auto ${className || ""}`}
    />
  );
}
