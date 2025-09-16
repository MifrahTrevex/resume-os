"use client";

import { useRef } from 'react';
import { useDraggable } from '@/hooks/use-draggable';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

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
      className="absolute flex flex-col bg-card border border-border shadow-2xl rounded-lg"
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
        className="flex items-center justify-between p-2 bg-primary rounded-t-lg cursor-grab active:cursor-grabbing"
      >
        <span className="text-sm font-bold text-primary-foreground select-none">{title}</span>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-destructive/80">
          <X size={14} className="text-primary-foreground" />
        </button>
      </div>
      <div className="flex-grow overflow-auto bg-background/80 backdrop-blur-sm rounded-b-lg">
        {children}
      </div>
    </div>
  );
}
