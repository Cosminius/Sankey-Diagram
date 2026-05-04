const STORAGE_KEY = 'sankey-studio:v1';

function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { draft: '', saves: {} };
    const parsed = JSON.parse(raw);
    return {
      draft: parsed.draft || '',
      saves: parsed.saves || {}
    };
  } catch (e) {
    console.warn('Storage corrupted, resetting:', e);
    return { draft: '', saves: {} };
  }
}

function writeStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn('Save failed:', e);
    return false;
  }
}
