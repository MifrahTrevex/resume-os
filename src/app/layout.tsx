
import type {Metadata} from 'next';
import './globals.css';
import '../styles/crt.css';
import '../styles/shooter.css';
import '../styles/desktop-background.css';
import '../styles/monitor.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'Dickens Okoth Otieno\'s Desktop CV',
  description: 'Dickens Okoth Otieno\'s Interactive CV',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-black flex items-center justify-center min-h-screen">
        <AuthProvider>
          <div className="monitor">
            <div className="monitor-screen">
              <div className="crt-overlay"></div>
              {children}
            </div>
            <div className="monitor-stand">
                <div className="monitor-stand-base"></div>
            </div>
            <div className="monitor-brand">Fragment OS</div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
