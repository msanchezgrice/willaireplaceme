import Image from "next/image";

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

  // Use the Career Guard SVG from public folder
  const logoSrc = "/career_guard_icon.svg";
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Career Guard SVG Icon */}
      <div className="relative">
        <Image
          src={logoSrc}
          alt="Career Guard Icon"
          width={size === "sm" ? 24 : size === "md" ? 32 : 48}
          height={size === "sm" ? 24 : size === "md" ? 32 : 48}
          className={sizeClasses[size]}
          priority
        />
      </div>
      
      {/* Text Logo */}
      {showText && (
        <span className={`font-bold text-slate-900 ${textSizeClasses[size]}`}>
          Career Guard
        </span>
      )}
    </div>
  );
} 