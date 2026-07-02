import { createSlice } from '@reduxjs/toolkit'

const MAX_ITEMS = 8
const STORAGE_KEY = 'bb_recently_viewed'

// Load from localStorage on boot (hardened to migrate objects to IDs)
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed
        .map(item => (typeof item === 'object' && item !== null ? item.id : item))
        .filter(id => typeof id === 'number' || typeof id === 'string');
    }
    return [];
  } catch {
    return []
  }
}

function saveToStorage(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {}
}

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: {
    ids: loadFromStorage(),
  },
  reducers: {
    addRecentlyViewed: (state, action) => {
      const payload = action.payload
      const id = typeof payload === 'object' && payload !== null ? payload.id : payload
      if (id === null || id === undefined) return
      // Remove duplicate if already exists
      const filtered = state.ids.filter(existingId => existingId !== id)
      // Prepend and cap at MAX_ITEMS
      const updated = [id, ...filtered].slice(0, MAX_ITEMS)
      state.ids = updated
      saveToStorage(updated)
    },
    clearRecentlyViewed: (state) => {
      state.ids = []
      saveToStorage([])
    },
  },
})

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions

export const selectRecentlyViewedIds = (state) => state.recentlyViewed.ids || []

export const selectRecentlyViewed = (state) => {
  const ids = state.recentlyViewed.ids || []
  const products = state.products.items || []
  return ids.map(id => products.find(p => p.id === id)).filter(Boolean)
}

export default recentlyViewedSlice.reducer
