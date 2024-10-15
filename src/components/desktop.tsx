'use client'

import { DndContext } from '@dnd-kit/core';
import Window from "@/components/window";
import { windowStore$ } from '@/state/windowState';
import { observer } from "@legendapp/state/react";
import Taskbar from "@/components/taskbar";

const Desktop = observer(() => {
  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const id = active.id;

    // Get the container bounding box
    const container = document.querySelector('.window-container'); // Ensure the class is unique to the container
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
      if (newX < 0) newX = 0; // No movement beyond left
      if (newX + windowWidth > containerRect.width) newX = containerRect.width - windowWidth; // No movement beyond right

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
          onClick={() => { windowStore$.addWindow("test", 10, 40) }}
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
    </div>
  );
});

export default Desktop;
