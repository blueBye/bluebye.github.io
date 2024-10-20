'use client'

import { useEffect, useState } from 'react';
import {useLocale} from "use-intl";

const useRTL = (): boolean => {
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const local = useLocale()

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (local === 'en') {
      setIsRTL(false);
    } else {
      if (timeZone === 'Asia/Tehran') {
        setIsRTL(true);
      } else {
        setIsRTL(false);
      }
    }

  }, []);

  return isRTL;
};

export default useRTL;
