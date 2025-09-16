
"use client";

import { useState, useRef, useEffect, type RefObject, useCallback } from 'react';

const DRAG_THRESHOLD = 5; // pixels

export function useDraggableIcon(elRef: RefObject<HTMLElement>, initialPosition: { x: number; y: number }) {
  const [position, setPosition] = useState(initialPosition);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elStartPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      // Prevent dragging when clicking on interactive elements within the icon if any
      if (e.target instanceof HTMLButtonElement && e.target !== el) {
          return;
      }
      e.preventDefault();
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      elStartPosRef.current = position;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const dx = e.clientX - dragStartPosRef.current.x;
      const dy = e.clientY - dragStartPosRef.current.y;
      
      if (!hasMovedRef.current && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        hasMovedRef.current = true;
      }
      
      const parent = el.parentElement;
      if (!parent) return;

      const newX = Math.min(Math.max(0, elStartPosRef.current.x + dx), parent.clientWidth - el.clientWidth);
      const newY = Math.min(Math.max(0, elStartPosRef.current.y + dy), parent.clientHeight - el.clientHeight);

      setPosition({ x: newX, y: newY });
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
  }, [position, elRef]);

  const wasDragged = useCallback(() => hasMovedRef.current, []);

  return { position, setPosition, wasDragged };
}
