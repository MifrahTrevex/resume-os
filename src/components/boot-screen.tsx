
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const bootMessages = [
  'Booting Fragment OS...',
  'Loading kernel modules...',
  'Initializing hardware interfaces...',
  'Mounting virtual file system...',
  'Starting network services...',
  'Verifying user credentials...',
  'Loading desktop environment...',
  'System ready.',
];

const AsciiArt = () => (
  <pre className="text-sm leading-tight">
    {`
      ___                   
     | __|                  | |
     | |________ ______ ____| |
     |  _ \\  _  \\\\  _  \\\\ __ |
     | | | | | | | | | | |   |
     | |_| | | | | | | | |___|
     |____/ \\_/ \\_/ \\_/ \\____/
            \\_/
             |
    `}
  </pre>
);

export default function BootScreen() {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setShowContent(true);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(messageInterval);
          return bootMessages.length - 1;
        }
        return prev + 1;
      });
    }, 400);
    
    const fadeOutTimer = setTimeout(() => {
        setFadeOut(true);
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(fadeOutTimer);
    };
  }, []);
  
  const progressBarPattern = '||||||||||||||||||||'; // 20 chars
  const filledLength = Math.floor((progress / 100) * progressBarPattern.length);
  const filled = progressBarPattern.substring(0, filledLength);
  const remaining = ' '.repeat(progressBarPattern.length - filledLength);


  return (
    <div className={cn(
        "fixed inset-0 bg-black text-foreground font-code flex flex-col items-center justify-center transition-opacity duration-500",
        showContent ? "opacity-100" : "opacity-0",
        fadeOut ? "opacity-0" : "opacity-100",
    )}>
      <div className="w-full max-w-2xl p-4">
        <div className="mb-4">
            <p>Initializing system...</p>
            <div className="flex items-center gap-2">
                <span>Loading kernel</span>
                <div className="flex-grow h-4 bg-[#222] border border-[#444]">
                    <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                </div>
                <span>{progress}%</span>
            </div>
             <div className="h-24 overflow-hidden text-muted-foreground">
                {bootMessages.slice(0, currentMessageIndex + 1).map((msg, i) => (
                    <p key={i} className={cn("transition-opacity duration-500", i === currentMessageIndex ? "opacity-100" : "opacity-50")}>{msg}</p>
                ))}
            </div>
        </div>
        
        <div className={cn(
            "transition-opacity duration-1000 delay-1000",
             progress > 50 ? "opacity-100" : "opacity-0"
        )}>
            <AsciiArt />
            <div className="text-center mt-2">
                <h1 className="text-xl font-bold">Fragment OS</h1>
                <p className="text-sm text-muted-foreground">Clarity in the cracks</p>
            </div>
        </div>
      </div>
    </div>
  );
}
