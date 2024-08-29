'use client'

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { FaUser } from 'react-icons/fa'
import SignOutButton from './SignOutButton'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { ExitIcon } from '@radix-ui/react-icons'
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
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button
            className='w-full font-normal'
            size='sm'
            onClick={() => { router.push('/settings') }}
          >
            <p>
              User Menu
            </p>
          </Button>
        </DropdownMenuItem>
        <SignOutButton>
          <DropdownMenuItem className='cursor-pointer'>
            <ExitIcon className='w-4 h-4 mr-2' />
            Log Out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu