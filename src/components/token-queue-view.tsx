'use client';

import { useClinic } from '@/hooks/use-clinic-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hourglass, UserCheck, CheckCircle2 } from 'lucide-react';
import { VisitForm } from './visit-form';
import type { Token } from '@/lib/types';
import { useState } from 'react';

export function TokenQueueView() {
  const { tokens, updateTokenStatus, userRole } = useClinic();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);

  const inProgressTokens = tokens.filter((t) => t.status === 'in-progress');
  const waitingTokens = tokens.filter((t) => t.status === 'waiting').sort((a,b) => a.tokenNumber - b.tokenNumber);
  const completedTokens = tokens.filter((t) => t.status === 'completed').sort((a,b) => b.tokenNumber - a.tokenNumber).slice(0, 5);

  const handleStartConsultation = (token: Token) => {
    updateTokenStatus(token.id, 'in-progress');
    setSelectedToken(token);
    setIsVisitFormOpen(true);
  };

  const handleOpenVisit = (token: Token) => {
    setSelectedToken(token);
    setIsVisitFormOpen(true);
  };
  
  const handleCloseVisitForm = () => {
    setIsVisitFormOpen(false);
    setSelectedToken(null);
  }

  const TokenCard = ({ token }: { token: Token }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Token #{token.tokenNumber}</p>
          <p className="text-lg font-semibold font-headline">{token.patientName}</p>
        </div>
        <Badge variant={token.status === 'in-progress' ? "destructive" : "secondary"}>
          {token.status}
        </Badge>
      </div>
      {userRole === 'doctor' && token.status === 'waiting' && (
        <Button className="mt-4 w-full" onClick={() => handleStartConsultation(token)}>
          Start Consultation
        </Button>
      )}
      {userRole === 'doctor' && token.status === 'in-progress' && (
        <Button className="mt-4 w-full" variant="outline" onClick={() => handleOpenVisit(token)}>
          Open Visit Record
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <VisitForm isOpen={isVisitFormOpen} onOpenChange={setIsVisitFormOpen} onFormSubmit={handleCloseVisitForm} token={selectedToken} />
        
        {/* In Progress Section */}
        <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-headline">In Progress</CardTitle>
                <UserCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                {inProgressTokens.length > 0 ? (
                    <div className="space-y-4">
                        {inProgressTokens.map((token) => <TokenCard key={token.id} token={token} />)}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground pt-4">No active consultations.</p>
                )}
            </CardContent>
        </Card>

        {/* Waiting Queue Section */}
        <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-headline">Waiting Queue</CardTitle>
                <Hourglass className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
                {waitingTokens.length > 0 ? (
                    <div className="space-y-4">
                        {waitingTokens.map((token) => <TokenCard key={token.id} token={token} />)}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground pt-4">The waiting queue is empty.</p>
                )}
            </CardContent>
        </Card>

        {/* Recently Completed Section */}
        <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-headline">Recently Completed</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
                {completedTokens.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {completedTokens.map(token => (
                            <li key={token.id} className="flex justify-between items-center rounded-md bg-secondary/50 p-2">
                                <span><span className="font-semibold">#{token.tokenNumber}</span> - {token.patientName}</span>
                                <Badge variant="outline" className="text-accent border-accent">Completed</Badge>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground pt-4">No patients checked out recently.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
