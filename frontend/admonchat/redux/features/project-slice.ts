import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface projectProps {
  chat_title: string,
}
type projectState = {
  project: projectProps[]
}

const initialState = {
  chat_title: "Randomchat"
} as projectProps;

export const project = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    set_chat_title: (state, action: PayloadAction<string>) => {
      state.chat_title = action.payload;
    },
  }
})

export const { set_chat_title } = project.actions;
export default project.reducer;