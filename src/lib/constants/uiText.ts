/**
 * Centralized UI Text Constants
 * Single source of truth for all user-facing text across the app
 * Supports bilingual EN/VI with consistent tone
 */

// ============= Button Labels =============
export const BUTTON_LABELS = {
  en: {
    open: 'Open',
    continue: 'Continue',
    viewDetails: 'View details',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    tryAgain: 'Try again',
    reload: 'Reload',
  },
  vi: {
    open: 'Mở',
    continue: 'Tiếp tục',
    viewDetails: 'Xem chi tiết',
    save: 'Lưu',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    close: 'Đóng',
    back: 'Quay lại',
    next: 'Tiếp theo',
    tryAgain: 'Thử lại',
    reload: 'Tải lại',
  },
} as const;

// ============= Loading Messages =============
export const LOADING_MESSAGES = {
  en: {
    default: 'Loading… Please wait.',
    room: 'Loading… Please wait.',
    audio: 'Loading… Please wait.',
    data: 'Loading… Please wait.',
  },
  vi: {
    default: 'Đang tải… Vui lòng chờ.',
    room: 'Đang tải… Vui lòng chờ.',
    audio: 'Đang tải… Vui lòng chờ.',
    data: 'Đang tải… Vui lòng chờ.',
  },
} as const;

// ============= Error Messages (User-Friendly) =============
export const ERROR_MESSAGES = {
  en: {
    accessDenied: "You don't have access to this room.",
    roomNotFound: 'This room does not exist.',
    jsonInvalid: 'This room is being updated. Please try again later.',
    authRequired: 'Please log in to continue.',
    networkError: 'Connection issue. Please check your internet.',
    serverError: 'Something went wrong. Please try again later.',
    audioLoadFailed: 'Audio could not be loaded.',
    generic: 'There seems to be an issue.',
  },
  vi: {
    accessDenied: 'Bạn không thể mở phòng này.',
    roomNotFound: 'Phòng này không tồn tại.',
    jsonInvalid: 'Phòng đang được cập nhật. Vui lòng thử lại sau.',
    authRequired: 'Vui lòng đăng nhập để tiếp tục.',
    networkError: 'Lỗi kết nối. Vui lòng kiểm tra internet.',
    serverError: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
    audioLoadFailed: 'Không thể tải âm thanh.',
    generic: 'Có vấn đề xảy ra.',
  },
} as const;

// ============= Success Messages =============
export const SUCCESS_MESSAGES = {
  en: {
    saved: 'Saved!',
    uploaded: 'Uploaded successfully!',
    done: 'Done!',
    updated: 'Updated!',
    deleted: 'Deleted!',
    copied: 'Copied!',
  },
  vi: {
    saved: 'Đã lưu!',
    uploaded: 'Đã tải lên!',
    done: 'Hoàn tất!',
    updated: 'Đã cập nhật!',
    deleted: 'Đã xóa!',
    copied: 'Đã sao chép!',
  },
} as const;

// ============= Empty States =============
export const EMPTY_STATE_MESSAGES = {
  en: {
    noItems: 'No items available.',
    noRooms: 'No rooms available.',
    noResults: 'No results found.',
    noData: 'No data available.',
  },
  vi: {
    noItems: 'Không có mục nào.',
    noRooms: 'Không có phòng nào.',
    noResults: 'Không tìm thấy kết quả.',
    noData: 'Không có dữ liệu.',
  },
} as const;

// ============= Confirmation Dialogs =============
export const CONFIRMATION_MESSAGES = {
  en: {
    title: 'Are you sure?',
    body: 'This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  vi: {
    title: 'Bạn có chắc không?',
    body: 'Hành động này không thể hoàn tác.',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
  },
} as const;

// ============= Tooltips =============
export const TOOLTIPS = {
  en: {
    toggleTheme: 'Click to toggle theme',
    playAudio: 'Tap to play audio',
    openRoom: 'Open this room',
    favorite: 'Add to favorites',
    unfavorite: 'Remove from favorites',
    share: 'Share this room',
    close: 'Close',
  },
  vi: {
    toggleTheme: 'Chọn để bật/tắt giao diện',
    playAudio: 'Nhấn để phát âm thanh',
    openRoom: 'Mở phòng này',
    favorite: 'Thêm vào yêu thích',
    unfavorite: 'Xóa khỏi yêu thích',
    share: 'Chia sẻ phòng này',
    close: 'Đóng',
  },
} as const;

// ============= Onboarding Messages =============
export const ONBOARDING_MESSAGES = {
  en: {
    welcome: 'Welcome back.',
    chooseRoom: 'Choose a room to begin.',
    firstTime: 'Welcome to Mercy Blade.',
    getStarted: 'Get started by exploring rooms.',
  },
  vi: {
    welcome: 'Chào mừng bạn trở lại.',
    chooseRoom: 'Hãy chọn một phòng để bắt đầu.',
    firstTime: 'Chào mừng đến với Mercy Blade.',
    getStarted: 'Bắt đầu bằng cách khám phá các phòng.',
  },
} as const;

// ============= Helper Functions =============

/**
 * Get plural form based on count
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/**
 * Get text in current language
 */
export function getText<T extends Record<string, any>>(
  textObj: { en: T; vi: T },
  lang: 'en' | 'vi' = 'en'
): T {
  return textObj[lang];
}

/**
 * Map error kinds to user-friendly messages
 */
export function getErrorMessage(
  errorKind: string,
  lang: 'en' | 'vi' = 'en'
): string {
  const messages = ERROR_MESSAGES[lang];
  
  switch (errorKind) {
    case 'access':
    case 'access_denied':
    case 'ACCESS_DENIED':
      return messages.accessDenied;
    case 'not_found':
    case 'room_not_found':
    case 'ROOM_NOT_FOUND':
      return messages.roomNotFound;
    case 'json_invalid':
    case 'JSON_INVALID':
      return messages.jsonInvalid;
    case 'auth':
    case 'auth_required':
    case 'AUTHENTICATION_REQUIRED':
      return messages.authRequired;
    case 'network':
    case 'network_error':
      return messages.networkError;
    case 'server':
    case 'server_error':
    case 'INTERNAL_ERROR':
      return messages.serverError;
    case 'audio_load_failed':
      return messages.audioLoadFailed;
    default:
      return messages.generic;
  }
}
