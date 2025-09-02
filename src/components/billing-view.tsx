
'use client';

import * as React from 'react';
import { useClinic } from '@/hooks/use-clinic-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, LayoutGrid } from 'lucide-react';
import type { Patient, Visit } from '@/lib/types';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ScrollArea } from './ui/scroll-area';

function BillPreview({ visit, patient }: { visit: Visit; patient: Patient | undefined }) {
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const node = printRef.current;
    if (node) {
      html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Invoice</title><style>@page { size: A4; margin: 12mm; } body { margin: 0; }</style></head><body>');
            printWindow.document.write('<img src="' + canvas.toDataURL() + '" style="width:100%;" />');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
      });
    }
  };

  const handleDownloadPdf = () => {
    const input = printRef.current;
    if (input) {
      html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
          const pdfHeight = pdfWidth / ratio;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`invoice-inv-${new Date(visit.date).getFullYear()}-${visit.tokenNumber.toString().padStart(4, '0')}.pdf`);
        });
    }
  };

  const subtotal = visit.consultationFee;
  const taxRate = 0.18;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  }

  return (
    <>
      <div ref={printRef} className="bg-white text-gray-800 p-8 font-body text-[11pt] antialiased">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-8 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                  <LayoutGrid className="h-10 w-10 text-primary" />
                  <div>
                      <h1 className="font-headline text-2xl font-bold text-primary">ClinicFlow</h1>
                      <p className="text-xs text-slate-600 mt-1 leading-tight">
                          123 Health St, Wellness City, 12345<br/>
                          contact@clinicflow.dev | (123) 456-7890<br/>
                          GSTIN: 29ABCDE1234F1Z5
                      </p>
                  </div>
              </div>
              <div className="text-right text-xs shrink-0">
                  <h2 className="font-headline text-xl font-semibold mb-2">Invoice</h2>
                  <div className="space-y-1">
                    <div><strong>Invoice #:</strong> INV-{new Date(visit.date).getFullYear()}-{visit.tokenNumber.toString().padStart(4, '0')}</div>
                    <div><strong>Date:</strong> {format(new Date(visit.date), "yyyy-MM-dd")}</div>
                    <div><strong>Due Date:</strong> {format(new Date(visit.date), "yyyy-MM-dd")}</div>
                    <div className="mt-2 text-base font-bold text-red-600">Unpaid</div>
                  </div>
              </div>
          </div>

          {/* Patient Info */}
          <div className="flex justify-between mb-8 pb-4 border-b border-slate-200">
              <div className="text-sm">
                  <h3 className="font-headline font-semibold mb-1 text-slate-600">Bill To:</h3>
                  <strong>{patient?.name}</strong><br/>
                  <span className="text-slate-500">Patient ID: {patient?.id}</span><br/>
                  {patient?.age} years, {patient?.gender}<br/>
                  {patient?.contact}
              </div>
              <div className="text-sm text-right">
                  <h3 className="font-headline font-semibold mb-1 text-slate-600">Visit Details:</h3>
                  <strong>Doctor:</strong> {visit.doctorName || 'Anya Sharma'} (General)<br/>
                  <strong>Token No:</strong> {visit.tokenNumber}<br/>
                  <strong>Visit Date:</strong> {format(new Date(visit.date), "PPP")}
              </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse mb-8 text-[10pt]">
              <thead>
                  <tr>
                      <th className="p-2 border-b border-slate-200 font-headline font-semibold w-8">#</th>
                      <th className="p-2 border-b border-slate-200 font-headline font-semibold">Description</th>
                      <th className="p-2 border-b border-slate-200 font-headline font-semibold text-right">Qty</th>
                      <th className="p-2 border-b border-slate-200 font-headline font-semibold text-right">Unit Price</th>
                      <th className="p-2 border-b border-slate-200 font-headline font-semibold text-right">Amount</th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="border-b border-slate-100">
                      <td className="p-2">1</td>
                      <td className="p-2">Doctor Consultation (General)</td>
                      <td className="p-2 text-right">1</td>
                      <td className="p-2 text-right">{formatCurrency(visit.consultationFee)}</td>
                      <td className="p-2 text-right">{formatCurrency(visit.consultationFee)}</td>
                  </tr>
              </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
              <div className="w-[280px] text-sm space-y-2">
                  <div className="flex justify-between p-2">
                      <span className="text-slate-600">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between p-2">
                      <span className="text-slate-600">Tax (GST @ 18%)</span>
                      <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between p-2 border-t-2 border-slate-300 mt-2 pt-2 font-bold text-base">
                      <span className="font-headline">Total Amount Due</span>
                      <span className="text-lg font-headline">{formatCurrency(total)}</span>
                  </div>
              </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-xs text-slate-500 text-center border-t border-slate-200 pt-4">
              <p><strong>Notes:</strong> Payment is due upon receipt. Please keep this invoice for your records.</p>
              <p>Thank you for choosing ClinicFlow. We wish you good health.</p>
          </div>
      </div>
      <div className="flex justify-end gap-2 p-4 border-t bg-slate-50 no-print">
          <Button onClick={handlePrint} variant="outline"><Printer className="mr-2 h-4 w-4" /> Print</Button>
          <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
      </div>
    </>
  );
}


export function BillingView() {
  const { patients, visits, userRole } = useClinic();

  const patientsForBilling = visits
    .map(visit => {
        const patient = patients.find(p => p.id === visit.patientId);
        return { visit, patient };
    })
    .filter(item => item.patient)
    .sort((a, b) => new Date(b.visit.date).getTime() - new Date(a.visit.date).getTime());


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Billing</CardTitle>
        <CardDescription>Generate bills for patients with completed consultations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Token No.</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientsForBilling.length > 0 ? (
                patientsForBilling.map(({visit, patient}) => (
                <TableRow key={visit.id}>
                    <TableCell>{format(new Date(visit.date), "PP")}</TableCell>
                    <TableCell><Badge variant="outline">#{visit.tokenNumber}</Badge></TableCell>
                    <TableCell className="font-medium">{patient!.name}</TableCell>
                    <TableCell>{visit.doctorName}</TableCell>
                    <TableCell>₹{(visit.consultationFee * 1.18).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" disabled={userRole !== 'receptionist'}>Generate Bill</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl p-0">
                                <DialogHeader className="p-4 pb-0">
                                    <DialogTitle>Invoice Preview</DialogTitle>
                                    <DialogDescription>
                                        Review the invoice details below before printing or downloading.
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="h-[70vh]">
                                  <BillPreview visit={visit} patient={patient} />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No completed consultations available for billing.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
