import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth/auth';
import '../globals.css';
import Navbar from '@/components/Navbar';
import { Suspense } from 'react';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="main-container">
        <Suspense>
          <Navbar />
        </Suspense>
        <div className='main-content'>
          {children}
        </div>
      </main>
    </SessionProvider>
  );
}
