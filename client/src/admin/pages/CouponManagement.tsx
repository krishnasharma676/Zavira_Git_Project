
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Ticket, Clock, CheckCircle, XCircle, BadgeCheck } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const CouponManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons/admin/all');
      setCoupons(data.data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().slice(0, 16) : '',
      usageLimit: coupon.usageLimit?.toString() || '',
      isActive: coupon.isActive
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      isActive: true
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    try {
      if (editingCoupon) {
        await api.patch(`/coupons/${editingCoupon.id}`, payload);
      } else {
        await api.post('/coupons', payload);
      }
      toast.success('Success');
      setIsModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };




  const columns = [
    { name: "code", label: "Code", options: { customBodyRender: (val: string) => <span className="font-mono text-[#7A578D]">{val}</span> } },
    { 
      name: "discountValue", 
      label: "Value",
      options: {
        customBodyRender: (val: number, meta: any) => {
          const type = coupons[meta.rowIndex]?.discountType;
          return <span>{type === 'PERCENTAGE' ? `${val}%` : `₹${val}`}</span>
        }
      }
    },
    { 
      name: "usageLimit", 
      label: "Usage",
      options: {
        customBodyRender: (val: number, meta: any) => {
          const used = coupons[meta.rowIndex]?.usedCount || 0;
          return <span>{used} / {val || '∞'}</span>
        }
      }
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (val: boolean) => (
          <div className="flex items-center space-x-1">
             <div className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-green-500' : 'bg-red-500'}`} />
             <span className={val ? 'text-green-600' : 'text-red-500'}>{val ? 'ACTIVE' : 'HIDDEN'}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const coupon = coupons[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(coupon)} className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded transition-colors"><Edit2 size={12} /></button>
              <button onClick={() => handleDelete(id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors"><Trash2 size={12} /></button>
            </div>
          )
        }
      }
    }
  ];

  const options = {
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    rowsPerPage: 10,
    download: false,
    print: false,
    viewColumns: false
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Coupons</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage discounts & offers</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#7A578D] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all"
        >
          <Plus size={14} />
          <span>New Coupon</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={coupons} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCoupon ? "Edit Coupon" : "Add New Coupon"}
      >
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Code</label>
                <input required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase font-mono" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                <select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase">
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FIXED">FIXED AMOUNT</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Value</label>
                <input required value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} type="number" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black italic" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Min Order</label>
                <input value={formData.minOrderAmount} onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})} type="number" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black italic" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Start Date</label>
                <input value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} type="datetime-local" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">End Date</label>
                <input value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} type="datetime-local" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[10px] font-black uppercase" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
              {editingCoupon ? 'UPDATE COUPON' : 'SAVE COUPON'}
            </button>
         </form>
      </ManagementModal>
    </div>
  );
};

export default CouponManagement;
