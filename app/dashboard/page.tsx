'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Type for the fetched invoice
type SavedInvoice = {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  items: any[];
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load invoices');
      console.error(error);
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  };

  const deleteInvoice = async (id: string, number: string) => {
    if (!confirm(`Are you sure you want to delete invoice #${number || 'Draft'}?`)) return;

    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete invoice');
    } else {
      toast.success('Invoice deleted successfully');
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const calculateTotal = (items: any[]) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Link href="/" className="hover:text-slate-900 transition-colors inline-flex items-center text-sm font-medium">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Generator
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Invoices</h1>
            <p className="text-slate-500">Manage and track all your generated invoices.</p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md bg-sky-500 text-sm font-medium text-white px-5 py-2.5 hover:bg-sky-600 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" /> New Invoice
          </Link>
        </div>

        {/* Invoices List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No invoices found</h3>
              <p className="text-slate-500 mb-6 max-w-sm">You haven't saved any invoices yet. Create your first professional invoice right now.</p>
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-md bg-slate-900 text-sm font-medium text-white px-5 py-2 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                Create Invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left align-middle border-collapse border-0">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Invoice No</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Date</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Due Date</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Items</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Total (A$)</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-[11px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        #{invoice.invoice_number || 'Draft'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{invoice.date || '-'}</td>
                      <td className="px-6 py-4 text-slate-500">{invoice.due_date || '-'}</td>
                      <td className="px-6 py-4 text-slate-500 text-[13px] bg-slate-50/50 inline-flex items-center mt-3 ml-6 rounded-md px-2 py-0.5 border border-slate-100">
                        {Array.isArray(invoice.items) ? invoice.items.length : 0} items
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">${calculateTotal(invoice.items).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteInvoice(invoice.id, invoice.invoice_number)}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer inline-flex focus:opacity-100"
                          title="Delete invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
