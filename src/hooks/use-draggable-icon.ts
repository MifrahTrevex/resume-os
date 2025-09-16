
"use client";

import { useState, useRef, useEffect, type RefObject, useCallback } from 'react';

const DRAG_THRESHOLD = 5; // pixels

export function useDraggableIcon(elRef: RefObject<HTMLElement>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elStartPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    
    // For grid layout, we don't need absolute positioning from this hook.
    // If you ever switch back to a free-floating desktop, this will need to be re-enabled.
    // el.style.position = 'absolute';

    const onMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLButtonElement && e.target !== el) {
          return;
      }
      e.preventDefault();
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      elStartPosRef.current = { x: el.offsetLeft, y: el.offsetTop };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const dx = e.clientX - dragStartPosRef.current.x;
      const dy = e.clientY - dragStartPosRef.current.y;
      
      if (!hasMovedRef.current && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        hasMovedRef.current = true;
      }
      
      // Dragging logic would go here if not using a CSS grid for layout.
      // For now, this hook primarily handles the click vs. drag detection.
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      isDraggingRef.current = false;
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [elRef]);

  const wasDragged = useCallback(() => hasMovedRef.current, []);

  // Position and setPosition are returned for API consistency, but are not used for grid layout
  return { position, setPosition, wasDragged };
}
