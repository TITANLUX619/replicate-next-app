'use client'

import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'
import GoogleLoginButton from './GoogleLoginButton'

const Social = () => {
  return (
    <div className="flex items-center w-full">
      <GoogleLoginButton />
    </div>
  )
}

export default Social