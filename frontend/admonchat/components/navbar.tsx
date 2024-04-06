"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Sparkles } from "lucide-react";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const font = Poppins({ weight: "600", subsets: ["latin"] });

export const Navbar = () => {
  const { chat_title } = useAppSelector((state) => state.projectReducer);
  return ( 
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSidebar />
        <Link href="/">
          <h2 className={cn("hidden md:block text-xl md:text-2xl font-bold text-primary", font.className)}>
            {process.env.NEXT_PUBLIC_APPLICATION_NAME}
          </h2>
        </Link>
      </div>
      <div className="flex items-center md:mr-80">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}