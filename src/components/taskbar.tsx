'use client';

import React from 'react';
import { windowStore$ } from "@/state/windowState";
import { observer } from "@legendapp/state/react";


const Taskbar = observer(() => {
  const windows = windowStore$.windows.get();

  return (
    <div
      className="flex bg-gray-300 border-2 border-black shadow-md w-full h-10 z-10"
    >
      {windows.map(w => {
        return <div key={w.id}>{w.title}</div>
      })}
    </div>
  );
});

export default Taskbar;
