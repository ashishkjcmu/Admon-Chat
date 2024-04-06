// Importing required dependencies and components
"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from "next/navigation";
import { add_chat, set_chats } from "@/redux/features/chats-slice";
import { set_chat_title } from "@/redux/features/project-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

type Props = {}

/**
 * Component for creating a new chat thread.
 * @param props - The component props.
 * @returns The JSX element representing the new chat component.
 */
const NewChat = (props: Props) => {
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
      setIsHydrated(true)
    }, []);
  
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // Resetting chat title
    dispatch(set_chat_title(""))

    const { user } = useUser()
    const [loading, setLoading] = useState(false);
    const user_email = user?.emailAddresses[0]?.emailAddress
    const [company, setCompany] = useState("")

    /**
     * Handles the form submission for uploading a PDF file.
     * @param event - The form submission event.
     */
    const handleSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault();
        const formData = new FormData();
        const fileField: any = document.querySelector('input[type="file"]');

        formData.append('file', fileField.files[0]);

        const response = await fetch(`http://127.0.1:5000/${user_email}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            dispatch(add_chat({id: data.chat_id, title: data.title}))
            router.push(`/chats/${data.chat_id}`)
            console.log('File uploaded successfully');
        } else {
            console.error('Upload failed');
        }
        setLoading(false)
    };

    /**
     * Handles the submission of the company name.
     * @param e - The event object.
     */
    const submit_company = async (e: any) => {
        if(company===""){
            console.log("Company name empty")
            return
        }
        console.log("Submitting company :", company)
        const formData = new FormData();
        formData.append('company', company);

        const response = await fetch(`http://127.0.1:5000/company/${user_email}/submit`, {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();            
            console.log("Successfully submitted company", data)
            dispatch(add_chat({id: data.chat_id, title: data.title}))
            router.push(`/chats/${data.chat_id}`)
            console.log('Company researched successfully');

        } else {
            console.error('Upload failed');
        }
    }

    if (!isHydrated) {
        return null
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
          <div className="space-y-2 w-full col-span-2">
            <h3 className="text-lg font-medium">Start New Chat Thread</h3>
            <p className="text-sm text-muted-foreground">
              Please start by providing a reference PDF document or company name.
            </p>
            <Separator className="bg-primary/10" />
    
            {/* Upload File Form */}
            <div className="py-32 text-center"> {/* Increased top padding and centered form elements */}
              <form onSubmit={handleSubmit} className="mb-4"> {/* Added margin-bottom for separation */}
                <input type="file" name="file" />
                <Button className='mt-4' disabled={loading}>
                  <button type="submit">Upload</button>
                </Button>
              </form>
              <p className="mt-4">Please select a PDF file.</p>
            </div>
    
            <Separator />
    
            {/* Submit Company Form */}
            <div className="mt-24 text-center"> {/* Centered form elements */}
              <Input type="text" placeholder="Company name" onChange={(e) => setCompany(e.target.value)} />
              <Separator className="bg-primary/10" />
              <Button className="mt-4" onClick={(e) => submit_company(e)}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      );
    };

export default NewChat