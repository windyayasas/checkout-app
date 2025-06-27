"use client";

import { useFamily } from '@/context/family-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MemberList() {
  const { selectedFamily } = useFamily();

  if (!selectedFamily || !selectedFamily.members) {
    return <p>No members found.</p>;
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Current Members</CardTitle>
            <CardDescription>The people currently in your family.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {selectedFamily.members.map((member) => (
                <li key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                    </div>
                    {member.id !== 'user' && ( // Don't allow removing yourself
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                        </Button>
                    )}
                </li>
                ))}
            </ul>
        </CardContent>
    </Card>
  );
}
