'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { UserCircle, LogOut } from 'lucide-react';
import { defaultInvoiceValues, invoiceSchema, InvoiceType } from '@/lib/schema';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { InvoiceEditor } from '@/components/invoice-editor';
import { InvoicePreview } from '@/components/invoice-preview';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const methods = useForm<InvoiceType>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaultInvoiceValues,
    mode: 'onChange',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <FormProvider {...methods}>
        <form className="flex flex-col md:flex-row md:h-screen">
          {/* Left Column: Form Editor */}
          <section className="w-full md:w-1/2 lg:w-[500px] bg-white border-b md:border-b-0 md:border-r border-slate-200 md:overflow-y-auto z-10 md:shadow-xl shadow-slate-200/50 flex-shrink-0 hide-scrollbar">
            <InvoiceEditor />
          </section>
          
          {/* Right Column: Live Preview & Action Bar */}
          <section className="flex-1 bg-slate-100/50 p-4 md:p-8 md:overflow-y-auto overflow-x-hidden flex flex-col items-center">
            {/* Action Bar */}
            <div className="w-full max-w-[800px] mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Professional Invoice Generator</h1>
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <p className="text-xs text-sky-600 bg-sky-100 px-3 py-1 rounded-full inline-flex lg:hidden">Scroll right to view invoice →</p>
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 hidden sm:inline-flex">{user.email}</span>
                    <button onClick={handleSignOut} type="button" className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 px-4 py-2 rounded-md shadow-sm hover:shadow transition-all">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/auth" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-sky-600 bg-white border border-slate-200 px-4 py-2 rounded-md shadow-sm hover:shadow transition-all">
                    <UserCircle className="w-4 h-4" /> Sign in
                  </Link>
                )}
              </div>
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
