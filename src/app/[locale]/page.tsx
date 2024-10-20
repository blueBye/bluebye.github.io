/* eslint-disable  @typescript-eslint/no-explicit-any */

import Desktop from "@/components/desktop";
import {unstable_setRequestLocale} from "next-intl/server";

type HomeProps = {
  params: {
    locale: string;
  };
}

export default function Home({ params: { locale } }: HomeProps) {
  unstable_setRequestLocale(locale);

  return (
    <Desktop />
  );
}
