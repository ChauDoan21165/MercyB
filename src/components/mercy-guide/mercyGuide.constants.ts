export const SIZE_PRESETS = {
  S: { width: 340, height: 480 },
  M: { width: 440, height: 600 },
  L: { width: 560, height: 720 },
  XL: { width: 640, height: 820 },
} as const;

export const MERCY_BLUE_PATH_FORWARD = {
  idle: {
    vi: "Bạn cần giúp gì không? Hãy thử tab 'Grammar & Writing' để sửa câu nhé!",
    en: "Need a hand? Try the 'Grammar & Writing' tab to fix a sentence!",
  },
  navigation: {
    vi: 'Bạn có thể hỏi mình về nội dung phòng này hoặc cách sử dụng các tính năng.',
    en: "You can ask me about this room's content or how to use the features.",
  },
  switching: {
    vi: "Đang chuyển đổi... 'Your Journey' theo dõi tiến bộ, 'Pronunciation' giúp luyện nói.",
    en: "Switching... 'Your Journey' tracks progress, 'Pronunciation' helps you speak.",
  },
  idle_speak: {
    vi: 'Đừng ngại nhé! Hãy nhấn vào biểu tượng Micro để bắt đầu luyện nói cùng mình.',
    en: "Don't be shy! Just tap the Microphone icon to start practicing with me.",
  },
} as const;

export const IDLE_THRESHOLD_MS = 15000;
export const DEFAULT_PANEL_HEIGHT_RATIO = 0.75;
export const DEFAULT_PANEL_RIGHT = 24;
export const DEFAULT_PANEL_BOTTOM = 80;
export const MIN_PANEL_WIDTH = 340;
export const MIN_PANEL_HEIGHT = 480;
export const MIN_PANEL_MARGIN = 8;
export const MOBILE_PANEL_TOP_SAFE = 12;
export const MOBILE_PANEL_BOTTOM_SAFE = 108;

export const PANEL_SIZE_STORAGE_KEY = 'mercy-guide-panel-size-v2';
export const PANEL_SIZE_STORAGE_KEY_MOBILE = 'mercy-guide-panel-size-mobile-v2';
export const PANEL_SIZE_STORAGE_KEY_DESKTOP = 'mercy-guide-panel-size-desktop-v2';

export const BUBBLE_SIZE = 64;
export const BUBBLE_SAFE_MARGIN = 12;
export const BUBBLE_BOTTOM_SAFE_MOBILE = 112;
export const BUBBLE_BOTTOM_SAFE_DESKTOP = 24;
export const DEFAULT_BUBBLE_RIGHT = 16;
export const DEFAULT_BUBBLE_BOTTOM = 112;
export const BUBBLE_POSITION_STORAGE_KEY = 'mercy-guide-bubble-position-v2';

export const EDGE_HANDLE_THICKNESS = 12;
export const CORNER_HANDLE_SIZE = 18;

export const GUIDE_TAB_BOTTOM_BUFFER_DESKTOP = 12;
export const GUIDE_TAB_BOTTOM_BUFFER_MOBILE = 20;