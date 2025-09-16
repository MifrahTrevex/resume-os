"use client";

import { useState, useRef, useEffect, type RefObject } from 'react';

export function useDraggable(elRef: RefObject<HTMLElement>, handleRef: RefObject<HTMLElement>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elStartPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    // Center the element initially
    const initialX = (parent.clientWidth - el.clientWidth) / 2;
    const initialY = (parent.clientHeight - el.clientHeight) / 3;
    setPosition({ x: initialX, y: initialY });
    elStartPosRef.current = { x: initialX, y: initialY };
  }, [elRef]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const onMouseDown = (e: MouseEvent) => {
      // Prevent dragging from input fields or buttons within the handle
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) {
        return;
      }
      e.preventDefault();
      isDraggingRef.current = true;
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      elStartPosRef.current = position;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const dx = e.clientX - dragStartPosRef.current.x;
      const dy = e.clientY - dragStartPosRef.current.y;

      const newX = elStartPosRef.current.x + dx;
      const newY = elStartPosRef.current.y + dy;

      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      isDraggingRef.current = false;
    };

    handle.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [position, handleRef]);

  return position;
}
