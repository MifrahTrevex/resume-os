import type {Metadata} from 'next';
import './globals.css';
import '../styles/crt.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Retro Okoth Desktop',
  description: 'Dickens Okoth\'s Interactive CV',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="crt-overlay"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
