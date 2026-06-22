'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { InvoiceType } from '@/lib/schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Download, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase/supabase';
import { toast } from 'sonner';

export function InvoiceEditor() {
  const { register, control, getValues, formState: { errors } } = useFormContext<InvoiceType>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleSave = async () => {
    const values = getValues();
    try {
      const loadingToast = toast.loading('Saving invoice...');
      
      // Ensure we attempt to grab the currently logged in user context
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('invoices').insert({
        user_id: user?.id, // Requires an active session & auth.users link according to our schema
        invoice_number: values.invoiceMeta.invoiceNo,
        date: values.invoiceMeta.date,
        due_date: values.invoiceMeta.dueDate,
        items: values.items,
        status: 'saved',
      });
      
      toast.dismiss(loadingToast);
      
      if (error) {
         console.error('Supabase Save Error:', error);
         toast.error(`Error: ${error.message || 'Check Auth state'}`);
         return;
      }
      
      toast.success('Invoice securely saved to Supabase!');
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || 'Failed to save');
    }
  };

  const handleDownload = async () => {
    const values = getValues();
    const { pdf } = await import('@react-pdf/renderer');
    const { InvoicePDF } = await import('./pdf-document');
    
    const blob = await pdf(<InvoicePDF data={values} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${values.invoiceMeta?.invoiceNo || 'Draft'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-8 pb-32">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Edit Details</h2>
          <p className="text-sm text-slate-500">Fill in the fields to update the preview instantly.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} type="button" variant="outline" className="gap-2">
            <Save className="w-4 h-4" /> Save
          </Button>
          <Button onClick={handleDownload} type="button" className="bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/20 gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Sender Details */}
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Your Details</CardTitle>
            <CardDescription>Details appearing at the very top of the invoice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business / Sender Name</Label>
              <Input {...register('senderDetails.name')} placeholder="e.g. Nayan Thapa" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>BSB</Label>
                <Input {...register('senderDetails.bsb')} placeholder="082451" />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input {...register('senderDetails.accountNumber')} placeholder="407220013" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Metadata */}
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice No</Label>
              <Input {...register('invoiceMeta.invoiceNo')} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input {...register('invoiceMeta.date')} type="date" />
            </div>
            <div className="space-y-2">
              <Label>Terms</Label>
              <Input {...register('invoiceMeta.terms')} />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input {...register('invoiceMeta.dueDate')} type="date" />
            </div>
          </CardContent>
        </Card>

        {/* Bill To Details */}
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input {...register('clientDetails.name')} placeholder="e.g. MI CONSTRUCTION" />
            </div>
            <div className="space-y-2">
              <Label>Client Address</Label>
              <Textarea {...register('clientDetails.address')} placeholder="22 Coast Ave&#10;Cronulla, NSW, 2230" className="resize-none" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Line Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(), description: '', quantity: 1, rate: 0 })} className="gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4 group">
                <div className="absolute top-2 right-2">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="pr-8 space-y-2">
                  <Label>Description</Label>
                  <Input {...register(`items.${index}.description` as const)} placeholder="e.g. Tuesday" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity (Hours)</Label>
                    <Input {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} type="number" step="0.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate (A$)</Label>
                    <Input {...register(`items.${index}.rate` as const, { valueAsNumber: true })} type="number" step="0.01" />
                  </div>
                </div>
              </div>
            ))}
            {fields.length === 0 && (
              <div className="text-center py-6 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                No items added yet. Click top right to add one!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Payment Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              {...register('paymentInstructions')} 
              rows={4} 
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
