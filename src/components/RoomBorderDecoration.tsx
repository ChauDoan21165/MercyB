/**
 * Decorative vine border for room containers
 * Subtle, elegant floral decoration using the app's rainbow theme
 */

export const RoomBorderDecoration = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top Left Corner */}
      <svg 
        className="absolute top-0 left-0 w-32 h-32 opacity-20" 
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <path
          d="M 0,20 Q 10,10 20,0 M 0,40 Q 15,25 30,10 M 0,60 Q 20,40 40,20"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          fill="none"
          opacity="0.6"
        />
        <circle cx="18" cy="8" r="2" fill="hsl(280, 70%, 75%)" opacity="0.7" />
        <circle cx="28" cy="12" r="1.5" fill="hsl(200, 60%, 80%)" opacity="0.7" />
        <circle cx="38" cy="22" r="2" fill="hsl(150, 50%, 75%)" opacity="0.7" />
        <path
          d="M 18,8 Q 16,10 15,12 M 28,12 Q 27,14 26,16 M 38,22 Q 36,24 34,26"
          stroke="hsl(120, 45%, 65%)"
          strokeWidth="0.3"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Top Right Corner */}
      <svg 
        className="absolute top-0 right-0 w-32 h-32 opacity-20 scale-x-[-1]" 
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <path
          d="M 0,20 Q 10,10 20,0 M 0,40 Q 15,25 30,10 M 0,60 Q 20,40 40,20"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          fill="none"
          opacity="0.6"
        />
        <circle cx="18" cy="8" r="2" fill="hsl(45, 80%, 65%)" opacity="0.7" />
        <circle cx="28" cy="12" r="1.5" fill="hsl(330, 50%, 80%)" opacity="0.7" />
        <circle cx="38" cy="22" r="2" fill="hsl(290, 60%, 80%)" opacity="0.7" />
        <path
          d="M 18,8 Q 16,10 15,12 M 28,12 Q 27,14 26,16 M 38,22 Q 36,24 34,26"
          stroke="hsl(180, 40%, 75%)"
          strokeWidth="0.3"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Bottom Left Corner */}
      <svg 
        className="absolute bottom-0 left-0 w-32 h-32 opacity-20 scale-y-[-1]" 
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.1))' }}
      >
        <path
          d="M 0,20 Q 10,10 20,0 M 0,40 Q 15,25 30,10 M 0,60 Q 20,40 40,20"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          fill="none"
          opacity="0.6"
        />
        <circle cx="18" cy="8" r="2" fill="hsl(25, 75%, 70%)" opacity="0.7" />
        <circle cx="28" cy="12" r="1.5" fill="hsl(55, 75%, 78%)" opacity="0.7" />
        <circle cx="38" cy="22" r="2" fill="hsl(210, 70%, 75%)" opacity="0.7" />
        <path
          d="M 18,8 Q 16,10 15,12 M 28,12 Q 27,14 26,16 M 38,22 Q 36,24 34,26"
          stroke="hsl(195, 60%, 72%)"
          strokeWidth="0.3"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Bottom Right Corner */}
      <svg 
        className="absolute bottom-0 right-0 w-32 h-32 opacity-20 scale-[-1]" 
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.1))' }}
      >
        <path
          d="M 0,20 Q 10,10 20,0 M 0,40 Q 15,25 30,10 M 0,60 Q 20,40 40,20"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          fill="none"
          opacity="0.6"
        />
        <circle cx="18" cy="8" r="2" fill="hsl(0, 70%, 75%)" opacity="0.7" />
        <circle cx="28" cy="12" r="1.5" fill="hsl(270, 55%, 70%)" opacity="0.7" />
        <circle cx="38" cy="22" r="2" fill="hsl(160, 40%, 75%)" opacity="0.7" />
        <path
          d="M 18,8 Q 16,10 15,12 M 28,12 Q 27,14 26,16 M 38,22 Q 36,24 34,26"
          stroke="hsl(190, 50%, 75%)"
          strokeWidth="0.3"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Top Edge Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-12 opacity-15">
        <svg viewBox="0 0 200 40" className="w-full h-full">
          <path
            d="M 0,35 Q 25,25 50,30 T 100,30 T 150,30 T 200,30"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <circle cx="50" cy="30" r="2" fill="hsl(60, 40%, 70%)" opacity="0.6" />
          <circle cx="100" cy="30" r="2" fill="hsl(15, 50%, 65%)" opacity="0.6" />
          <circle cx="150" cy="30" r="2" fill="hsl(240, 20%, 60%)" opacity="0.6" />
        </svg>
      </div>

      {/* Bottom Edge Decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-12 opacity-15 scale-y-[-1]">
        <svg viewBox="0 0 200 40" className="w-full h-full">
          <path
            d="M 0,35 Q 25,25 50,30 T 100,30 T 150,30 T 200,30"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <circle cx="50" cy="30" r="2" fill="hsl(30, 30%, 65%)" opacity="0.6" />
          <circle cx="100" cy="30" r="2" fill="hsl(50, 70%, 70%)" opacity="0.6" />
          <circle cx="150" cy="30" r="2" fill="hsl(220, 20%, 70%)" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};
