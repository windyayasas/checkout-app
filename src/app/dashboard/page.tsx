"use client";

import { GroceryList } from '@/components/dashboard/grocery-list';
import { NoFamily } from '@/components/dashboard/no-family';
import { useFamily } from '@/context/family-context';
import { FamilyMembers } from '@/components/dashboard/family-members';

export default function DashboardPage() {
  const { hasFamilies } = useFamily();

  if (!hasFamilies) {
    return <NoFamily />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <GroceryList />
      </div>
      <div className="space-y-6 md:col-span-1">
        <FamilyMembers />
      </div>
    </div>
  );
}
