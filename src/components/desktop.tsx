/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any  */
'use client'

import {DndContext, DragEndEvent, DragOverlay} from '@dnd-kit/core';
import Window from "@/components/window";
import { windowStore$ } from '@/state/windowState';
import { observer } from "@legendapp/state/react";
import Taskbar from "@/components/taskbar";
import {useTranslations} from "next-intl";
import DesktopIcon from "@/components/desktop-icon";
import {createSnapModifier} from "@dnd-kit/modifiers";

const Desktop = observer(() => {
  const t = useTranslations('Homepage' as any)
  const gridSize = 20; // pixels
  const snapToGridModifier = createSnapModifier(gridSize);

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
      if (newX < 0) newX = 0; // No movement beyond right
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
        {/* DndContext to handle dragging */}
        <DndContext onDragEnd={handleDragEnd}>
          {/*<DragOverlay modifiers={[snapToGridModifier]}>*/}
          {/*  */}
          {/*</DragOverlay>*/}

          <div className="flex flex-col flex-wrap gap-4 p-4 top-0 left-0 absolute h-[calc(100%+40px)]">
            <DesktopIcon title={"README.txt"} id={"readme"}/>
            <DesktopIcon title={"eula.txt"} id={"eula"}/>
            <DesktopIcon title={"blog"} id={"blog"}/>
            <DesktopIcon title={"blog2"} id={"blog"}/>
            <DesktopIcon title={"blog3"} id={"blog"}/>
            <DesktopIcon title={"blog4"} id={"blog"}/>
            <DesktopIcon title={"blog5"} id={"blog"}/>
            <DesktopIcon title={"blog6"} id={"blog"}/>
            <DesktopIcon title={"blog7"} id={"blog"}/>
          </div>

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
