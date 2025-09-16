"use client";

import { useRef } from 'react';
import { useDraggable } from '@/hooks/use-draggable';
import { cn } from '@/lib/utils';
import { Minus, Square, X } from 'lucide-react';

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
  const position = useDraggable(windowRef, handleRef);

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col bg-card border-2 border-t-white/20 border-l-white/20 border-b-black/50 border-r-black/50 shadow-2xl rounded-sm"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${initialSize.width}px`,
        height: `${initialSize.height}px`,
        zIndex: zIndex,
        transform: 'translateZ(0)',
      }}
      onMouseDown={onFocus}
    >
      <div
        ref={handleRef}
        className="flex items-center justify-between p-1 bg-gradient-to-b from-primary to-blue-700 rounded-t-sm cursor-grab active:cursor-grabbing"
      >
        <span className="text-sm font-bold text-primary-foreground select-none ml-1">{title}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded-sm bg-card/50 hover:bg-card/80"><Minus size={14} className="text-primary-foreground" /></button>
          <button className="p-1 rounded-sm bg-card/50 hover:bg-card/80"><Square size={14} className="text-primary-foreground" /></button>
          <button onClick={onClose} className="p-1 rounded-sm bg-red-500/80 hover:bg-red-500">
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
