import {redirect} from 'next/navigation';


export default function RootPage() {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (userTimeZone === 'Asia/Tehran') {
    redirect('/fa');
  }
  redirect('/en');
}