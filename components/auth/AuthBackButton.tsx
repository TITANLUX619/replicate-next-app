'use client'

import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const AuthBackButton = ({ label, href }: AuthBackButtonProps) => {
  return (
    <Button
      className='w-full font-normal'
      onClick={() => console.log('Back')}
      variant='link'
      size='sm'
      asChild
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}

export default AuthBackButton