'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultInvoiceValues, invoiceSchema, InvoiceType } from '@/lib/schema';
import { InvoiceEditor } from '@/components/invoice-editor';
import { InvoicePreview } from '@/components/invoice-preview';

export default function Home() {
  const methods = useForm<InvoiceType>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaultInvoiceValues,
    mode: 'onChange',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <FormProvider {...methods}>
        <form className="h-screen flex flex-col md:flex-row">
          {/* Left Column: Form Editor */}
          <section className="w-full md:w-1/2 lg:w-[500px] bg-white border-r border-slate-200 overflow-y-auto z-10 shadow-xl shadow-slate-200/50 flex-shrink-0 hide-scrollbar">
            <InvoiceEditor />
          </section>
          
          {/* Right Column: Live Preview & Action Bar */}
          <section className="flex-1 bg-slate-100/50 p-4 md:p-8 overflow-y-auto overflow-x-hidden flex flex-col items-center">
            {/* Action Bar */}
            <div className="w-full max-w-[800px] mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Professional Invoice Generator</h1>
              <p className="text-xs text-sky-600 bg-sky-100 px-3 py-1 rounded-full mt-2 sm:mt-0 inline-flex lg:hidden">Scroll right to view whole invoice →</p>
            </div>

            {/* Scrollable Container for Mobile */}
            <div className="w-full overflow-x-auto pb-12 flex justify-start lg:justify-center">
              {/* A4 Paper Wrapper exactly sized */}
              <div className="bg-white shadow-2xl rounded-sm w-[800px] min-w-[800px] h-[1131px] flex-shrink-0 overflow-hidden border border-slate-200/60 ring-1 ring-slate-900/5 relative text-left">
                <InvoicePreview />
              </div>
            </div>
          </section>
        </form>
      </FormProvider>
    </div>
  );
}
