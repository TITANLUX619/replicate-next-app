'use client'

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { FaUser } from 'react-icons/fa'
import SignOutButton from './SignOutButton'
import { useRouter } from 'next/navigation'
import { ExitIcon, GearIcon } from '@radix-ui/react-icons'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const UserMenu = () => {
  const user = useCurrentUser()
  const router = useRouter()

  console.log(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback>
            <FaUser className='text-white' />
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='mt-1'>
        <div onClick={() => router.push('/settings')} >
          <DropdownMenuItem className='cursor-pointer'>
            <GearIcon className='w-4 h-4 mr-2' />
            User Menu
          </DropdownMenuItem>
        </div>
        <SignOutButton>
          <DropdownMenuItem className='cursor-pointer'>
            <ExitIcon className='w-4 h-4 mr-2' />
            <p className='text-red-900'>Log Out</p>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu