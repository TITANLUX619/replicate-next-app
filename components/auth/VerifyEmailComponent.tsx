'use client';

import { verifyToken } from '@/actions/verification-token-actions';
import AuthCardWrapper from '@/components/auth/AuthCardWrapper'
import useToast from '@/hooks/useToast';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { BeatLoader } from 'react-spinners'

function VerifyEmailComponent() {
  const searchParams = useSearchParams()
  const verificationToken = searchParams.get('token')
  const addToast = useToast()

  const onSubmit = async () => {
    if (verificationToken) {
      const result = await verifyToken(verificationToken)

      addToast({ type: result?.type, message: result?.message })
    }
  }

  useEffect(() => {
    onSubmit()

    return () => {
      console.log('unmounting');

    }
  }), []

  return (
    <AuthCardWrapper
      headerLabel="Confirming your verification"
      backbuttonLabel='Back to sign in'
      backButtonHref='/sign-in'
    >
      <div className="flex w-full items-center justify-center">
        <BeatLoader color='#FF7043' />
      </div>
    </AuthCardWrapper>
  )
}

export default VerifyEmailComponent
