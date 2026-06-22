import { z } from 'zod';

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be positive'),
});

export const invoiceSchema = z.object({
  senderDetails: z.object({
    name: z.string().min(1, 'Sender name is required'),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    bsb: z.string().optional(),
    accountNumber: z.string().optional(),
  }),
  clientDetails: z.object({
    name: z.string().min(1, 'Bill To name is required'),
    address: z.string().optional(),
  }),
  invoiceMeta: z.object({
    invoiceNo: z.string().min(1, 'Invoice No is required'),
    date: z.string().min(1, 'Date is required'),
    terms: z.string().optional(),
    dueDate: z.string().optional(),
  }),
  items: z.array(invoiceItemSchema),
  paymentInstructions: z.string().optional(),
});

export type InvoiceType = z.infer<typeof invoiceSchema>;
export type InvoiceItemType = z.infer<typeof invoiceItemSchema>;

export const defaultInvoiceValues: InvoiceType = {
  senderDetails: {
    name: 'Nayan Thapa',
    bsb: '082451',
    accountNumber: '407220013',
  },
  clientDetails: {
    name: 'MI CONSTRUCTION',
    address: '22 Coast Ave\nCronulla, NSW, 2230',
  },
  invoiceMeta: {
    invoiceNo: '2',
    date: new Date().toISOString().split('T')[0],
    terms: 'NET 0',
    dueDate: new Date().toISOString().split('T')[0],
  },
  items: [
    {
      id: '1',
      description: 'Tuesday',
      quantity: 7,
      rate: 35.00,
    },
    {
      id: '2',
      description: 'Wednesday',
      quantity: 8,
      rate: 35.00,
    },
  ],
  paymentInstructions: 'BSB: 082451\nAccount number: 407220013\nName :Nayan Thapa',
};
