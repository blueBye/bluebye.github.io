/* eslint-disable @typescript-eslint/no-explicit-any  */
'use client';

import React from 'react';
import { windowStore$ } from "@/state/windowState";
import { observer } from "@legendapp/state/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import Image from 'next/image'
import {useTranslations} from "next-intl";
import useRTL from "@/hooks/useRTL";

const Taskbar = observer(() => {
  const isRTL = useRTL()
  const t = useTranslations('Taskbar' as any)

  const windows = windowStore$.windows.get();

  return (
    <div
      className={
        `flex bg-gray-300 border-2 border-black shadow-md w-full h-10 z-10 px-4 ${isRTL?'flex-row-reverse':''}`
      }
    >
      <Image src={`/windows-icons/MORIC058.PNG`} alt={'logo'} width={24} height={10} className={"mx-4 h-full py-2"} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-xl" disabled={windows.length<=0}>
              {t("programs" as any)} ({windows.length})
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"bg-gray-200 border-2 border-black rounded-none p-0 m-0 -gap-y-10"}>
          {windows.map(w => {
            return(
              <DropdownMenuLabel key={w.id} className={"py-0"}>
                <Button
                  className={"w-full flex text-left justify-start m-0 py-0 px-2 h-8 hover:rounded-none"}
                  variant="ghost"
                  onClick={() => { windowStore$.toggleWindow(w.id) }}
                >
                  {w.title}
                </Button>
              </DropdownMenuLabel>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
});

export default Taskbar;
