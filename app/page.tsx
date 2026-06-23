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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex justify-center">
      <div className="w-full max-w-7xl">
        <FormProvider {...methods}>
          <form className="flex flex-col md:flex-row md:h-[calc(100vh-64px)] w-full">
          {/* Left Column: Form Editor */}
          <section className="w-full md:w-1/2 lg:w-[500px] bg-white border-b md:border-b-0 md:border-r border-slate-200 md:overflow-y-auto z-10 md:shadow-xl shadow-slate-200/50 flex-shrink-0 hide-scrollbar">
            <InvoiceEditor />
          </section>
          
          {/* Right Column: Live Preview & Action Bar */}
          <section className="flex-1 bg-slate-100/50 pt-0 md:pt-6 md:overflow-y-auto overflow-x-hidden flex flex-col items-center">
            <div className="w-full max-w-[800px] flex justify-start lg:hidden mb-4 mt-4 px-4">
               <p className="text-xs text-sky-600 bg-sky-100 px-3 py-1 rounded-full inline-flex shadow-sm border border-sky-200">Scroll right to view invoice →</p>
            </div>

            {/* Fully Responsive Container */}
            <div className="w-full overflow-x-auto pb-12 flex justify-start lg:justify-center lg:[zoom:min(1,calc((100vw-500px)/850))] xl:[zoom:1]">
              {/* A4 Paper Wrapper exactly sized */}
              <div className="bg-white shadow-2xl rounded-sm w-[800px] min-w-[800px] h-[1131px] flex-shrink-0 overflow-hidden border border-slate-200/60 ring-1 ring-slate-900/5 relative text-left mx-4 lg:mx-0">
                <InvoicePreview />
              </div>
            </div>
          </section>
        </form>
      </FormProvider>
      </div>
    </div>
  );
}
