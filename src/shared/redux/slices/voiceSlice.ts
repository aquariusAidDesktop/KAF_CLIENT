import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Используем localStorage для хранения настроек

interface VoiceState {
  isVoiceInputEnabled: boolean;
}

const initialState: VoiceState = {
  isVoiceInputEnabled: false, // По умолчанию отключено
};

const voiceSlice = createSlice({
  name: "voice",
  initialState,
  reducers: {
    toggleVoiceInput(state) {
      state.isVoiceInputEnabled = !state.isVoiceInputEnabled;
    },
  },
});

export const { toggleVoiceInput } = voiceSlice.actions;

const persistConfig = {
  key: "voice",
  storage,
};

export const voiceReducer = persistReducer(persistConfig, voiceSlice.reducer);
