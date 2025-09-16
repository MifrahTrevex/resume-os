
"use client";

import Desktop from '@/components/desktop';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

export default function Home() {
  const { loading } = useAuth();
  const [powerState, setPowerState] = useState<'running' | 'confirming' | 'off'>('running');

  if (loading) {
      return (
          <div className="w-screen h-screen bg-black flex items-center justify-center text-primary font-code">
              Loading Auth...
          </div>
      )
  }
  
  const handlePowerButtonClick = () => {
    if (powerState === 'running') {
      setPowerState('confirming');
    }
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
        <div className="monitor" data-state={powerState}>
            <div className="monitor-screen">
                <div className="crt-overlay"></div>
                <Desktop powerState={powerState} setPowerState={setPowerState} />
            </div>
            <div className="monitor-brand">
                <span>Fragment OS</span>
                <button 
                  className="power-button" 
                  data-state={powerState}
                  onClick={handlePowerButtonClick}
                  aria-label="Toggle Power"
                />
            </div>
        </div>
    </main>
  );
}
