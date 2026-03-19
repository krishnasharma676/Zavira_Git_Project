import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface InvoiceProps {
  order: any;
  settings: any;
}

const OrderInvoice = ({ order, settings }: InvoiceProps) => {
  if (!order || !settings) return null;

  const subtotal = order.totalAmount || 0;
  const shipping = order.shippingCharges || 0;
  const discount = order.discountAmount || 0;
  const total = order.payableAmount || 0;
  
  // GST Split (Assuming CGST 50% / SGST 50% for local, or IGST 100% for interstate)
  // For simplicity since we don't know state yet, we'll just show the total GST component
  const totalTax = order.taxAmount || 0;

  return (
    <div className="bg-white p-8 max-w-[800px] mx-auto border border-gray-100 shadow-sm font-sans text-gray-900 print:shadow-none print:border-none print:p-0">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-black rounded shrink-0 flex items-center justify-center text-white italic font-black text-xl">Z</div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">ZAVIRAA</h1>
           </div>
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Curated Elegance & Accessories</p>
        </div>
        <div className="text-right">
           <h2 className="text-xl font-black uppercase tracking-widest text-[#7A578D]">Tax Invoice</h2>
           <p className="text-[10px] font-black text-gray-400 mt-1 uppercase">Original for Recipient</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
           <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 border-b border-gray-100 pb-1">Sold By</h3>
           <div className="space-y-1">
              <p className="text-sm font-black uppercase">{settings.store_name || 'ZAVIRAA ENTERPRISE'}</p>
              <div className="flex items-start gap-1.5 text-[9px] text-gray-600 font-bold uppercase leading-relaxed max-w-[250px]">
                 <MapPin size={10} className="mt-0.5 shrink-0" />
                 <span>{settings.store_address || 'Warehouse 12, Business Park, New Delhi - 110001'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-[#7A578D] font-black mt-2">
                 <ShieldCheck size={10} />
                 <span>GSTIN: {settings.store_gstin || 'GST NUMBER PENDING'}</span>
              </div>
              <div className="flex items-center gap-4 text-[8px] text-gray-400 font-bold mt-2 uppercase">
                 <span className="flex items-center gap-1"><Mail size={8} /> {settings.store_email}</span>
                 <span className="flex items-center gap-1"><Phone size={8} /> {settings.store_phone}</span>
              </div>
           </div>
        </div>
        <div className="text-right flex flex-col items-end">
           <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 border-b border-gray-100 pb-1 w-full">Ship To</h3>
           <div className="space-y-1">
              <p className="text-[11px] font-black uppercase">{order.address?.name}</p>
              <p className="text-[9px] font-bold text-gray-600 uppercase leading-relaxed max-w-[200px]">
                 {order.address?.street}, {order.address?.area}<br />
                 {order.address?.city}, {order.address?.state} - {order.address?.pincode}
              </p>
              <p className="text-[10px] font-black text-[#7A578D] mt-1">{order.address?.phone}</p>
           </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="flex justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
         <div className="text-center px-4">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Invoice No.</p>
            <p className="text-sm font-black uppercase">{order.orderNumber.split('-')[2] || order.orderNumber.slice(-8)}</p>
         </div>
         <div className="w-[1px] bg-gray-200" />
         <div className="text-center px-4">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
            <p className="text-sm font-black uppercase">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
         </div>
         <div className="w-[1px] bg-gray-200" />
         <div className="text-center px-4">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
            <p className="text-sm font-black uppercase">{order.paymentMethod}</p>
         </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-10 text-left border-collapse">
        <thead>
           <tr className="border-y-2 border-gray-900">
              <th className="py-3 text-[9px] font-black uppercase tracking-widest">S.No</th>
              <th className="py-3 text-[9px] font-black uppercase tracking-widest">Product Description</th>
              <th className="py-3 text-[9px] font-black uppercase tracking-widest text-center">Qty</th>
              <th className="py-3 text-[9px] font-black uppercase tracking-widest text-right">Unit Price</th>
              <th className="py-3 text-[9px] font-black uppercase tracking-widest text-right">Taxable</th>
              <th className="py-3 text-[9px] font-black uppercase tracking-widest text-right">Tax (%)</th>
              <th className="py-3 text-[9px] font-black uppercase tracking-widest text-right">Total</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
           {order.items?.map((item: any, i: number) => {
              const unitPrice = item.price || 0;
              const qty = item.quantity || 1;
              const itemTotal = unitPrice * qty;
              const taxRate = item.product?.taxRate || settings.tax_percentage || 0;
              // Inclusive price to Taxable value: Total / (1 + Rate/100)
              const taxableValue = itemTotal / (1 + taxRate/100);
              
              return (
                 <tr key={i}>
                    <td className="py-4 text-[10px] font-bold text-gray-400">{(i + 1).toString().padStart(2, '0')}</td>
                    <td className="py-4">
                       <p className="text-[10px] font-black uppercase leading-tight line-clamp-2 max-w-[200px]">{item.product?.name}</p>
                       <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">HSN: {item.product?.hsnCode || 'N/A'}</p>
                    </td>
                    <td className="py-4 text-center text-[10px] font-black">{qty}</td>
                    <td className="py-4 text-right text-[10px] font-black">{formatCurrency(unitPrice)}</td>
                    <td className="py-4 text-right text-[10px] font-black text-gray-500">{formatCurrency(taxableValue)}</td>
                    <td className="py-4 text-right text-[10px] font-black text-[#7A578D]">{taxRate}%</td>
                    <td className="py-4 text-right text-[11px] font-black">{formatCurrency(itemTotal)}</td>
                 </tr>
              );
           })}
        </tbody>
      </table>

      {/* Summary Footer */}
      <div className="flex justify-end pr-0">
         <div className="w-72 space-y-2 border-t-2 border-gray-900 pt-4">
            <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
               <span>Net Amount</span>
               <span className="text-gray-900">{formatCurrency(subtotal - totalTax)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
               <span>GST Total Component</span>
               <span className="text-gray-900">{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
               <span>Shipping Details</span>
               <span className="text-gray-900">{formatCurrency(shipping)}</span>
            </div>
            {discount > 0 && (
               <div className="flex justify-between text-[10px] font-black uppercase text-green-600 tracking-widest">
                  <span>Voucher Applied</span>
                  <span>-{formatCurrency(discount)}</span>
               </div>
            )}
            <div className="flex justify-between text-lg font-black uppercase bg-[#7A578D] text-white p-3 rounded-lg mt-4">
               <span className="text-[11px] mt-1.5 opacity-80 uppercase tracking-widest">Final Total</span>
               <span>{formatCurrency(total)}</span>
            </div>
         </div>
      </div>

      {/* Digital Stamp / Sign */}
      <div className="mt-16 flex justify-between items-end border-t border-gray-100 pt-8">
         <div className="max-w-[300px]">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Declaration</p>
            <p className="text-[8px] font-bold text-gray-400 leading-relaxed uppercase">
               This is a computer-generated invoice and does not require a physical signature. Goods once sold are only eligible for exchange within 7 days.
            </p>
         </div>
         <div className="text-center">
            <div className="w-24 h-24 border-2 border-[#7A578D]/20 rounded-full flex items-center justify-center relative mb-2">
               <div className="absolute inset-2 border border-[#7A578D]/10 rounded-full" />
               <p className="text-[#7A578D] text-[10px] font-black uppercase tracking-tighter -rotate-12 opacity-40">ZAVIRAA<br />ENTERPRISE</p>
            </div>
            <p className="text-[8px] font-black uppercase tracking-widest text-[#7A578D]">Authorized Signatory</p>
         </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center">
         <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">WWW.ZAVIRAA.COM</p>
         <p className="text-[7px] font-black text-gray-200 mt-1 uppercase tracking-widest">Thank you for letting us be a part of your journey.</p>
      </div>

    </div>
  );
};

export default OrderInvoice;
