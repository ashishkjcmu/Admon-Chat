import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface chatProps {
  id: string,
  title: string, 
}
type chatsState = {
  chats: chatProps[]
}

const initialState = {
  chats: []
} as chatsState;

export const chats = createSlice({
  name: "chats",
  initialState: initialState,
  reducers: {
    set_chats: (state, action: PayloadAction<chatProps[]>) => {
      state.chats = action.payload;
    },
    add_chat: (state, action: PayloadAction<chatProps>) => {
      state.chats = [...state.chats, action.payload];
    },
  }
})

export const { add_chat, set_chats } = chats.actions;
export default chats.reducer;