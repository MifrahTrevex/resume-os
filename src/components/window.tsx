
"use client";

import { useRef, useState, useEffect } from 'react';
import { useDraggable } from '@/hooks/use-draggable';
import { Minus, Square, X, ChevronsDownUp } from 'lucide-react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  initialSize: { width: number; height: number };
}

export default function Window({ title, children, onClose, onFocus, zIndex, initialSize }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const { position, setPosition } = useDraggable(windowRef, handleRef);
  const [isMaximized, setIsMaximized] = useState(false);
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const prevSizeRef = useRef(initialSize);

  useEffect(() => {
    // Store initial position once it's set by the draggable hook
    if (position.x !== 0 || position.y !== 0) {
      prevPositionRef.current = position;
    }
  }, [position]);

  const handleMaximizeToggle = () => {
    if (isMaximized) {
      // Restore
      if (windowRef.current) {
          windowRef.current.style.width = `${prevSizeRef.current.width}px`;
          windowRef.current.style.height = `${prevSizeRef.current.height}px`;
      }
      setPosition(prevPositionRef.current);
    } else {
      // Maximize
      prevPositionRef.current = position;
       if (windowRef.current) {
           prevSizeRef.current = {
               width: windowRef.current.offsetWidth,
               height: windowRef.current.offsetHeight,
           };
           windowRef.current.style.width = '100%';
           windowRef.current.style.height = '100%';
       }
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
  };
  
  const windowStyles: React.CSSProperties = {
      zIndex: zIndex,
      transform: 'translateZ(0)',
  };

  if (!isMaximized) {
      windowStyles.top = `${position.y}px`;
      windowStyles.left = `${position.x}px`;
      windowStyles.width = `${initialSize.width}px`;
      windowStyles.height = `${initialSize.height}px`;
  } else {
      windowStyles.top = '0px';
      windowStyles.left = '0px';
      windowStyles.width = '100vw';
      windowStyles.height = '100vh';
  }


  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-card border-2 border-t-white/20 border-l-white/20 border-b-black/50 border-r-black/50 shadow-2xl ${isMaximized ? 'rounded-none' : 'rounded-sm'}`}
      style={windowStyles}
      onMouseDown={onFocus}
    >
      <div
        ref={handleRef}
        className={`flex items-center justify-between p-1 bg-gradient-to-b from-primary to-blue-700 ${isMaximized ? 'rounded-none' : 'rounded-t-sm'} cursor-grab active:cursor-grabbing`}
        onDoubleClick={handleMaximizeToggle}
      >
        <span className="text-sm font-bold text-primary-foreground select-none ml-1">{title}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded-sm transition-colors bg-card/50 hover:bg-card/80"><Minus size={14} className="text-primary-foreground" /></button>
          <button onClick={handleMaximizeToggle} className="p-1 rounded-sm transition-colors bg-card/50 hover:bg-card/80">
            {isMaximized ? <ChevronsDownUp size={14} className="text-primary-foreground" /> : <Square size={14} className="text-primary-foreground" />}
          </button>
          <button onClick={onClose} className="p-1 rounded-sm transition-colors bg-red-500/80 hover:bg-red-500">
            <X size={14} className="text-primary-foreground" />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-card">
        {children}
      </div>
    </div>
  );
}
