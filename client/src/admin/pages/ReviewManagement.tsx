
import { useState, useEffect } from 'react';
import { Check, Trash2, Star, Clock, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews/admin/all');
      setReviews(data.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/reviews/admin/${id}/approve`);
      toast.success('Approved');
      fetchReviews();
    } catch (error) {
      toast.error('Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      toast.success('Deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed');
    }
  };




  const columns = [
    {
      name: "user",
      label: "Customer",
      options: {
        customBodyRender: (val: any) => (
          <div className="flex flex-col truncate max-w-[150px]">
             <span>{val?.name || 'N/A'}</span>
             <span className="text-[8px] text-gray-400 lowercase">{val?.email}</span>
          </div>
        )
      }
    },
    { 
      name: "product", 
      label: "Product", 
      options: { 
        customBodyRender: (val: any) => <span className="text-[#7A578D]">{val?.name || 'N/A'}</span> 
      } 
    },
    {
      name: "rating",
      label: "Rating",
      options: {
        customBodyRender: (val: number) => (
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={8} fill={i < val ? "#7A578D" : "transparent"} className={i < val ? "text-[#7A578D]" : "text-gray-200"} />
            ))}
          </div>
        )
      }
    },
    {
      name: "comment",
      label: "Comment",
      options: {
        customBodyRender: (val: string) => <p className="truncate max-w-[200px] text-gray-500 normal-case">{val}</p>
      }
    },
    {
      name: "isApproved",
      label: "Status",
      options: {
        customBodyRender: (val: boolean) => (
          <div className="flex items-center space-x-1">
             <div className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-green-500' : 'bg-yellow-500'}`} />
             <span className={val ? 'text-green-600' : 'text-yellow-600'}>{val ? 'APPROVED' : 'PENDING'}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const rev = reviews[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              {!rev.isApproved && (
                <button onClick={() => handleApprove(id)} className="p-1 px-2 hover:bg-green-50 text-green-600 rounded">
                   <Check size={12} />
                </button>
              )}
              <button onClick={() => handleDelete(id)} className="p-1 px-2 hover:bg-red-50 text-red-400 rounded">
                 <Trash2 size={12} />
              </button>
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
    viewColumns: false,
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const rev = reviews[rowMeta.rowIndex];
      if (!rev) return null;
      return (
        <tr className="bg-gray-50/50">
          <td colSpan={columns.length + 1} className="p-0 border-b border-gray-100">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2">
                     <MessageSquare size={12} /> Detailed Feedback
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm italic text-[11px] font-black uppercase text-gray-600 leading-relaxed">
                     "{rev.comment}"
                  </div>
                   <div className="flex items-center gap-6 pt-2">
                      <div className="flex flex-col">
                         <span className="text-[7px] font-black text-gray-400 uppercase mb-1">Rating Score</span>
                         <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                               <Star key={i} size={14} fill={i < rev.rating ? "#7A578D" : "transparent"} className={i < rev.rating ? "text-[#7A578D]" : "text-gray-200"} />
                            ))}
                         </div>
                      </div>
                      <div className="flex flex-col border-l border-gray-100 pl-6">
                         <span className="text-[7px] font-black text-gray-400 uppercase mb-1">Status Dossier</span>
                         <span className={`text-[10px] font-black uppercase ${rev.isApproved ? 'text-green-600' : 'text-amber-500'}`}>
                            {rev.isApproved ? 'PUBLICLY VERIFIED' : 'PENDING REVIEW'}
                         </span>
                      </div>
                   </div>

                   {rev.images && rev.images.length > 0 && (
                     <div className="pt-4 space-y-2">
                        <span className="text-[7px] font-black text-gray-400 uppercase">Review Evidence (Photos)</span>
                        <div className="flex gap-2">
                           {rev.images.map((img: string, i: number) => (
                              <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-20 rounded-lg overflow-hidden border border-gray-100 hover:border-[#7A578D] transition-all relative group">
                                 <img src={img} alt="review" className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-[8px] text-white font-black uppercase">VIEW</span>
                                 </div>
                              </a>
                           ))}
                        </div>
                     </div>
                   )}
                </div>


               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                     <Clock size={12} /> Admin Ledger
                  </h3>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Product Name</span>
                        <span className="text-[9px] font-black text-[#7A578D] uppercase truncate max-w-[150px]">{rev.product?.name}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-gray-0">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Customer Email</span>
                        <span className="text-[9px] font-bold text-gray-700 lowercase select-all">{rev.user?.email}</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-[8px] font-black text-gray-400 uppercase">Logged At</span>
                        <span className="text-[9px] font-black text-gray-900 uppercase">{new Date(rev.createdAt).toLocaleString()}</span>
                     </div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                     <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">Record Reference</span>
                     <span className="text-[8px] font-mono text-gray-400 mt-1 uppercase select-all">#{rev.id}</span>
                  </div>
               </div>
            </div>
          </td>
        </tr>
      );
    }
  };


  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="border-b border-gray-100 pb-2">
        <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Reviews</h1>
        <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1">Manage product feedback</p>
      </header>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={reviews} columns={columns} options={options} />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default ReviewManagement;
