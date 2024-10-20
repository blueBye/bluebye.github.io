'use client';

import React, { useEffect } from 'react';
import { useDraggable, useDndContext } from '@dnd-kit/core';
import { windowStore$ } from "@/state/windowState";
import { observer } from "@legendapp/state/react";
import { Button } from "@/components/ui/button";
import {Grip, Minus, X} from 'lucide-react';
import useRTL from "@/hooks/useRTL";

type WindowProps = {
  id: string;
  children: React.ReactNode;
};

const Window = observer(({ id, children }: WindowProps) => {
  const isRTL = useRTL()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const { active } = useDndContext(); // Get active draggable item
  const windowState = windowStore$.windows.get().find((window) => window.id === id);

  useEffect(() => {
    // Reorder the window to be on top when dragging starts
    if (active && active.id === id) {
      const windows = windowStore$.windows.get();
      const windowIndex = windows.findIndex((window) => window.id === id);
      if (windowIndex !== -1) {
        const [movingWindow] = windowStore$.windows.splice(windowIndex, 1);
        windowStore$.windows.push(movingWindow);
        windowStore$.activeWindow.set(id); // Set the active window
      }
    }
  }, [active, id]);

  if (!windowState) {
    return null; // If the window doesn't exist in the store, don't render
  }

  const { x, y, width, height, title, minimized } = windowState;

  if (minimized) {
    return null; // If the window is minimized, we won't render it
  }

  const style = {
    transform: `translate3d(${(x + (transform?.x ?? 0))}px, ${(y + (transform?.y ?? 0))}px, 0)`,
    width: `${width}px`,
    height: `${height}px`,
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const startWidth = width;
    const startHeight = height;
    const startX = event.clientX;
    const startY = event.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(startWidth + (moveEvent.clientX - startX), 200); // Minimum width
      const newHeight = Math.max(startHeight + (moveEvent.clientY - startY), 100); // Minimum height

      windowStore$.resizeWindow(id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={style}
      className="bg-gray-300 border-2 border-black shadow-md absolute"
    >
      {/* Title Bar - Draggable Area */}
      <div className={"relative"}>
        <div
          ref={setNodeRef}
          style={{direction: isRTL?'rtl':'ltr'}}
          className={`bg-blue-800 text-white font-bold px-2 py-1 w-full cursor-move top-0 ${isRTL?'right-0 text-right':''}`}
          {...listeners}
          {...attributes}
        >
          <span
            className="whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ display: 'block', maxWidth: 'calc(100% - 80px)' }}
          >
            {title}
          </span>
        </div>

        <div className={`absolute flex top-2 z-10 gap-x-2 bg-blue-800 ${isRTL ? 'left-2 flex-row-reverse':'right-2'}`}>
          <Button
            className="rounded-full w-6 h-6 hover:bg-blue-600"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag interference
              windowStore$.toggleWindow(windowState.id);
            }}
          >
            <Minus className="w-4 h-4 text-yellow-500" />
          </Button>

          <Button
            className="rounded-full w-6 h-6 hover:bg-blue-600"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag interference
              windowStore$.closeWindow(windowState.id);
            }}
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-4">
        {children}
      </div>

      {/* Resizable Corner */}
      <Grip
        className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
});

export default Window;
