"use client";

import Link from 'next/link';
import { useFamily } from '@/context/family-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export function FamilyMembers() {
  const { selectedFamily } = useFamily();

  if (!selectedFamily || !selectedFamily.members) {
    return null;
  }

  return (
    <Card className="shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle>Family Members</CardTitle>
            <CardDescription>Members of the "{selectedFamily.name}" family.</CardDescription>
        </div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/family">
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Family Settings</span>
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Family Settings</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex flex-wrap gap-4">
            {selectedFamily.members.map((member) => (
              <Tooltip key={member.id}>
                <TooltipTrigger>
                  <Avatar className="h-12 w-12 border-2 border-primary/50 transition-colors hover:border-primary">
                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{member.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
