'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PlusCircle, Loader2, Ticket } from 'lucide-react';

import { useClinic } from '@/hooks/use-clinic-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

const patientSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().int().positive({ message: 'Please enter a valid age.' }),
  gender: z.enum(['Male', 'Female', 'Other']),
  contact: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, { message: 'Please use format: 123-456-7890' }),
});

function PatientRegistrationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const addPatient = useClinic((state) => state.addPatient);
  
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: { name: '', age: '' as any, gender: 'Male', contact: '' },
  });

  function onSubmit(values: z.infer<typeof patientSchema>) {
    setIsLoading(true);
    setTimeout(() => {
        addPatient(values);
        setIsLoading(false);
        setOpen(false);
        toast({ title: 'Patient Registered', description: `${values.name} has been successfully registered.` });
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField name="age" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" placeholder="42" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="gender" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )} />
        </div>
        <FormField name="contact" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="123-456-7890" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Register Patient</Button>
        </div>
      </form>
    </Form>
  );
}

export function PatientTable() {
  const { patients, tokens, issueToken } = useClinic();
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);

  const handleIssueToken = (patientId: string) => {
    const issued = issueToken(patientId);
    if(issued) {
        toast({ title: 'Token Issued!', description: `Token #${issued.tokenNumber} issued to ${issued.patientName}.`});
    } else {
        toast({ title: 'Token Already Exists', description: `This patient already has an active token.`, variant: 'destructive' });
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Patient List</CardTitle>
          <CardDescription>View and manage all registered patients.</CardDescription>
        </div>
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Register Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-headline">New Patient Registration</DialogTitle>
              <DialogDescription>Fill in the details below to register a new patient.</DialogDescription>
            </DialogHeader>
            <PatientRegistrationForm setOpen={setIsRegisterOpen} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => {
              const activeToken = tokens.find(t => t.patientId === patient.id && t.status !== 'completed');
              return (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>
                    {activeToken ? (
                      <Badge variant="secondary" className="capitalize">{activeToken.status} (#{activeToken.tokenNumber})</Badge>
                    ) : (
                      <Badge variant="outline">Checked Out</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleIssueToken(patient.id)} disabled={!!activeToken}>
                      <Ticket className="mr-2 h-4 w-4" />
                      Issue Token
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
