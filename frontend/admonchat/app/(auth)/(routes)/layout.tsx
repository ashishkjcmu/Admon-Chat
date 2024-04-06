import React from 'react'

const AuthLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='flex items-center justify-center h-svh'>{children}</div>
  )
}

export default AuthLayout