// src/components/mercy/MercyAvatarMinimalist.tsx — v2025-12-21-87.5-MOUTH-ANIM
/**
 * Minimalist Mercy Avatar
 *
 * Outline only, monochrome, quiet modern aesthetic
 * NEW: when animate=true (talking), mouth opens/closes gently.
 */

interface MercyAvatarMinimalistProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function MercyAvatarMinimalist({
  size = 56,
  className = "",
  animate = true,
}: MercyAvatarMinimalistProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={animate ? "animate-mercy-breathe" : ""}
      >
        {/* Outer circle - main outline */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground/80"
        />

        {/* Inner face circle */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground/60"
        />

        {/* Left eye - simple dot */}
        <circle cx="40" cy="48" r="3" fill="currentColor" className="text-foreground" />

        {/* Right eye - simple dot */}
        <circle cx="60" cy="48" r="3" fill="currentColor" className="text-foreground" />

        {/* Mouth */}
        {!animate ? (
          // Idle: Minimal smile - single arc
          <path
            d="M42 58 Q50 64 58 58"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-foreground/80"
          />
        ) : (
          // Talking: open/close mouth using animated ellipse
          <>
            {/* Mouth outline */}
            <ellipse
              cx="50"
              cy="60"
              rx="8"
              ry="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground/85"
            >
              <animate
                attributeName="ry"
                values="2;6;2;5;2"
                dur="0.9s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="8;7;8;6.5;8"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Subtle inner fill (tiny depth) */}
            <ellipse
              cx="50"
              cy="60"
              rx="6"
              ry="1.2"
              fill="currentColor"
              opacity="0.12"
              className="text-foreground"
            >
              <animate
                attributeName="ry"
                values="1.2;3.2;1.2;2.8;1.2"
                dur="0.9s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="6;5.2;6;4.8;6"
                dur="0.9s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.08;0.18;0.08;0.14;0.08"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Tiny “voice pulse” line under mouth */}
            <path
              d="M44 67 Q50 69 56 67"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.25"
              className="text-foreground"
            >
              <animate
                attributeName="opacity"
                values="0.12;0.35;0.12;0.28;0.12"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
          </>
        )}

        {/* Subtle decorative lines - wings abstracted */}
        <path
          d="M18 45 Q12 40 18 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-foreground/40"
        />
        <path
          d="M82 45 Q88 40 82 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-foreground/40"
        />

        {/* Top arc - subtle halo hint */}
        <path
          d="M35 22 Q50 16 65 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="text-foreground/30"
        />
      </svg>
    </div>
  );
}
