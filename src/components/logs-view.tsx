'use client';

import { useClinic } from '@/hooks/use-clinic-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

export function LogsView() {
    const { logs } = useClinic();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Action Logs</CardTitle>
                <CardDescription>A detailed log of all actions performed in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh]">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(log.timestamp), "PPp")}</TableCell>
                                        <TableCell><Badge variant={log.role === 'doctor' ? 'destructive' : 'default'} className="capitalize">{log.role}</Badge></TableCell>
                                        <TableCell className="font-medium">{log.action}</TableCell>
                                        <TableCell>{log.details}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No log entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
