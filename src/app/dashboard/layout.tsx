import { FamilyProvider } from '@/context/family-context';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FamilyProvider>
      <DashboardView>{children}</DashboardView>
    </FamilyProvider>
  );
}
