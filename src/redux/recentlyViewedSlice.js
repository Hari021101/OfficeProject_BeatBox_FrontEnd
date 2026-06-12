import { createSlice } from '@reduxjs/toolkit'

const MAX_ITEMS = 8
const STORAGE_KEY = 'bb_recently_viewed'

// Load from localStorage on boot
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addRecentlyViewed: (state, action) => {
      const product = action.payload
      // Remove duplicate if already exists
      const filtered = state.items.filter(p => p.id !== product.id)
      // Prepend and cap at MAX_ITEMS
      const updated = [product, ...filtered].slice(0, MAX_ITEMS)
      state.items = updated
      saveToStorage(updated)
    },
    clearRecentlyViewed: (state) => {
      state.items = []
      saveToStorage([])
    },
  },
})

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions

export const selectRecentlyViewed = (state) => state.recentlyViewed.items

export default recentlyViewedSlice.reducer
