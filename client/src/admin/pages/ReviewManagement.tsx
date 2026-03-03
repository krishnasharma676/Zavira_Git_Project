
import { useState, useEffect } from 'react';
import { Check, Trash2, Star } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews/admin/all');
      setReviews(data.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
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
    viewColumns: false
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Reviews</h1>
        <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage product feedback</p>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={reviews} columns={columns} options={options} />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default ReviewManagement;
