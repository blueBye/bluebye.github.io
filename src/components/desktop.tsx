/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any  */
'use client'

import {DndContext, DragEndEvent} from '@dnd-kit/core';
import Window from "@/components/window";
import { windowStore$ } from '@/state/windowState';
import { observer } from "@legendapp/state/react";
import Taskbar from "@/components/taskbar";
import {useTranslations} from "next-intl";

const Desktop = observer(() => {
  const t = useTranslations('Homepage' as any)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = String(active.id);

    // Get the container bounding box
    const container = document.querySelector('.window-container'); // Ensure the class is unique to the container
    if (!container) { return }
    const containerRect = container.getBoundingClientRect();

    // Get the current window's state
    const windowState = windowStore$.windows.get().find((window) => window.id === id);

    if (windowState) {
      // Calculate new position
      let newX = windowState.x + delta.x;
      let newY = windowState.y + delta.y;

      // Constrain the new position within the container's bounds
      const windowWidth = 40;
      const windowHeight = 0;

      // Left and Right bounds
      console.log(newX)
      // if (newX > 0) newX = 0; // No movement beyond right
      if (newX + windowWidth > containerRect.width) newX = containerRect.width - windowWidth; // No movement beyond left

      // Top and Bottom bounds
      if (newY < 0) newY = 0; // No movement beyond top
      if (newY + windowHeight > containerRect.height) newY = containerRect.height - windowHeight; // No movement beyond bottom

      windowStore$.moveWindow(id, newX, newY);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#008080]">
      <Taskbar />

      <div className="relative w-full h-[calc(100%-80px)] window-container">
        {/* Button to create new windows */}
        <button
          onClick={() => { windowStore$.addWindow("test", 0, 40, 100, 100) }}
          className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t("newWindow" as any)}
        </button>

        {/* DndContext to handle dragging */}
        <DndContext onDragEnd={handleDragEnd}>
          {/* Render all windows */}
          {windowStore$.windows.get().map((window) => (
            <Window key={window.id} id={window.id}>
              content
            </Window>
          ))}
        </DndContext>
      </div>
    </div>
  );
});

export default Desktop;
