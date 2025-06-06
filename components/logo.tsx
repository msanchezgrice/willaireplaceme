import Image from "next/image";
import { Shield } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showText?: boolean;
  className?: string;
}

export function Logo({ 
  size = "md", 
  variant = "light", 
  showText = true, 
  className = "" 
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  // Try to load the actual logo image, prioritizing PNG files that user uploaded
  const logoSrc = variant === "dark" ? "/app_icon.png" : "/website_logo.png";
  const fallbackSrc = variant === "dark" ? "/logo-dark.svg" : "/logo.svg";
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Try to show logo image, fallback to icon */}
      <div className="relative">
        <Image
          src={logoSrc}
          alt="Career Guard Logo"
          width={size === "sm" ? 24 : size === "md" ? 32 : 48}
          height={size === "sm" ? 24 : size === "md" ? 32 : 48}
          className={sizeClasses[size]}
          onError={(e) => {
            // First try SVG fallback, then shield icon
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('.svg')) {
              target.src = fallbackSrc;
            } else {
              // SVG also failed, show shield icon
              target.style.display = "none";
              const icon = target.nextElementSibling as HTMLElement;
              if (icon) icon.style.display = "block";
            }
          }}
        />
        {/* Fallback icon (hidden by default, shown if all images fail) */}
        <Shield 
          className={`${sizeClasses[size]} text-primary hidden`}
          style={{ display: "none" }}
        />
      </div>
      
      {/* Logo text */}
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} ${
          variant === "dark" ? "text-white" : "text-slate-900"
        }`}>
          Career Guard
        </span>
      )}
    </div>
  );
} 