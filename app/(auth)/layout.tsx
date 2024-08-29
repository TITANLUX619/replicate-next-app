import AuthHeader from '@/components/auth/AuthCardHeader';
import '../globals.css'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="auth-container">
      <div className='auth-content'>
        {children}
      </div>
    </main>
  );
}
