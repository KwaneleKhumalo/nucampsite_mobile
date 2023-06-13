import { createSlice } from "@reduxjs/toolkit"

export const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    toggleFavorite: (favorite, action) => {}
  }
})
