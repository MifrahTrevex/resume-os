
"use client";

import { useState, useEffect, useRef, type RefObject } from 'react';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

interface UseResizableOptions {
  initialSize: { width: number; height: number };
}

export function useResizable(elRef: RefObject<HTMLElement>, { initialSize }: UseResizableOptions) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      // Check if the click is on the resize handle
      const target = e.target as HTMLElement;
      if (target.style.cursor !== 'se-resize') return;
      
      e.preventDefault();
      isResizingRef.current = true;
      setIsResizing(true);

      const startSize = { ...size };
      const startPos = { x: e.clientX, y: e.clientY };

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizingRef.current) return;
        
        const dx = moveEvent.clientX - startPos.x;
        const dy = moveEvent.clientY - startPos.y;

        const newWidth = Math.max(MIN_WIDTH, startSize.width + dx);
        const newHeight = Math.max(MIN_HEIGHT, startSize.height + dy);
        
        setSize({ width: newWidth, height: newHeight });
      };

      const onMouseUp = () => {
        isResizingRef.current = false;
        setIsResizing(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    el.addEventListener('mousedown', onMouseDown);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [size, elRef]);

  return { size, isResizing };
}
