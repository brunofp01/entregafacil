import { redirect } from 'next/navigation';

export default function Home() {
  // Direct landing to dashboard for the MVP focus
  redirect('/dashboard');
}
