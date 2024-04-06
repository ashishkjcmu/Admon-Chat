"use client";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import { SquarePlus, Plus, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from '@clerk/nextjs';
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import { add_chat, set_chats } from "@/redux/features/chats-slice";
import axios from 'axios';
import { Separator } from "@/components/ui/separator";

export const Sidebar = () => {
  const router = useRouter();
  const { user } = useUser();
  const user_email = user?.emailAddresses[0]?.emailAddress
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { chats } = useAppSelector((state) => state.chatsReducer);
  const onNavigate = (url: string) => {
    return router.push(url);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user_email) {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/user/${user_email}/chats`);
          dispatch(set_chats(response.data));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [user_email])

  const routes = [
    {
      icon: Plus,
      href: '/companion/new',
      label: "Create",
      pro: true,
    },
    {
      icon: Settings,
      href: '/settings',
      label: "Settings",
      pro: false,
    },
  ];
  const maxLength = 30;
  return (
    <div className="flex flex-col h-full text-primary bg-secondary w-80">
      <div className="cursor-pointer h-16 flex items-center text-sm justify-between p-8" onClick={() => { onNavigate('/new_chat') }}>
        <div>
          New Chat
        </div>
        <div >
          <SquarePlus />
        </div>
      </div>
      <Separator></Separator>
      <div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "text-muted-foreground text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
              pathname.includes(chat.id) && "bg-primary/10 text-primary",
            )}
            onClick={() => { onNavigate(`/chats/${chat.id}`) }}
          >
            <div className="flex flex-col gap-y-2 flex-1">
              {chat.title.length > maxLength ? chat.title.substring(0, maxLength) + '...' : chat.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary w-80">
      <div className="pl-3 pr-3 flex-1 flex justify-stretch">
        <div className="space-y-0">
          <div
            onClick={() => { }}
            className="h-16 bg-slate-600"
          >
            <div className="flex flex-col gap-y-2 items-center flex-1 justify-center">
              New Chat
            </div>
          </div>
          {routes.map((route) => (
            <div
              onClick={() => onNavigate(route.href)}
              key={route.href}
              className={cn(
                "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href && "bg-primary/10 text-primary",
              )}
            >
              <div className="flex flex-col gap-y-2 items-center flex-1">
                {route.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};