"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockRequests = [
    { id: 'req1', name: 'Ned Flanders', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon man mustache' },
    { id: 'req2', name: 'Apu Nahasapeemapetilon', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'cartoon man indian' },
];

export function JoinRequestsList() {
    const [requests, setRequests] = React.useState(mockRequests);
    const { toast } = useToast();

    const handleRequest = (requestId: string, accepted: boolean) => {
        const request = requests.find(r => r.id === requestId);
        setRequests(prev => prev.filter(r => r.id !== requestId));
        toast({
            title: `Request ${accepted ? 'Accepted' : 'Declined'}`,
            description: `${request?.name} has been ${accepted ? 'added to the family.' : 'notified.'}`
        });
    };

    if (requests.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pending Join Requests</CardTitle>
                    <CardDescription>Review and respond to requests to join your family.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        There are no pending join requests.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Join Requests</CardTitle>
                <CardDescription>Review and respond to requests to join your family.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ul className="space-y-4">
                    {requests.map((request) => (
                    <li key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={request.avatarUrl} alt={request.name} data-ai-hint={request.avatarHint} />
                                <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{request.name}</span>
                        </div>
                        <div className="flex gap-2">
                             <Button size="sm" onClick={() => handleRequest(request.id, true)}>
                                <Check className="mr-2 h-4 w-4" />
                                Accept
                             </Button>
                             <Button size="sm" variant="destructive" onClick={() => handleRequest(request.id, false)}>
                                <X className="mr-2 h-4 w-4" />
                                Decline
                            </Button>
                        </div>
                    </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
