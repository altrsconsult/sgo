import { useEffect, useState } from "react";
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

// Fallbacks estáticos quando não há logo customizado
const FALLBACK_ICON = "/ALTRS-SGO-LOGO-ICON.svg";
const FALLBACK_LIGHT = "/ALTRS-SGO-LOGO-LIGHT.svg";
const FALLBACK_DARK = "/ALTRS-SGO-LOGO-DARK.svg";

export function Logo({ className, variant = "full", size = "md" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [publicSettings, setPublicSettings] = useState<{
    "app.logo_url"?: string | null;
    "app.logo_dark_url"?: string | null;
    "app.logo_format"?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/public/settings")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => setPublicSettings(data))
      .catch(() => setPublicSettings(null));
  }, []);

  const sizeClasses = {
    xs: "h-7",
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
    xl: "h-24"
  };

  const logoFormat = publicSettings?.["app.logo_format"] ?? "icon";
  const isSquare = variant === "icon" || (variant === "full" && logoFormat === "icon");
  const hasCustomLight = !!publicSettings?.["app.logo_url"];
  const hasCustomDark = !!publicSettings?.["app.logo_dark_url"];

  const urlLight = hasCustomLight ? "/api/public/logo/light" : FALLBACK_LIGHT;
  const urlDark = hasCustomDark ? "/api/public/logo/dark" : FALLBACK_DARK;
  const fullLogoUrl = resolvedTheme === "dark" ? urlDark : urlLight;
  const iconUrl = variant === "icon" && (hasCustomLight || hasCustomDark)
    ? (resolvedTheme === "dark" ? urlDark : urlLight)
    : variant === "icon"
      ? FALLBACK_ICON
      : fullLogoUrl;
  const imgSrc = variant === "icon" ? iconUrl : fullLogoUrl;

  return (
    <img
      src={imgSrc}
      alt="SGO Core"
      className={`${sizeClasses[size]} w-auto ${isSquare ? "logo-format-icon" : "logo-format-horizontal"} ${className || ""}`}
    />
  );
}
