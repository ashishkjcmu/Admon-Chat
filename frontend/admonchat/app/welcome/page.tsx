"use client";
import Head from 'next/head'
import { redirect, usePathname, useRouter } from "next/navigation";
import { CSSProperties } from 'react';

export default function Home() {
  const router = useRouter()

  const handleBtnClick = () => {
    router.push('/')
  }

  const backgroundStyle: CSSProperties = {
    background: 'linear-gradient(to right, #4b0082, #1f1f1f)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
  };

  const headingStyle: CSSProperties = {
    fontSize: '4rem',
    fontWeight: 'bold',
    padding: '20px',
  };

  const nameStyle: CSSProperties = {
    fontStyle: 'italic',
  };

  return (
    <div style={backgroundStyle}>
      <Head>
        <title>AdmonChat</title>
        <meta name="description" content="Landing page for AdmonChat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="text-center p-8">
        <h1 style={headingStyle}>AdmonChat</h1>
        <p className="text-lg">
          AdmonChat processes a company's PDFs to answer questions or generates a knowledge base from the company's name and answers questions accordingly.
        </p>
        <p className="text-sm mt-4">
          Made by <span style={nameStyle}>Ashish Kumar Jha</span>
        </p>
      </div>

      <button onClick={handleBtnClick} className="px-8 py-4 bg-red-700 text-white font-bold text-xl rounded hover:bg-red-700 transition duration-300">
        Get Started
      </button>

      <style jsx>{`
        @media only screen and (max-width: 600px) {
          .text-center {
            padding: 0 20px;
          }
          body {
            background: linear-gradient(to right, #4b0082, #1f1f1f);
          }
        }
      `}</style>
    </div>
  );
}