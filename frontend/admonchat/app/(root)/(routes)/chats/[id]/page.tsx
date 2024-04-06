"use client";
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

import { ChatForm } from "@/components/chat-form";
// import { ChatHeader } from "@/components/chat-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from '@clerk/nextjs';

import { add_chat, set_chats } from "@/redux/features/chats-slice";
import { set_chat_title } from "@/redux/features/project-slice";
import { add_message, set_messages } from "@/redux/features/chat-slice";

type Props = {}

const page = (props: Props) => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, []);

  const router = useRouter();
  const params = useParams()
  const { user } = useUser();
  const user_email = user?.emailAddresses[0]?.emailAddress
  const the_chat_id = params.id ? params.id : ""

  const dispatch = useDispatch<AppDispatch>();
  const { chat } = useAppSelector((state) => state.chatReducer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/chat/${params.id}/messages`);
        dispatch(set_messages(response.data));
        console.log("Chats-data", response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [])

  const send_message = async (msg: string) => {
    console.log("Submitting form for ", user_email)
    if (user_email) {
      try {
        const formData = new FormData();
        formData.append('sender', user_email);
        formData.append('content', msg);

        const response = await fetch(`http://127.0.0.1:5000/chats/${the_chat_id}/send_message`,
          {
            method: 'POST',
            body: formData,
          });
        if (response.ok) {
          const data = await response.json();
          dispatch(add_message({
            id: data.message_id,
            chat_id: the_chat_id.toString(),
            sender: user_email,
            content: msg,
            score: 0
          }));
          dispatch(add_message({
            id: data.id,
            chat_id: the_chat_id.toString(),
            sender: "gpt@openai.com",
            content: data.content,
            score: 0
          }));

          console.log("Chat response received :", data)
          // dispatch(add_chat({id: data.chat_id, title: data.title}))
          // router.push(`/chats/${data.chat_id}`)
          // console.log('File uploaded successfully');
        } else {
          console.error('Upload failed');
        }
        // dispatch(set_chats(response.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  if (!isHydrated) {
    return null
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      {/* <ChatHeader companion={companion} /> */}
      <ChatMessages
        messages={chat}
        isLoading={false}
      />
      <ChatForm
        isLoading={false}
        input={""}
        msgSubmit={send_message}
      />
    </div>
  )
}


export default page