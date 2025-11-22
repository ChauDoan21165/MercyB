import { cn } from "@/lib/utils";

interface BrandSloganProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandSlogan = ({ className, size = "md" }: BrandSloganProps) => {
  const sizeClasses = {
    sm: {
      main: "text-2xl md:text-3xl",
      subtitle: "text-sm md:text-base",
      tagline: "text-base md:text-lg",
      spacing: "space-y-1",
      padding: "py-6 px-8",
    },
    md: {
      main: "text-4xl md:text-5xl lg:text-6xl",
      subtitle: "text-lg md:text-xl lg:text-2xl",
      tagline: "text-xl md:text-2xl lg:text-3xl",
      spacing: "space-y-2 md:space-y-3",
      padding: "py-10 px-12 md:py-12 md:px-16",
    },
    lg: {
      main: "text-5xl md:text-6xl lg:text-7xl",
      subtitle: "text-xl md:text-2xl lg:text-3xl",
      tagline: "text-2xl md:text-3xl lg:text-4xl",
      spacing: "space-y-3 md:space-y-4",
      padding: "py-12 px-16 md:py-16 md:px-20",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn("relative w-full flex justify-center items-center", className)}>
      {/* Rainbow gradient aura background with soft glow */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-40 animate-pulse-glow"
        style={{
          background: "var(--gradient-mercy-rainbow)",
          filter: "blur(60px)",
          boxShadow: "var(--shadow-mercy-glow)",
        }}
      />
      
      {/* Content container */}
      <div className={cn(
        "relative z-10 text-center",
        sizes.spacing,
        sizes.padding
      )}>
        {/* MERCY BLADE - bold uppercase */}
        <h1 
          className={cn(
            "font-black uppercase tracking-wider",
            sizes.main
          )}
          style={{
            background: "var(--gradient-mercy-rainbow)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 2px 10px rgba(255, 153, 200, 0.2)",
          }}
        >
          MERCY BLADE
        </h1>

        {/* English & Knowledge - thin modern */}
        <p 
          className={cn(
            "font-light tracking-wide text-foreground/90",
            sizes.subtitle
          )}
        >
          English & Knowledge
        </p>

        {/* Colors of Life - elegant serif */}
        <p 
          className={cn(
            "font-serif italic font-medium",
            sizes.tagline
          )}
          style={{
            background: "var(--gradient-mercy-rainbow)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Colors of Life
        </p>
      </div>
    </div>
  );
};