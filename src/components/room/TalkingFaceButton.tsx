import clsx from "clsx";

interface TalkingFaceButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  size?: number;
  disabled?: boolean;
}

export function TalkingFaceButton({
  isPlaying,
  onClick,
  size = 28,
  disabled = false,
}: TalkingFaceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
      className={clsx(
        "flex items-center justify-center rounded-full border transition-all",
        "bg-white hover:bg-neutral-100 active:scale-95",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        width: size,
        height: size,
        borderColor: "#000",
      }}
    >
      {/* Face */}
      <div className="relative flex items-center justify-center">
        {/* Eyes */}
        <div
          className="absolute top-[30%] left-[30%] w-[3px] h-[3px] bg-black rounded-full"
        />
        <div
          className="absolute top-[30%] right-[30%] w-[3px] h-[3px] bg-black rounded-full"
        />

        {/* Mouth */}
        <div
          className={clsx(
            "absolute bottom-[30%] left-1/2 -translate-x-1/2 bg-black transition-all",
            isPlaying
              ? "w-[10px] h-[6px] rounded-b-full" // open mouth
              : "w-[10px] h-[2px] rounded-full" // closed mouth
          )}
        />
      </div>
    </button>
  );
}
