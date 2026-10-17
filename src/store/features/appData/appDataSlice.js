import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch app data from the API
export const fetchAppData = createAsyncThunk('appData/fetchAppData', async () => {
  const response = await axios.get('/get-app-data');
  return response.data.response.appData;  // Directly returning the appData object
});

export const appDataSlice = createSlice({
  name: 'appData',
  initialState: {
    appData: {
      enable_desawar: null,
      enable_desawar_only: null,
      withdraw_open_time: '10:00:00',
      withdraw_close_time: '22:00:00',
    },
    lastReadNotificationId: Number(localStorage.getItem("lastReadNotificationId")) || 0,
    status: 'idle',
    error: null
  },
  reducers: {
    setAppData: (state, action) => {
      state.appData = action.payload;
    },
    setWalletBalances: (state, action) => {
      if (!state.appData.user) return;
      for (const key of ['balance', 'cash_balance', 'bonus_balance', 'total_balance']) {
        if (action.payload[key] !== undefined) state.appData.user[key] = action.payload[key];
      }
    },
    setLastReadNotificationId: (state, action) => {
      state.lastReadNotificationId = action.payload;
    },
    setAuthDataUsersSingleValue: (state, action) => {
      if (!state.appData.user) return;
      state.appData.user[action.payload.key] = action.payload.value;
      if (action.payload.key === 'balance' || action.payload.key === 'bonus_balance') {
        state.appData.user.cash_balance = state.appData.user.balance;
        state.appData.user.total_balance = Number(state.appData.user.balance || 0) + Number(state.appData.user.bonus_balance || 0);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { enable_desawar, enable_desawar_only, withdraw_open_time, withdraw_close_time } = action.payload;
        state.appData = {
          ...action.payload,
          enable_desawar,
          enable_desawar_only,
          withdraw_open_time: withdraw_open_time || '10:00:00',
          withdraw_close_time: withdraw_close_time || '22:00:00',
        };
      })
      .addCase(fetchAppData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setAppData, setLastReadNotificationId, setAuthDataUsersSingleValue, setWalletBalances } = appDataSlice.actions;

export default appDataSlice.reducer;
