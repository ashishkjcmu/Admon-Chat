"use client";

import { BeatLoader } from "react-spinners";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
// import { BotAvatar } from "@/components/bot-avatar"
// import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import { like_message, dislike_message } from "@/redux/features/chat-slice";

export interface ChatMessageProps {
    id: string;
    sender: string;
    score: number;
    content?: string;
}

export const ChatMessage = ({
    id, content, sender, score
}: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const OnLike = async (e: any) => {
        try {
            console.log("Liking message :", id)
            e.preventDefault()
            const response = await axios.post(`http://127.0.0.1:5000/message/${id}/like`);
            dispatch(like_message(id));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const OnDislike = async (e: any) => {
        try {
            console.log("Disiking message :", id)
            e.preventDefault()
            const response = await axios.post(`http://127.0.0.1:5000/message/${id}/dislike`);
            dispatch(dislike_message(id));
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    const onCopy = () => {
        if (!content) {
            return;
        }

        navigator.clipboard.writeText(content);
        toast({
            description: "Message copied to clipboard.",
            duration: 3000,
        })
    }

    return (
        <div className={cn(
            "group flex items-start gap-x-3 py-4 w-full",
            sender !== "gpt@openai.com" && "justify-end"
        )}>
            <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
                {false
                    ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} />
                    : content
                }
            </div>
            {sender === "gpt@openai.com" && (
                <>
                    <Button
                        onClick={OnLike}
                        className="opacity-100 group-hover:opacity-100 transition"
                        size="icon"
                        variant="ghost"
                    >
                        <ThumbsUp className="w-4 h-4" color={score>0?"green":"gray"}/>
                    </Button>
                    <Button
                        onClick={OnDislike}
                        className="opacity-100 group-hover:opacity-100 transition"
                        size="icon"
                        variant="ghost"
                    >
                        <ThumbsDown className="w-4 h-4" color={score<0?"red":"gray"} />
                    </Button></>
            )}
        </div>
    )
}