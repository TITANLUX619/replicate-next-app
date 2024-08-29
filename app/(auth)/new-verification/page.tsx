import VerifyEmailComponent from '@/components/auth/VerifyEmailComponent';
import React, { Suspense } from 'react'

const NewVerification = () => {
  return (
    <Suspense>
      <VerifyEmailComponent />
    </Suspense>
  )
}

export default NewVerification