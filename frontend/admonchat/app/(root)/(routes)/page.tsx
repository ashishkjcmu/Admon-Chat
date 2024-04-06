import { Separator } from '@/components/ui/separator'
import React from 'react'
import { redirect, usePathname, useRouter } from "next/navigation";


const RootPage = () => {
  return redirect('/new_chat')
}

export default RootPage