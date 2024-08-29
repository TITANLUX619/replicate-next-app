import { cn } from '@/lib/utils'
import React from 'react'

const AuthCardHeader = ({ label }: AuthHeaderProps) => {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
      <h1 className={cn('text-3xl font-semibold mr-3')}>
        🔑 Auth
      </h1>
      <p className='text-muted-foreground text-sm text-grey'>
        {label}
      </p>
    </div>
  )
}

export default AuthCardHeader