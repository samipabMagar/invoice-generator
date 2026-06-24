import { z } from 'zod';

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be positive'),
});

export const invoiceSchema = z.object({
  senderDetails: z.object({
    name: z.string().optional(),
    taxId: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    bsb: z.string().optional(),
    accountNumber: z.string().optional(),
  }),
  clientDetails: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
  }),
  invoiceMeta: z.object({
    invoiceNo: z.string().optional(),
    date: z.string().optional(),
    terms: z.string().optional(),
    dueDate: z.string().optional(),
  }),
  items: z.array(invoiceItemSchema),
  paid: z.number().min(0).optional(),
  paymentInstructions: z.string().optional(),
});

export type InvoiceType = z.infer<typeof invoiceSchema>;
export type InvoiceItemType = z.infer<typeof invoiceItemSchema>;

export const defaultInvoiceValues: InvoiceType = {
  senderDetails: { name: '', taxId: '', bsb: '', accountNumber: '' },
  clientDetails: { name: '', address: '' },
  invoiceMeta: {
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    terms: 'NET 30',
    dueDate: '',
  },
  items: [],
  paid: 0,
  paymentInstructions: '',
};
