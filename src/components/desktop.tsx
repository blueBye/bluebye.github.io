'use client'

import { DndContext } from '@dnd-kit/core';
import Window from "@/components/window";
import { windowStore$ } from '@/state/windowState';
import { observer } from "@legendapp/state/react";

const Desktop = observer(() => {
  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const id = active.id
    const windowState = windowStore$.windows.get().find((window) => window.id === id);
    if (windowState) {
      windowStore$.moveWindow(id, windowState.x + delta.x, windowState.y + delta.y);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#008080]">
      {/* Button to create new windows */}
      <button
        onClick={() => { windowStore$.addWindow("test") }}
        className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Open New Window
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
  )
});

export default Desktop;
