"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateFamilyDialog } from './create-family-dialog';
import { Users, PlusCircle } from 'lucide-react';

const availableFamilies = [
  { id: '3', name: 'The Belchers' },
  { id: '4', name: 'The Smiths' },
  { id: '5', name: 'The Flanders' },
];

export function NoFamily() {
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [requested, setRequested] = React.useState<string[]>([]);

  const handleJoinRequest = (familyId: string) => {
    setRequested((prev) => [...prev, familyId]);
    // In a real app, this would send a request to the backend.
  };

  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <Card className="text-center shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Family Grocery Hub!</CardTitle>
              <CardDescription>
                You're not part of any family yet. Create one or join an existing family to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a new Family
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Join an Existing Family</CardTitle>
              <CardDescription>Send a request to join one of these families.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {availableFamilies.map((family) => (
                  <li key={family.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-secondary p-3">
                        <Users className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <span className="font-medium">{family.name}</span>
                    </div>
                    <Button
                      onClick={() => handleJoinRequest(family.id)}
                      disabled={requested.includes(family.id)}
                      variant={requested.includes(family.id) ? 'secondary' : 'default'}
                    >
                      {requested.includes(family.id) ? 'Requested' : 'Request to Join'}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <CreateFamilyDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </>
  );
}
