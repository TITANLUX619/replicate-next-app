'use client'

import React from 'react'
import { signOut } from 'next-auth/react'

const SignOutButton = ({ children }: AuthSignOutButtonProps) => {

  return (
    <div onClick={() => signOut()} className='cursor-pointer'>
      {children}
    </div>
  )
}

export default SignOutButton