"use client";

import { SendHorizonal } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatFormProps {
  input: string;
  // handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
//   onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  msgSubmit: (msg: string)=>void
  isLoading: boolean;
}

export const ChatForm = ({
  input,
  msgSubmit,
  isLoading,
}: ChatFormProps) => {

  const [message, setMessage] = useState<string>("")
  const handleChange = (event: any) => {
    setMessage(event.target.value);
};

// const send_message = async (msg: string) => {
//   if (user_email) {
//     try {
//       const formData = new FormData();
//       formData.append('sender', user_email);
//       formData.append('content', msg);

//       const response = await fetch(`http://127.0.0.1:5000/send_message/${the_chat_id}`,
//         {
//           method: 'POST',
//           body: formData,
//         });
//       if (response.ok) {
//         const data = await response.json();
//         console.log(data)
//         // dispatch(add_chat({id: data.chat_id, title: data.title}))
//         // router.push(`/chats/${data.chat_id}`)
//         // console.log('File uploaded successfully');
//       } else {
//         console.error('Upload failed');
//       }
//       // dispatch(set_chats(response.data));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }
// };

  return (
    <form onSubmit={(e)=>{e.preventDefault(); msgSubmit(message); setMessage("")}} className="border-t border-primary/10 py-4 flex items-center gap-x-2">
      <Input
        disabled={isLoading}
        value={message}
        onChange={handleChange}
        placeholder="Type a message"
        className="rounded-lg bg-primary/10"
      />
      <Button disabled={isLoading} variant="ghost">
        <SendHorizonal className="w-6 h-6" />
      </Button>
    </form>
  )
}