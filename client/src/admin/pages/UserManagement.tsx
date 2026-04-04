import { useState, useEffect, useRef } from 'react';
import { Mail, Shield, UserX, UserPlus, BadgeCheck, Globe, Lock, MoreVertical, Activity, Calendar, Clock, Trash2 } from 'lucide-react';
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchUsers();
    }
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
  };  const handleBlockUser = async (id: string) => {
    try {
      await api.patch(`/auth/admin/users/${id}/block`);
      toast.success('User blocked successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (id: string) => {
    try {
      await api.patch(`/auth/admin/users/${id}/unblock`);
      toast.success('User unblocked successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  const handleSoftDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user record from active view?')) return;
    try {
      await api.patch(`/auth/admin/users/${id}/delete`);
      toast.success('User purged successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to purge user');
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
            <div className="flex items-center space-x-3">
               <div className="w-6 h-6 bg-red-50 text-[#7A578D] rounded-sm flex items-center justify-center text-xs font-bold border border-red-100 uppercase shadow-sm">
                  {value?.[0] || user.email?.[0] || 'U'}
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="truncate font-bold uppercase text-xs tracking-wide text-gray-900">{value || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500 lowercase truncate font-medium">{user.email}</span>
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
        customBodyRender: (val: string) => <span className="text-xs font-bold text-gray-500">{val || 'N/A'}</span>
      }
    },
    {
      name: "id",
      label: "Identity",
      options: {
        customBodyRender: (id: string) => (
          <div className="flex items-center gap-1" title={id}>
            <span className="text-xs font-mono font-bold text-[#7A578D] bg-[#7A578D]/5 px-2 py-1 rounded-md border border-[#7A578D]/10 uppercase tracking-widest">{id}</span>
          </div>
        )
      }
    },
    {
      name: "isEmailVerified",
      label: "Verified",
      options: {
        customBodyRender: (val: boolean) => (
          <div className="flex items-center space-x-1">
             {val ? (
               <div className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-green-100 shadow-sm w-fit">
                 <BadgeCheck size={14} className="mr-1.5" /> Verified
               </div>
             ) : (
               <div className="flex items-center text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-amber-100 shadow-sm w-fit">
                 <Globe size={14} className="mr-1.5" /> Pending
               </div>
             )}
          </div>
        )
      }
    },
    { 
      name: "role", 
      label: "Role",
      options: {
        customBodyRender: (val: string) => (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest border shadow-sm ${val === 'ADMIN' ? 'bg-[#7A578D]/10 text-[#7A578D] border-[#7A578D]/20' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{val}</span>
        )
      }
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (val: string) => (
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 max-w-fit shadow-sm">
             <div className={`w-2 h-2 rounded-full ${val === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
             <span className={`text-xs font-bold uppercase tracking-widest ${val === 'ACTIVE' ? 'text-green-700' : 'text-red-700'}`}>{val}</span>
          </div>
        )
      }
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const user = users[tableMeta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-[#7A578D]/10 text-[#7A578D] rounded-sm transition-colors" title="Send Notification"><Mail size={16} /></button>
              {user.status === 'ACTIVE' ? (
                <button 
                  onClick={() => handleBlockUser(id)}
                  className="p-2 hover:bg-amber-50 text-amber-600 rounded-sm transition-colors border border-transparent hover:border-amber-200" 
                  title="Block Access"
                >
                  <UserX size={16} />
                </button>
              ) : (
                <button 
                  onClick={() => handleUnblockUser(id)}
                  className="p-2 hover:bg-green-50 text-green-600 rounded-sm transition-colors border border-transparent hover:border-green-200" 
                  title="Restore Access"
                >
                  <Lock size={16} />
                </button>
              )}
              <button 
                onClick={() => handleSoftDeleteUser(id)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-sm transition-colors border border-transparent hover:border-red-200" 
                title="Purge Record"
              >
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
    expandableRows: true, // USER REQ
    expandableRowsOnClick: true, // USER REQ
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const user = users[rowMeta.rowIndex];
      if (!user) return null;
      return (
        <tr style={{ backgroundColor: '#fff' }}>
          <td colSpan={columns.length + 1} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', color: '#333' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Full Name:</strong>
                <span>{user.name || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Email:</strong>
                <span style={{ textTransform: 'lowercase' }}>{user.email}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Phone:</strong>
                <span>{user.phoneNumber || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Role:</strong>
                <span>{user.role}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Verified:</strong>
                <span>{user.isEmailVerified ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Status:</strong>
                <span>{user.status}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Joined:</strong>
                <span>{new Date(user.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Reference ID:</strong>
                <span>{user.id}</span>
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
          <h1 className="text-lg font-bold uppercase tracking-tight text-gray-900 leading-none">Users</h1>
          <p className="text-gray-500 text-xs font-medium mt-2">Manage your customers and staff members.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-[#7A578D] transition-all shadow-md active:scale-95 uppercase tracking-wider"
        >
          <UserPlus size={18} />
          <span>Add Staff Member</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={users} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Staff Member"
      >
        <form onSubmit={handleAuthorize} className="space-y-2">
           <div className="flex items-center gap-2 bg-[#7A578D]/5 p-2 rounded-sm border border-[#7A578D]/10">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center text-[#7A578D] shadow-sm">
                  <Shield size={28} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-[#7A578D] uppercase tracking-widest">Staff Account</h3>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">They will get admin access to the dashboard.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1.5 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs lowercase font-medium transition-all" placeholder="name@company.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" required value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1.5 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold transition-all" placeholder="9876543210" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Assign Role</label>
                <div className="relative">
                  <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm py-1.5 px-2 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] text-xs font-bold uppercase tracking-wider appearance-none cursor-pointer transition-all">
                    <option value="ADMIN">ADMINISTRATOR</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EDITOR">EDITOR</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
           </div>

           <button type="submit" className="w-full bg-black text-white py-1 mt-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#7A578D] transition-all shadow-xl shadow-black/10 active:scale-95">
              CREATE STAFF ACCOUNT
           </button>
        </form>
      </ManagementModal>
    </div>
  );
};

export default UserManagement;
