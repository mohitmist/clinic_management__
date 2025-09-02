'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useClinic } from '@/hooks/use-clinic-store';
import { toast } from '@/hooks/use-toast';
import type { Token } from '@/lib/types';
import { Card, CardContent } from './ui/card';

const visitSchema = z.object({
  symptoms: z.string().min(1, 'Symptoms are required.'),
  diagnosis: z.string().min(1, 'Diagnosis is required.'),
  prescription: z.string().min(1, 'Prescription is required.'),
  consultationFee: z.coerce.number().min(0, 'Fee must be a positive number.'),
});

interface VisitFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFormSubmit: () => void;
    token: Token | null;
}

export function VisitForm({ isOpen, onOpenChange, token, onFormSubmit }: VisitFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addVisit, visits, userName } = useClinic();

  const existingVisit = token ? visits.find(v => v.tokenNumber === token.tokenNumber) : null;
  
  const form = useForm<z.infer<typeof visitSchema>>({
    resolver: zodResolver(visitSchema),
    values: existingVisit ? {
        symptoms: existingVisit.symptoms,
        diagnosis: existingVisit.diagnosis,
        prescription: existingVisit.prescription,
        consultationFee: existingVisit.consultationFee,
    } : {
        symptoms: '',
        diagnosis: '',
        prescription: '',
        consultationFee: 500,
    }
  });

  function onSubmit(values: z.infer<typeof visitSchema>) {
    if (!token || !userName) return;

    setIsLoading(true);
    setTimeout(() => {
      addVisit({
        patientId: token.patientId,
        tokenNumber: token.tokenNumber,
        date: new Date().toISOString(),
        doctorName: `Dr. ${userName}`,
        ...values,
      });
      setIsLoading(false);
      toast({
        title: 'Visit Record Saved',
        description: `The visit details for ${token.patientName} have been successfully saved.`,
        variant: 'default',
      });
      onFormSubmit();
    }, 1000);
  }

  if (!token) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Visit Record for {token.patientName} (Token #{token.tokenNumber})
          </DialogTitle>
          <DialogDescription>
            Record the patient's visit details below. This will mark the consultation as complete.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {existingVisit ? (
                <Card>
                    <CardContent className="pt-6 space-y-4 text-sm">
                        <div><p className="font-semibold text-muted-foreground">Doctor</p><p>{existingVisit.doctorName}</p></div>
                        <div><p className="font-semibold text-muted-foreground">Symptoms</p><p>{existingVisit.symptoms}</p></div>
                        <div><p className="font-semibold text-muted-foreground">Diagnosis</p><p>{existingVisit.diagnosis}</p></div>
                        <div><p className="font-semibold text-muted-foreground">Prescription</p><p className="whitespace-pre-wrap">{existingVisit.prescription}</p></div>
                        <div><p className="font-semibold text-muted-foreground">Consultation Fee</p><p>₹{existingVisit.consultationFee}</p></div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Symptoms</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., Fever, headache, sore throat..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Diagnosis</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., Viral Infection..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="prescription"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prescription</FormLabel>
                        <FormControl>
                            <Textarea rows={5} placeholder="e.g.,&#10;1. Paracetamol 500mg - 1 tablet thrice a day&#10;2. Azithromycin 500mg - 1 tablet daily for 3 days" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="consultationFee"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Consultation Fee (₹)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Complete Visit & Save
                    </Button>
                    </div>
                </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
