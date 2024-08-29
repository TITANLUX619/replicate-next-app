import { cookies } from 'next/headers'

type ToastType = 'default' | 'error' | 'success' | 'warning' | 'info'

export function addServerToast({ title, description, type }: { title?: string, description: string, type: ToastType }) {
  const toastData = JSON.stringify({ title, description, type })
  cookies().set('toast', toastData, { path: '/' })
}