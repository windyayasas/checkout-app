"use client";

import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemberList } from '@/components/dashboard/family/member-list';
import { InvitationForm } from '@/components/dashboard/family/invitation-form';
import { JoinRequestsList } from '@/components/dashboard/family/join-requests-list';
import { useFamily } from '@/context/family-context';

export default function FamilySettingsPage() {
  const { selectedFamily, hasFamilies, isLoading } = useFamily();
  const router = useRouter();

  React.useEffect(() => {
    // Wait until the loading state is resolved before checking for families
    if (!isLoading && !hasFamilies) {
      router.push('/dashboard');
    }
  }, [isLoading, hasFamilies, router]);

  // Return null or a loading spinner to prevent rendering the component
  // before the check is complete.
  if (isLoading || !hasFamilies) {
    return null;
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage "{selectedFamily?.name}"</CardTitle>
          <CardDescription>
            Manage members, invitations, and join requests for your family.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="members">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="requests">Join Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="mt-6">
                <MemberList />
            </TabsContent>
            <TabsContent value="invitations" className="mt-6">
                <InvitationForm />
            </TabsContent>
            <TabsContent value="requests" className="mt-6">
                <JoinRequestsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
