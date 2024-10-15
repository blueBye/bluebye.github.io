'use client'

import { observable } from '@legendapp/state';
import { v4 as uuidv4 } from 'uuid';

type WindowState = {
  id: string;
  title: string;
  x: number;
  y: number;
  minimized: boolean;
  width: number;
  height: number;
};

type Store = {
  windows: WindowState[];
  activeWindow: string;
  addWindow: (title: string, x?: number, y?: number, width?: number, height?: number) => WindowState;
  closeWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
};

// Create the window state store
export const windowStore$ = observable<Store>({
  windows: [],
  activeWindow: "",

  // Adds a new window to the store
  addWindow: (title: string, x: number = 0, y: number = 0, width: number = 100, height: number = 100) => {
    const id = uuidv4();
    const newWindow: WindowState = {
      id: id,
      title: title,
      x: x,
      y: y,
      width: width,
      height: height,
      minimized: false,
    };

    // Add the new window to the list
    windowStore$.windows.push(newWindow);
    return newWindow;
  },

  // Removes a window from the store by its ID
  closeWindow: (id: string) => {
    console.log(id)
    windowStore$.windows.set(
      windowStore$.windows.get().filter((window) => window.id !== id)
    );
  },

  // Toggles the minimized state of the window
  toggleWindow: (id: string) => {
    const windows = windowStore$.windows.get();
    const windowIndex = windows.findIndex((window) => window.id === id);

    if (windowIndex !== -1) {
      const window = windows[windowIndex];
      windowStore$.windows[windowIndex].minimized.set(!window.minimized);
    }
  },

  // Moves a window to a new position
  moveWindow: (id: string, x: number, y: number) => {
    const windows = windowStore$.windows.get();
    const windowIndex = windows.findIndex((window) => window.id === id);

    if (windowIndex !== -1) {
      // Update the position of the window
      windowStore$.windows[windowIndex].x.set(x);
      windowStore$.windows[windowIndex].y.set(y);

      // Move the window to the top by removing it from its current position
      // and pushing it to the end of the array
      const [movingWindow] = windowStore$.windows.splice(windowIndex, 1);
      windowStore$.windows.push(movingWindow);

      // Set the active window to this one
      windowStore$.activeWindow.set(id);
    }
  },

  // Resizes a window
  resizeWindow: (id: string, width: number, height: number) => {
    const windows = windowStore$.windows.get();
    const windowIndex = windows.findIndex((window) => window.id === id);

    if (windowIndex !== -1) {
      windowStore$.windows[windowIndex].width.set(width);
      windowStore$.windows[windowIndex].height.set(height);
    }
  },
});
