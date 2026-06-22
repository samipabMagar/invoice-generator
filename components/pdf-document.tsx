import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceType } from '@/lib/schema';

// Recreation of the invoice applying React-PDF primitives
const styles = StyleSheet.create({
  page: { padding: 48, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 48 },
  senderName: { fontSize: 28, color: '#4f5660', fontWeight: 'extrabold', marginBottom: 8 },
  senderSub: { fontSize: 12, color: '#555555' },
  invoiceTitle: { fontSize: 36, color: '#4f5660', textAlign: 'right', marginBottom: 24 },
  tableCell: { fontSize: 11, color: '#555555', textAlign: 'right' },
  tableLabel: { fontSize: 11, color: '#4f5660', fontWeight: 'extrabold', paddingRight: 16, textAlign: 'right' },
  metaTable: { flexDirection: 'column' },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#eeeeee', marginBottom: 32 },
  billToContainer: { flexDirection: 'row', marginBottom: 40 },
  billToLabel: { fontSize: 13, color: '#4f5660', fontWeight: 'extrabold', width: 90 },
  billToText: { fontSize: 12, color: '#555555', lineHeight: 1.5 },
  itemsHeader: { flexDirection: 'row', borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#81cbf0', paddingVertical: 10 },
  col1: { width: '40%', fontSize: 12, color: '#4f5660', fontWeight: 'extrabold' },
  col2: { width: '20%', fontSize: 12, color: '#4f5660', fontWeight: 'extrabold', textAlign: 'center' },
  col3: { width: '20%', fontSize: 12, color: '#4f5660', fontWeight: 'extrabold', textAlign: 'right' },
  col4: { width: '20%', fontSize: 12, color: '#4f5660', fontWeight: 'extrabold', textAlign: 'right' },
  itemRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f2f2f2', paddingVertical: 14 },
  itemDesc: { width: '40%', fontSize: 11, color: '#555555' },
  itemQty: { width: '20%', fontSize: 11, color: '#555555', textAlign: 'center' },
  itemRate: { width: '20%', fontSize: 11, color: '#555555', textAlign: 'right' },
  itemAmount: { width: '20%', fontSize: 11, color: '#555555', textAlign: 'right' },
  bottomSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 24 },
  paymentCard: { width: 280, backgroundColor: '#eff6fb', padding: 20, borderRadius: 4 },
  paymentTitle: { fontSize: 12, color: '#4f5660', fontWeight: 'extrabold', marginBottom: 8 },
  paymentText: { fontSize: 11, color: '#555555', lineHeight: 1.5 },
  totalsContainer: { width: 200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalText: { fontSize: 11, color: '#555555' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#81cbf0', paddingVertical: 10, marginTop: 4 },
  balanceLabel: { fontSize: 14, color: '#4f5660', fontWeight: 'extrabold' },
  balanceValue: { fontSize: 14, color: '#4f5660', fontWeight: 'extrabold' }
});

export function InvoicePDF({ data }: { data: InvoiceType }) {
  const subtotal = (data.items || []).reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return acc + (qty * rate);
  }, 0);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.senderName}>{data.senderDetails?.name || 'Sender Name'}</Text>
            <Text style={styles.senderSub}>
              {data.senderDetails?.bsb}{data.senderDetails?.accountNumber ? ` ${data.senderDetails.accountNumber}` : ''}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <View style={styles.metaTable}>
              <View style={styles.metaRow}>
                <Text style={styles.tableLabel}>Invoice No:</Text>
                <Text style={styles.tableCell}>{data.invoiceMeta?.invoiceNo || '#'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.tableLabel}>Date:</Text>
                <Text style={styles.tableCell}>{data.invoiceMeta?.date || ''}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.tableLabel}>Terms:</Text>
                <Text style={styles.tableCell}>{data.invoiceMeta?.terms || ''}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.tableLabel}>Due Date:</Text>
                <Text style={styles.tableCell}>{data.invoiceMeta?.dueDate || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill To */}
        <View style={styles.billToContainer}>
          <Text style={styles.billToLabel}>Bill To:</Text>
          <View style={{ flex: 1 }}>
            {data.clientDetails?.name && <Text style={styles.billToText}>{data.clientDetails.name}</Text>}
            {data.clientDetails?.address && (
              <Text style={styles.billToText}>{(data.clientDetails.address || '').replace(/\n/g, ' ')}</Text>
            )}
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.itemsHeader}>
          <Text style={styles.col1}>Description</Text>
          <Text style={styles.col2}>Quantity</Text>
          <Text style={styles.col3}>Rate</Text>
          <Text style={styles.col4}>Amount</Text>
        </View>

        {/* Table Rows */}
        <View style={{ flex: 1 }}>
          {(data.items || []).map((item, i) => {
            const qty = Number(item.quantity) || 0;
            const rate = Number(item.rate) || 0;
            const amount = qty * rate;
            return (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemQty}>{qty} hours</Text>
                <Text style={styles.itemRate}>A${rate.toFixed(2)}</Text>
                <Text style={styles.itemAmount}>A${amount.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>Payment Instructions</Text>
            <Text style={styles.paymentText}>{data.paymentInstructions || ''}</Text>
          </View>
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Subtotal</Text>
              <Text style={styles.totalText}>A${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>A${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Paid</Text>
              <Text style={styles.totalText}>A$0.00</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Balance Due</Text>
              <Text style={styles.balanceValue}>A${subtotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
