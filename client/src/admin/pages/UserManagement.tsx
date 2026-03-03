
import { useState, useEffect } from 'react';
import { Mail, Shield, UserX, UserPlus, BadgeCheck, Globe, Lock, Phone, Edit2, MoreVertical } from 'lucide-react';
import api from '../../api/axios';
import ManagementModal from '../components/ManagementModal';
import toast from 'react-hot-toast';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/admin/users');
      setUsers(data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [authForm, setAuthForm] = useState({
    email: '',
    phone: '',
    role: 'ADMIN'
  });

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { 
        ...authForm, 
        name: 'Staff Member', 
        password: 'TemporaryPassword123' 
      });
      toast.success('User created successfully');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };




  const columns = [
    {
      name: "name",
      label: "User Profile",
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const user = users[tableMeta.rowIndex];
          return (
            <div className="flex items-center space-x-2">
               <div className="w-7 h-7 bg-red-50 text-[#7A578D] rounded-full flex items-center justify-center text-[9px] font-black border border-red-100">
                  {value?.[0] || 'U'}
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="truncate">{value || 'Anonymous'}</span>
                  <span className="text-[8px] text-gray-400 lowercase truncate">{user.email}</span>
               </div>
            </div>
          )
        }
      }
    },
    { 
      name: "phoneNumber", 
      label: "Phone",
      options: {
        customBodyRender: (val: string) => <span className="text-gray-500">{val || 'N/A'}</span>
      }
    },
    { 
      name: "role", 
      label: "Role",
      options: {
        customBodyRender: (val: string) => (
          <span className={`px-2 py-0.5 rounded text-[8px] ${val === 'ADMIN' ? 'bg-[#7A578D]/10 text-[#7A578D]' : 'bg-gray-100 text-gray-500'}`}>{val}</span>
        )
      }
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (val: string) => (
          <div className="flex items-center space-x-1">
             <div className={`w-1.5 h-1.5 rounded-full ${val === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
             <span className={val === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}>{val || 'LOCKED'}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string) => (
          <div className="flex space-x-1">
            <button className="p-1 px-2 hover:bg-gray-100 rounded text-gray-400"><Mail size={12} /></button>
            <button className="p-1 px-2 hover:bg-red-50 text-red-400 rounded"><UserX size={12} /></button>
            <button className="p-1 px-2 hover:bg-gray-100 rounded text-gray-400"><MoreVertical size={12} /></button>
          </div>
        )
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
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Users</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage customers & staff</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7A578D] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all"
        >
          <UserPlus size={14} />
          <span>New Staff User</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={users} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Staff Member"
      >
        <form onSubmit={handleAuthorize} className="space-y-4">
           <div className="flex items-center space-x-4 bg-red-50/50 p-3 rounded-xl border border-red-50/50">
              <div className="w-10 h-10 bg-white border border-red-100 rounded-lg flex items-center justify-center text-[#7A578D] shadow-sm italic relative">
                  <Shield size={16} />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">Create Staff</h3>
                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-tight mt-0.5">Assign administrative privileges.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                <input type="email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" placeholder="admin@zavira.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone</label>
                <input type="text" required value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black italic" placeholder="9876543210" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Role Assignment</label>
                <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase appearance-none cursor-pointer">
                  <option value="ADMIN">ADMINISTRATOR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EDITOR">EDITOR</option>
                </select>
              </div>
           </div>

           <button type="submit" className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
             CREATE STAFF USER
           </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default UserManagement;
