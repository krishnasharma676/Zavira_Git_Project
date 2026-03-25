
import { useState, useEffect } from 'react';
import { Mail, Shield, UserX, UserPlus, BadgeCheck, Globe, Lock, MoreVertical, Activity, Calendar, Clock } from 'lucide-react';
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
            <div className="flex items-center space-x-2">
               <div className="w-7 h-7 bg-red-50 text-[#7A578D] rounded-full flex items-center justify-center text-[9px] font-black border border-red-100 uppercase">
                  {value?.[0] || user.email?.[0] || 'U'}
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="truncate font-black uppercase text-[10px] tracking-tight">{value || 'Anonymous'}</span>
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
        customBodyRender: (val: string) => <span className="text-[10px] font-bold text-gray-500 italic">{val || 'N/A'}</span>
      }
    },
    {
      name: "id",
      label: "Identity",
      options: {
        customBodyRender: (id: string) => (
          <div className="flex items-center gap-1.5" title={id}>
            <span className="text-[7px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded border border-[#7A578D]/10 uppercase">{id}</span>
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
               <div className="flex items-center text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                 <BadgeCheck size={10} className="mr-1" /> Verified
               </div>
             ) : (
               <div className="flex items-center text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                 <Globe size={10} className="mr-1" /> Pending
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
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${val === 'ADMIN' ? 'bg-[#7A578D]/10 text-[#7A578D]' : 'bg-gray-100 text-gray-500'}`}>{val}</span>
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
             <span className={`text-[9px] font-black uppercase ${val === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>{val}</span>
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
            <div className="flex space-x-1">
              <button className="p-1 px-2 hover:bg-[#7A578D]/5 text-[#7A578D] rounded" title="Send Notification"><Mail size={12} /></button>
              {user.status === 'ACTIVE' ? (
                <button 
                  onClick={() => handleBlockUser(id)}
                  className="p-1 px-2 hover:bg-amber-50 text-amber-600 rounded" 
                  title="Block Access"
                >
                  <UserX size={12} />
                </button>
              ) : (
                <button 
                  onClick={() => handleUnblockUser(id)}
                  className="p-1 px-2 hover:bg-green-50 text-green-600 rounded" 
                  title="Restore Access"
                >
                  <Lock size={12} />
                </button>
              )}
              <button 
                onClick={() => handleSoftDeleteUser(id)}
                className="p-1 px-2 hover:bg-red-50 text-red-500 rounded" 
                title="Purge Record"
              >
                  <MoreVertical size={12} />
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
        <tr className="bg-gray-50/50">
          <td colSpan={columns.length + 1} className="p-0 border-b border-gray-100">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
               {/* User Context */}
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-2">
                     <BadgeCheck size={14} /> User Identity
                  </h3>
                  <div className="space-y-3 pl-4">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Legal Name</span>
                        <span className="text-[11px] font-black text-gray-900 uppercase">{user.name || 'ANONYMOUS_CLIENT'}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Electronic Mail</span>
                        <span className="text-[10px] font-bold text-[#7A578D] lowercase select-all">{user.email}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Primary Phone</span>
                        <span className="text-[10px] font-black text-gray-700 italic">{user.phoneNumber || 'NO_CONTACT_DATA'}</span>
                     </div>
                  </div>
               </div>

               {/* Access Governance */}
               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                     <Shield size={14} className="text-[#7A578D]" /> Account Governance
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <span className="text-[8px] font-black text-gray-400 uppercase block mb-1">Role</span>
                         <span className="text-[10px] font-black text-gray-900 uppercase">{user.role}</span>
                      </div>
                      <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <span className="text-[8px] font-black text-gray-400 uppercase block mb-1">Verification</span>
                         <span className={`text-[10px] font-black uppercase ${user.isEmailVerified ? 'text-green-600' : 'text-amber-500'}`}>
                            {user.isEmailVerified ? 'VERIFIED' : 'PENDING'}
                         </span>
                      </div>
                      <div className="col-span-2 p-2 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center justify-between">
                         <span className="text-[8px] font-black text-gray-400 uppercase">System Status</span>
                         <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-[9px] font-black text-gray-900 uppercase">{user.status}</span>
                         </div>
                      </div>
                  </div>
               </div>

               {/* Admin Ledger */}
               <div className="space-y-4 border-l border-gray-100 pl-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                     <Activity size={14} className="text-[#7A578D]" /> Admin Ledger
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-start gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 group">
                        <Calendar size={14} className="text-gray-400 mt-0.5" />
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Enrollment Date</span>
                           <span className="text-[10px] font-black text-gray-900 uppercase">{new Date(user.createdAt).toLocaleString()}</span>
                        </div>
                     </div>
                     <div className="flex items-start gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 group">
                        <Clock size={14} className="text-gray-400 mt-0.5" />
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Last Modified</span>
                           <span className="text-[10px] font-black text-gray-900 uppercase">{new Date(user.updatedAt).toLocaleString()}</span>
                        </div>
                     </div>
                     <div className="p-2.5 bg-[#7A578D]/5 rounded-xl border border-[#7A578D]/10 flex flex-col items-center justify-center">
                        <span className="text-[7px] font-black text-[#7A578D] uppercase tracking-widest">Internal DB Record</span>
                        <span className="text-[8px] font-mono text-gray-400 mt-1 uppercase select-all leading-none truncate max-w-full">#{user.id}</span>
                     </div>
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
      <header className="flex justify-between items-center border-b border-gray-100 pb-2">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Users</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1">Manage customers & staff</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7A578D] text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-black transition-all"
        >
          <UserPlus size={12} />
          <span>New Staff User</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
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
        <form onSubmit={handleAuthorize} className="space-y-3">
           <div className="flex items-center space-x-3 bg-red-50/30 p-2 rounded-lg border border-red-50/50">
              <div className="w-8 h-8 bg-white border border-red-100 rounded-md flex items-center justify-center text-[#7A578D] shadow-sm italic relative">
                  <Shield size={14} />
              </div>
              <div>
                <h3 className="text-[9px] font-black uppercase tracking-widest text-[#7A578D]">Create Staff</h3>
                <p className="text-gray-500 text-[7px] font-bold uppercase tracking-tight mt-0.5">Assign administrative privileges.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                <input type="email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black lowercase" placeholder="admin@zavira.com" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone</label>
                <input type="text" required value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black italic" placeholder="9876543210" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Role Assignment</label>
                <select value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase appearance-none cursor-pointer">
                  <option value="ADMIN">ADMINISTRATOR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EDITOR">EDITOR</option>
                </select>
              </div>
           </div>

           <div className="pt-2">
            <button type="submit" className="w-full bg-[#7A578D] text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
              CREATE STAFF USER
            </button>
           </div>
        </form>
      </ManagementModal>
    </div>
  );
};

export default UserManagement;
