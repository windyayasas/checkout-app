import { redirect } from 'next/navigation';

export default function Home() {
  // In a real app, you'd check for an active session here.
  // For now, we go straight to the dashboard as the login flow exists.
  redirect('/dashboard');
}
