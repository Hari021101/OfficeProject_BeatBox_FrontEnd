import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'

const STORAGE_KEY = 'bb_compare_items'

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
  } catch (e) { /* ignore storage errors */ }
}

const compareSlice = createSlice({
  name: 'compare',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload
      if (state.items.find(p => p.id === product.id)) {
        toast('Product is already in comparison.', { icon: 'ℹ️' })
        return
      }
      
      if (state.items.length >= 3) {
        toast.error('You can only compare up to 3 products at a time.')
        return
      }
      
      state.items.push(product)
      saveToStorage(state.items)
      toast.success(`${product.name} added to comparison!`)
    },
    removeFromCompare: (state, action) => {
      const id = action.payload
      state.items = state.items.filter(p => p.id !== id)
      saveToStorage(state.items)
    },
    clearCompare: (state) => {
      state.items = []
      saveToStorage(state.items)
    },
  },
})

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions
export const selectCompareItems = (state) => state.compare.items
export default compareSlice.reducer
