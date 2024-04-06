import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface messageProps {
  id: string,
  chat_id: string,
  sender: string,
  content: string,
  score: number
}
type chatState = {
  chat: messageProps[]
}

const initialState = {
  chat: [
  ]
} as chatState;

export const chat = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    set_messages: (state, action: PayloadAction<messageProps[]>) => {
      state.chat = action.payload;
    },
    add_message: (state, action: PayloadAction<messageProps>) => {
      state.chat = [...state.chat, action.payload];
    },
    like_message: (state, action: PayloadAction<string>) => {
      let new_chat = state.chat.map((cht)=>{
        if(cht.id == action.payload){
          return {
            id: cht.id,
            chat_id: cht.chat_id,
            sender: cht.sender,
            content: cht.content,
            score: 1
          }
        }
        else{
          return cht;
        }
      })

      state.chat=new_chat
    },
    dislike_message: (state, action: PayloadAction<string>) => {
      let new_chat = state.chat.map((cht)=>{
        if(cht.id == action.payload){
          return {
            id: cht.id,
            chat_id: cht.chat_id,
            sender: cht.sender,
            content: cht.content,
            score: -1
          }
        }
        else{
          return cht;
        }
      })
      state.chat=new_chat
    },
  }
})

export const { set_messages, add_message, like_message, dislike_message } = chat.actions;
export default chat.reducer;