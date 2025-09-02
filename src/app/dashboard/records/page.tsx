'use client';

import { useClinic } from '@/hooks/use-clinic-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { VisitForm } from '@/components/visit-form';
import type { Token } from '@/lib/types';

export default function RecordsPage() {
    const { visits, patients, tokens } = useClinic();
    const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);

    const records = visits
        .map(visit => {
            const patient = patients.find(p => p.id === visit.patientId);
            const token = tokens.find(t => t.tokenNumber === visit.tokenNumber);
            return { visit, patient, token };
        })
        .filter(item => item.patient && item.token)
        .sort((a,b) => new Date(b.visit.date).getTime() - new Date(a.visit.date).getTime());

    const handleViewRecord = (token: Token) => {
        setSelectedToken(token);
        setIsVisitFormOpen(true);
    };

    const handleCloseVisitForm = () => {
        setIsVisitFormOpen(false);
        setSelectedToken(null);
    };

    return (
        <>
            <VisitForm 
                isOpen={isVisitFormOpen} 
                onOpenChange={setIsVisitFormOpen} 
                onFormSubmit={handleCloseVisitForm}
                token={selectedToken}
            />
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Visit Records</CardTitle>
                    <CardDescription>A log of all past patient consultations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Token No.</TableHead>
                                <TableHead>Diagnosis</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.length > 0 ? (
                                records.map(({ visit, patient, token }) => (
                                    <TableRow key={visit.id}>
                                        <TableCell>{format(new Date(visit.date), "PPP")}</TableCell>
                                        <TableCell className="font-medium">{patient!.name}</TableCell>
                                        <TableCell><Badge variant="outline">#{visit.tokenNumber}</Badge></TableCell>
                                        <TableCell>{visit.diagnosis}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleViewRecord(token!)}>View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No visit records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
