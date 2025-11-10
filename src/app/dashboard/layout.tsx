import { FamilyProvider } from '@/context/family-context';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { DataBootstrap } from '@/components/dashboard/data-bootstrap';

// TODO: Replace mock userId with real authenticated user id when auth is implemented.
const MOCK_USER_ID = 'demo-user-1';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FamilyProvider>
      {/* Initialize Firestore subscriptions & store state */}
      <DataBootstrap userId={MOCK_USER_ID} />
      <DashboardView>{children}</DashboardView>
    </FamilyProvider>
  );
}
