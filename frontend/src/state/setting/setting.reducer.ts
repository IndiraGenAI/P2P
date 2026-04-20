import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  NAV_STYLE_FIXED,
  THEME_TYPE_LITE,
} from "../../utils/constants/ThemeSetting";

export type SettingsState = {
  width: number;
  themeType: string;
  navStyle: string;
};

const initialState: SettingsState = {
  width: typeof window !== "undefined" ? window.innerWidth : 1200,
  themeType: THEME_TYPE_LITE,
  navStyle: NAV_STYLE_FIXED,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateWindowWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
  },
});

export const { updateWindowWidth } = settingsSlice.actions;
export default settingsSlice.reducer;
