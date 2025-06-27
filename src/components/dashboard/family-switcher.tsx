"use client";

import * as React from 'react';
import { useFamily } from '@/context/family-context';
import { Users, ChevronsUpDown, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateFamilyDialog } from './create-family-dialog';

export function FamilySwitcher() {
  const { families, selectedFamily, setSelectedFamily } = useFamily();
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);

  if (!selectedFamily) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between md:w-[200px]">
            <Users className="mr-2 h-4 w-4" />
            {selectedFamily.name}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>Switch Family</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {families.map((family) => (
              <DropdownMenuItem key={family.id} onSelect={() => setSelectedFamily(family)}>
                {family.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Family
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateFamilyDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
