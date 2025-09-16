
"use client";

import Desktop from '@/components/desktop';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
      return (
          <div className="w-screen h-screen bg-black flex items-center justify-center text-primary font-code">
              Loading Auth...
          </div>
      )
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
        <div className="monitor">
            <div className="monitor-screen">
                <div className="crt-overlay"></div>
                <Desktop />
            </div>
        </div>
    </main>
  );
}
