/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import {windowStore$} from "@/state/windowState";

type DesktopIconProp = {
  id: string;
  title: string;
};


const DesktopIcon = ({id, title}: DesktopIconProp) => {
  const [isClicked, setIsClicked] = useState(false); // State to track if the icon is clicked
  const iconRef = useRef<HTMLDivElement | null>(null); // Reference to the icon container

  // Function to handle double-click
  const handleDoubleClick = () => {
    windowStore$.addWindow("test", 0, 40, 100, 100)
  };

  // Function to handle right-click
  const handleRightClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default context menu
    console.log("Right-clicked on icon");
  };

  // Handle click to toggle text visibility
  const handleIconClick = () => {
    setIsClicked(true);
  };

  // Detect clicks outside the icon to hide the text
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconRef.current && !iconRef.current?.contains(event.target as Node)) {
        setIsClicked(false); // Hide the text if click is outside
      }
    };

    // Add the event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside as any);

    return () => {
      // Clean up the event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, [iconRef]);

  return (
    <div
      key={id}
      ref={iconRef}
      className={`flex flex-col w-[80px] h-[100px] items-center p-2 cursor-pointer hover:bg-white hover:bg-opacity-35 transition duration-500 rounded-md`}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick} // Trigger on right-click
      onClick={handleIconClick} // Trigger on click
    >
      {/* Image for the desktop icon */}
      <Image
        src={`/windows-icons/MORIC058.PNG`}
        alt={'logo'}
        width={40}
        height={40}
        className="h-12 mb-2"
      />

      {/* Icon description: show full text if clicked, otherwise truncate */}
      <p
        className={`text-center text-xs text-gray-800 ${
          isClicked ? "whitespace-normal" : "truncate"
        } w-full`}
      >
        {title}
      </p>
    </div>
  );
};

export default DesktopIcon;
