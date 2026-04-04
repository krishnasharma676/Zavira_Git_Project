
import { Mail, UserX, UserPlus, BadgeCheck, Globe, Lock, Trash2, Shield, RefreshCw, User, Activity, ShieldCheck, Zap, Info, ChevronRight, Fingerprint } from 'lucide-react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

// Hooks
import { useUsers } from '../hooks/useUsers';

// Components
import ManagementModal from '../components/ManagementModal';
import UserDetailsExpanded from '../components/user/UserDetailsExpanded';
import StaffMemberForm from '../components/user/StaffMemberForm';

const UserManagement = () => {
  const {
    users,
    loading,
    isModalOpen,
    setIsModalOpen,
    authForm,
    setAuthForm,
    fetchUsers,
    handleAuthorize,
    handleBlockUser,
    handleUnblockUser,
    handleSoftDeleteUser,
  } = useUsers();

  const columns = [
    {
      name: 'name',
      label: 'Registrant Profile',
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const user = users[tableMeta.rowIndex];
          return (
            <div className="flex items-center gap-4 text-left group">
              <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center text-[#7A578D] group-hover:bg-black group-hover:text-white transition-all shadow-inner">
                <span className="text-[12px] font-black uppercase">{value?.[0] || user.email?.[0] || 'U'}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate font-black uppercase text-[11px] tracking-tighter text-gray-900 leading-none mb-1.5">
                  {value || 'Nexus_ANONYMOUS'}
                </span>
                <div className="flex items-center gap-2 text-gray-400">
                   <Mail size={10} className="text-[#7A578D]"/>
                   <span className="text-[9px] font-mono font-black lowercase truncate max-w-[150px] opacity-60 leading-none">
                     {user.email}
                   </span>
                </div>
              </div>
            </div>
          );
        }
      }
    },
    {
      name: 'phoneNumber',
      label: 'Network link',
      options: {
        customBodyRender: (val: string) => (
          <div className="flex flex-col text-left group">
             <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1 group-hover:text-[#7A578D] transition-colors">{val || 'NULL_SIGNAL'}</span>
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-60">TELEMETRY_LINK</span>
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Fingerprint ID',
      options: {
        customBodyRender: (id: string) => (
          <div className="flex items-center gap-3 text-left group" title={id}>
             <Fingerprint size={14} className="text-gray-300 group-hover:text-[#7A578D] transition-colors" />
             <span className="text-[9px] font-mono font-black text-[#7A578D] bg-[#7A578D]/5 px-3 py-1.5 rounded-sm border border-[#7A578D]/10 uppercase tracking-widest leading-none shadow-inner">
               #{id.slice(0, 8)}
             </span>
          </div>
        )
      }
    },
    {
      name: 'isEmailVerified',
      label: 'Security validation',
      options: {
        customBodyRender: (val: boolean) => (
          <div className="text-left">
            {val ? (
              <div className="flex items-center text-emerald-700 bg-emerald-500/10 px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 w-fit transition-all hover:scale-105">
                <BadgeCheck size={14} className="mr-3 text-emerald-500" /> VALIDATED
              </div>
            ) : (
              <div className="flex items-center text-orange-700 bg-orange-50 px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] border border-orange-100 shadow-sm w-fit opacity-40 grayscale hover:grayscale-0 transition-all">
                <Globe size={14} className="mr-3 text-orange-400" /> PENDING
              </div>
            )}
          </div>
        )
      }
    },
    {
      name: 'role',
      label: 'Authority Tier',
      options: {
        customBodyRender: (val: string) => (
          <div className="flex items-center text-left">
             <span className={`px-5 py-2 rounded-sm text-[9px] font-black uppercase tracking-[0.4em] border shadow-2xl transition-all hover:scale-110 ${
               val === 'ADMIN' ? 'bg-black border-black text-white shadow-black/20' : 'bg-gray-50/50 text-gray-400 border-gray-100 italic'
             }`}>
               {val}
             </span>
          </div>
        )
      }
    },
    {
      name: 'status',
      label: 'Protocol state',
      options: {
        customBodyRender: (val: string) => (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-sm border shadow-2xl transition-all hover:scale-105 w-fit text-left ${
            val === 'ACTIVE' ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-red-500 border-red-400 text-white shadow-red-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full bg-white ${val === 'ACTIVE' ? 'animate-pulse shadow-lg shadow-white/50' : 'opacity-50'}`} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">
              {val}
            </span>
          </div>
        )
      }
    },
    {
      name: 'id',
      label: 'Executive command',
      options: {
        customBodyRender: (id: string, tableMeta: any) => {
          const user = users[tableMeta.rowIndex];
          return (
            <div className="flex items-center justify-around gap-2 text-left" onClick={(e) => e.stopPropagation()}>
              <button
                className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                title="Send Notification Pulse"
              >
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
              </button>
              {user.status === 'ACTIVE' ? (
                <button
                  onClick={() => handleBlockUser(id)}
                  className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-orange-500 hover:border-orange-500 rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                  title="Suspend Hierarchy Link"
                >
                  <UserX size={18} />
                </button>
              ) : (
                <button
                  onClick={() => handleUnblockUser(id)}
                  className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-emerald-500 hover:border-emerald-500 rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                  title="Restore Hierarchy Link"
                >
                  <Lock size={18} />
                </button>
              )}
              <button
                onClick={() => handleSoftDeleteUser(id)}
                className="w-10 h-10 bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-500 rounded-sm transition-all shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center group"
                title="Purge Identity Artifact"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  const options = {
    selectableRows: 'none' as const,
    elevation: 0,
    responsive: 'standard' as const,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50],
    download: false,
    print: false,
    viewColumns: false,
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => {
      const user = users[rowMeta.rowIndex];
      return <UserDetailsExpanded user={user} columnsLength={columns.length} />;
    },
    textLabels: { body: { noMatch: loading ? 'Synchronizing Identity Manifest Stream...' : 'No identity fragments detected in global archive' } }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
        <div>
           <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Identity_Nexus_Registry</h1>
           <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 bg-[#7A578D]/5 px-2 py-1 rounded-sm border border-[#7A578D]/10 shadow-xl shadow-[#7A578D]/5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse shadow-lg shadow-[#7A578D]/50"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] opacity-70 italic">Global Registrant Matrix Active</span>
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{users.length} REGISTERED_ARCHIVES</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchUsers}
            className="w-12 h-12 bg-white border border-gray-200 rounded-sm text-gray-300 hover:text-[#7A578D] hover:border-[#7A578D] hover:rotate-180 transition-all duration-700 shadow-sm flex items-center justify-center group"
            title="Synchronize Identity Link"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white h-12 px-8 rounded-sm text-[10px] font-black flex items-center gap-4 hover:bg-[#7A578D] transition-all shadow-2xl shadow-black/10 active:scale-95 uppercase tracking-[0.4em] border-b-4 border-black/30 group"
          >
            <UserPlus size={22} className="group-hover:scale-110 transition-transform" />
            <span>RECRUIT_PERSONNEL</span>
          </button>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm relative min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#7A578D]/20" />
          </div>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={users} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="IDENTITY_ARCHIVE_RECRUITMENT"
      >
        <div className="p-2">
           <StaffMemberForm
             authForm={authForm}
             setAuthForm={setAuthForm}
             handleAuthorize={handleAuthorize}
           />
        </div>
      </ManagementModal>
      
      <footer className="pt-20 border-t border-gray-100 flex items-center justify-center gap-12 opacity-30">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Identity integrity confirmed</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap size={18} className="text-gray-400 animate-pulse"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live registrant sync active</span>
         </div>
         <div className="flex items-center gap-3">
            <Info size={18} className="text-gray-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Archival audit mapping 100% Correct</span>
         </div>
      </footer>
    </div>
  );
};

export default UserManagement;
