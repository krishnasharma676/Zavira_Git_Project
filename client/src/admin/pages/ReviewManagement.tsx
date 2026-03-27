
import { useState, useEffect, useRef } from 'react';
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchReviews();
    }
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
             <span className="text-xs font-bold text-gray-900 tracking-wide">{val?.name || 'N/A'}</span>
             <span className="text-xs text-gray-500 lowercase font-medium">{val?.email}</span>
          </div>
        )
      }
    },
    { 
      name: "product", 
      label: "Product", 
      options: { 
        customBodyRender: (val: any) => <span className="text-xs font-bold text-[#7A578D] uppercase tracking-wider">{val?.name || 'N/A'}</span> 
      } 
    },
    {
      name: "rating",
      label: "Rating",
      options: {
        customBodyRender: (val: number) => (
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < val ? "#7A578D" : "transparent"} className={i < val ? "text-[#7A578D]" : "text-gray-200"} />
            ))}
          </div>
        )
      }
    },
    {
      name: "comment",
      label: "Comment",
      options: {
        customBodyRender: (val: string) => <p className="truncate max-w-[200px] text-xs font-medium text-gray-500 normal-case" title={val}>{val}</p>
      }
    },
    {
      name: "isApproved",
      label: "Status",
      options: {
        customBodyRender: (val: boolean) => (
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 max-w-fit shadow-sm">
             <div className={`w-2 h-2 rounded-full ${val ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]'}`} />
             <span className={`text-xs font-bold uppercase tracking-widest ${val ? 'text-green-700' : 'text-yellow-700'}`}>{val ? 'APPROVED' : 'PENDING'}</span>
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
                <button onClick={() => handleApprove(id)} className="p-2 hover:bg-green-50 text-green-600 rounded-sm transition-colors border border-transparent hover:border-green-200" title="Approve Review">
                   <Check size={16} />
                </button>
              )}
              <button onClick={() => handleDelete(id)} className="p-2 hover:bg-red-50 text-red-500 rounded-sm transition-colors border border-transparent hover:border-red-200" title="Delete Review">
                 <Trash2 size={16} />
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
        <tr style={{ backgroundColor: '#fff' }}>
          <td colSpan={columns.length + 1} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', color: '#333' }}>
              <div style={{ gridColumn: 'span 4' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Customer Review:</strong>
                <span>{rev.comment}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Rating:</strong>
                <span>{rev.rating} / 5</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Status:</strong>
                <span>{rev.isApproved ? 'Approved' : 'Pending Review'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Product:</strong>
                <span>{rev.product?.name}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Email:</strong>
                <span>{rev.user?.email}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Posted On:</strong>
                <span>{new Date(rev.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Review ID:</strong>
                <span>{rev.id}</span>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  };


  return (
    <div className="space-y-2 animate-in fade-in duration-500 max-w-[1600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900 leading-none">Reviews</h1>
          <p className="text-gray-500 text-xs font-medium mt-2">See and manage what customers think of your products.</p>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[200px]">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={reviews} columns={columns} options={options} />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default ReviewManagement;
