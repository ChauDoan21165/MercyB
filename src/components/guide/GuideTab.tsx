import React, { useCallback, useMemo, useRef, useState } from "react";
import { resolveGuideReply } from "./resolveGuideReply";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type GuideTabProps = {
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  zIndex?: number;
  onFocus?: () => void;
  onOpenHost?: () => void;
  onOpenSpeak?: () => void;
};

const MIN_WIDTH = 320;
const MIN_HEIGHT = 380;

function createId() {
  return Math.random().toString(36).slice(2);
}

export default function GuideTab({
  initialX = 80,
  initialY = 80,
  initialWidth = 380,
  initialHeight = 520,
  zIndex = 30,
  onFocus,
  onOpenHost,
  onOpenSpeak,
}: GuideTabProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({
    width: Math.max(initialWidth, MIN_WIDTH),
    height: Math.max(initialHeight, MIN_HEIGHT),
  });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      text: "Hi! I’m Guide. I help with app usage, room navigation, and where to go next.",
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const resizeStartRef = useRef({
    startX: 0,
    startY: 0,
    originWidth: 0,
    originHeight: 0,
  });

  const appendMessage = useCallback((role: ChatMessage["role"], text: string) => {
    setMessages((prev) => [...prev, { id: createId(), role, text }]);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    appendMessage("user", trimmed);

    const reply = resolveGuideReply(trimmed);

    if (reply.type === "local") {
      appendMessage("assistant", reply.message);
    } else if (reply.type === "redirect_host") {
      appendMessage("assistant", reply.message);
      onOpenHost?.();
    } else if (reply.type === "redirect_speak") {
      appendMessage("assistant", reply.message);
      onOpenSpeak?.();
    }

    setInput("");
  }, [appendMessage, input, onOpenHost, onOpenSpeak]);

  const onMouseDownDrag = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onFocus?.();
      setIsDragging(true);
      dragStartRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - dragStartRef.current.startX;
        const dy = moveEvent.clientY - dragStartRef.current.startY;

        setPosition({
          x: dragStartRef.current.originX + dx,
          y: dragStartRef.current.originY + dy,
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onFocus, position.x, position.y]
  );

  const onMouseDownResize = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onFocus?.();
      setIsResizing(true);

      resizeStartRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originWidth: size.width,
        originHeight: size.height,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - resizeStartRef.current.startX;
        const dy = moveEvent.clientY - resizeStartRef.current.startY;

        setSize({
          width: Math.max(MIN_WIDTH, resizeStartRef.current.originWidth + dx),
          height: Math.max(MIN_HEIGHT, resizeStartRef.current.originHeight + dy),
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onFocus, size.height, size.width]
  );

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "fixed",
      left: position.x,
      top: position.y,
      width: size.width,
      height: size.height,
      zIndex,
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      border: "1px solid #d9d9d9",
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      overflow: "hidden",
      userSelect: isDragging || isResizing ? "none" : "auto",
    }),
    [isDragging, isResizing, position.x, position.y, size.height, size.width, zIndex]
  );

  return (
    <div style={containerStyle} onMouseDown={onFocus}>
      <div
        onMouseDown={onMouseDownDrag}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          background: "#f5f7fb",
          borderBottom: "1px solid #ececec",
          cursor: "move",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Guide</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            App help, navigation, and where to go next
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => onOpenHost?.()}
            style={buttonStyle}
          >
            Open Host
          </button>
          <button
            type="button"
            onClick={() => onOpenSpeak?.()}
            style={buttonStyle}
          >
            Open Speak
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          background: "#fafafa",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              justifyContent: message.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: "84%",
                padding: "10px 12px",
                borderRadius: 12,
                background: message.role === "user" ? "#dbeafe" : "#ffffff",
                border: "1px solid #e5e7eb",
                fontSize: 14,
                lineHeight: 1.45,
                whiteSpace: "pre-wrap",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderTop: "1px solid #ececec",
          background: "#fff",
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask Guide where to go or how to use the app..."
          style={{
            flex: 1,
            height: 40,
            padding: "0 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 14,
          }}
        />

        <button
          type="button"
          onClick={handleSend}
          style={{
            ...buttonStyle,
            minWidth: 76,
            height: 40,
          }}
        >
          Send
        </button>
      </div>

      <div
        onMouseDown={onMouseDownResize}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          cursor: "nwse-resize",
          background:
            "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.18) 50%)",
        }}
      />
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  height: 32,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};