'use client'

import React, { useTransition } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { newPasswordFormSchema } from '@/schemas';
import { Loader2 } from 'lucide-react';
import AuthCardWrapper from './AuthCardWrapper';
import AuthInput from './AuthInput';
import { setNewPassword } from '@/actions/auth-actions';
import useToast from '@/hooks/useToast'
import { useRouter, useSearchParams } from 'next/navigation'

const NewPasswordForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || undefined
  const addToast = useToast();

  const form = useForm<z.infer<typeof newPasswordFormSchema>>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: { newPassword: '' },
  })

  async function onSubmit(formData: z.infer<typeof newPasswordFormSchema>) {
    try {
      startTransition(async () => {
        const result = await setNewPassword({
          newPassword: formData.newPassword,
          token: token

        })

        addToast({ type: result?.type, message: result?.message })

        if (result.type === 'success') router.push('/')

      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <AuthCardWrapper
        headerLabel='Enter your new password'
        backbuttonLabel='Back to sign in'
        backButtonHref='/sign-in'
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AuthInput
              id='new-password-password'
              control={form.control}
              type='password'
              name='password'
              label="New Password"
              placeholder='********'
              disabled={isPending}
            />
            <div className="flex flex-col gap-4">
              <Button type="submit" onClick={() => onSubmit(form.getValues())} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : 'Reset passworld'}
              </Button>
            </div>
          </form>
        </Form>
      </AuthCardWrapper>
    </div>
  )
}

export default NewPasswordForm
