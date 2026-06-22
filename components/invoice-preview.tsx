import { useFormContext, useWatch } from 'react-hook-form';
import { InvoiceType } from '@/lib/schema';

export function InvoicePreview() {
  const { control } = useFormContext<InvoiceType>();
  
  // Use watch to re-render preview whenever form changes
  const values = useWatch({ control }) as InvoiceType;
  
  const subtotal = (values.items || []).reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return acc + (qty * rate);
  }, 0);
  
  const total = subtotal;
  const balanceDue = total;
  const ABN = [values.senderDetails?.bsb, values.senderDetails?.accountNumber].filter(Boolean).join('');
  
  return (
    <div className="w-full h-full p-[48px] flex flex-col text-slate-800 font-sans tracking-normal bg-white">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-[48px]">
        <div className="flex flex-col">
          <h1 className="text-[34px] font-semibold text-[#4f5660] tracking-tight mb-3 leading-none">
            {values.senderDetails?.name || 'Sender Name'}
          </h1>
          <p className="text-[14px] text-[#555]">
            {values.senderDetails?.bsb}{values.senderDetails?.accountNumber ? `${values.senderDetails.accountNumber}` : ''}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-[40px] font-normal text-[#4f5660] tracking-tight mb-[24px] leading-none">Invoice</h2>
          <table className="text-[13px] border-spacing-x-4 border-spacing-y-1.5 border-separate -mr-4">
            <tbody>
              <tr>
                <td className="font-semibold text-[#4f5660] text-right">Invoice No:</td>
                <td className="text-right w-24 text-[#555]">{values.invoiceMeta?.invoiceNo || '#'}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#4f5660] text-right">Date:</td>
                <td className="text-right text-[#555]">{values.invoiceMeta?.date || ''}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#4f5660] text-right">Terms:</td>
                <td className="text-right text-[#555]">{values.invoiceMeta?.terms || ''}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#4f5660] text-right">Due Date:</td>
                <td className="text-right text-[#555]">{values.invoiceMeta?.dueDate || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Divider */}
      <hr className="border-[#eee] mb-[32px]" />
      
      {/* Bill To */}
      <div className="flex mb-[40px] text-[15px]">
        <div className="font-semibold text-[#4f5660] w-[120px]">Bill To:</div>
        <div className="leading-[1.6]">
          {values.clientDetails?.name && <div className="text-[#555]">{values.clientDetails.name}</div>}
          {values.clientDetails?.address && <div className="whitespace-pre-line text-[#555]">{values.clientDetails.address}</div>}
        </div>
      </div>
      
      {/* Line Items Table */}
      <div className="mb-[32px] flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y-[3px] border-[#81cbf0]">
              <th className="py-3 px-2 font-semibold text-[#4f5660] text-[15px] w-2/5">Description</th>
              <th className="py-3 px-2 font-semibold text-[#4f5660] text-[15px] text-center w-1/5">Quantity</th>
              <th className="py-3 px-2 font-semibold text-[#4f5660] text-[15px] text-right w-1/5">Rate</th>
              <th className="py-3 px-2 font-semibold text-[#4f5660] text-[15px] text-right w-1/5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(values.items || []).map((item, i) => {
              const qty = Number(item.quantity) || 0;
              const rate = Number(item.rate) || 0;
              const amount = qty * rate;
              return (
                <tr key={item.id} className="border-b border-[#f2f2f2]">
                  <td className="py-[18px] px-2 text-[#555] text-[14px]">{item.description}</td>
                  <td className="py-[18px] px-2 text-center text-[#555] text-[14px]">{qty} hours</td>
                  <td className="py-[18px] px-2 text-right text-[#555] text-[14px]">A${rate.toFixed(2)}</td>
                  <td className="py-[18px] px-2 text-right text-[#555] text-[14px]">A${amount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Bottom Section */}
      <div className="flex justify-between items-end mt-auto pt-8">
        {/* Payment Instructions */}
        <div className="w-[320px] bg-[#eff6fb] p-6 rounded-sm self-start">
          <h3 className="font-semibold text-[#4f5660] mb-3 text-[15px]">Payment Instructions</h3>
          <div className="whitespace-pre-line text-[#555] text-[14px] leading-relaxed">
            {values.paymentInstructions || ''}
          </div>
        </div>
        
        {/* Totals */}
        <div className="w-[280px] text-[14px]">
          <div className="flex justify-between mb-[12px]">
            <span className="text-[#555]">Subtotal</span>
            <span className="text-[#555]">A${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-[12px]">
            <span className="text-[#555]">Total</span>
            <span className="text-[#555]">A${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-[24px]">
            <span className="text-[#555]">Paid</span>
            <span className="text-[#555]">A$0.00</span>
          </div>
          <div className="flex justify-between border-y-[3px] border-[#81cbf0] py-3 mt-4 text-[18px]">
            <span className="font-semibold text-[#4f5660]">Balance Due</span>
            <span className="font-semibold text-[#4f5660]">A${balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
