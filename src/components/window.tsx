
"use client";

import { useRef, useState, useEffect } from 'react';
import { useDraggable } from '@/hooks/use-draggable';
import { useResizable } from '@/hooks/use-resizable';
import { Minus, Square, X, ChevronsDownUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onGoBack?: () => void;
  zIndex: number;
  initialSize: { width: number; height: number };
  isActive: boolean;
}

export default function Window({ title, children, onClose, onFocus, onMinimize, onGoBack, zIndex, initialSize, isActive }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  
  const { position, setPosition } = useDraggable(windowRef, handleRef);
  const { size, isResizing } = useResizable(windowRef, { initialSize });

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
      setPosition(prevPositionRef.current);
    } else {
      // Maximize
      prevPositionRef.current = position;
      if (windowRef.current) {
           prevSizeRef.current = {
               width: windowRef.current.offsetWidth,
               height: windowRef.current.offsetHeight,
           };
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
      windowStyles.width = `${size.width}px`;
      windowStyles.height = `${size.height}px`;
  } else {
      windowStyles.top = '0px';
      windowStyles.left = '0px';
      windowStyles.width = '100vw';
      windowStyles.height = 'calc(100vh - 40px)';
  }


  return (
    <div
      ref={windowRef}
      className={cn(
        'absolute flex flex-col bg-card shadow-lg transition-shadow duration-200',
        isMaximized ? 'rounded-none' : 'rounded-sm',
        isResizing ? 'transition-none' : 'transition-[width,height,top,left] duration-150 ease-out',
        isActive ? 'border-primary shadow-primary/30' : 'border-border shadow-black/50',
        'border-2'
      )}
      style={windowStyles}
      onMouseDown={onFocus}
    >
      <div
        ref={handleRef}
        className={`flex items-center justify-between p-1 bg-gradient-to-b from-primary/80 to-primary/50 ${isMaximized ? '' : 'rounded-t-sm'} cursor-grab active:cursor-grabbing`}
        onDoubleClick={handleMaximizeToggle}
      >
        <div className="flex items-center gap-2">
             {onGoBack && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent focus and drag
                        onGoBack();
                    }}
                >
                    <ArrowLeft size={16} className="text-primary-foreground" />
                </Button>
            )}
            <span className="text-sm font-bold text-primary-foreground select-none ml-1 truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMinimize} className="p-1 rounded-sm transition-colors bg-card/50 hover:bg-card/80"><Minus size={14} className="text-foreground" /></button>
          <button onClick={handleMaximizeToggle} className="p-1 rounded-sm transition-colors bg-card/50 hover:bg-card/80">
            {isMaximized ? <ChevronsDownUp size={14} className="text-foreground" /> : <Square size={14} className="text-foreground" />}
          </button>
          <button onClick={onClose} className="p-1 rounded-sm transition-colors bg-red-500/80 hover:bg-red-500">
            <X size={14} className="text-primary-foreground" />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-card relative">
        {children}
        {!isMaximized && (
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                style={{
                    backgroundImage: `linear-gradient(to top left, hsl(var(--border)) 0%, hsl(var(--border)) 15%, transparent 15%)`
                }}
            ></div>
        )}
      </div>
    </div>
  );
}
