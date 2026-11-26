const STORAGE_KEY = 'ltw_bongda_matches';

export const loadSaved = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return null;
    }

    const matches = JSON.parse(saved);

    return Array.isArray(matches) ? matches : null;
  } catch {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(matches)
    );
  } catch {
    // Không làm gián đoạn ứng dụng nếu lưu thất bại
  }
};