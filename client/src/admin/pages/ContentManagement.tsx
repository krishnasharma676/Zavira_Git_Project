
import { useState } from 'react';
import { Edit2, ExternalLink, Globe, Database } from 'lucide-react';
import ManagementModal from '../components/ManagementModal';
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../utils/muiTableTheme';

const ContentManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  const pages = [
    { title: 'Home Page', path: '/', lastUpdated: '2 hours ago', status: 'Live' },
    { title: 'About Us', path: '/about', lastUpdated: '1 day ago', status: 'Live' },
    { title: 'Shipping Policy', path: '/shipping', lastUpdated: '3 days ago', status: 'Live' },
    { title: 'Privacy Policy', path: '/privacy', lastUpdated: '1 week ago', status: 'Live' },
    { title: 'Returns & Exchange', path: '/returns', lastUpdated: '1 month ago', status: 'Live' },
    { title: 'Terms & Conditions', path: '/terms', lastUpdated: '2 months ago', status: 'Live' },
  ];

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setIsModalOpen(true);
  };




  const columns = [
    { 
      name: "title", 
      label: "Page Name",
      options: {
        customBodyRender: (val: string, meta: any) => (
          <div className="flex flex-col">
             <span>{val}</span>
             <span className="text-[8px] text-gray-400 lowercase tracking-widest">{pages[meta.rowIndex].path}</span>
          </div>
        )
      }
    },
    { 
      name: "status", 
      label: "Status",
      options: {
        customBodyRender: (val: string) => (
          <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-[8px] border border-green-100">{val}</span>
        )
      }
    },
    { name: "lastUpdated", label: "Updated" },
    {
      name: "path",
      label: "Actions",
      options: {
        customBodyRender: (val: string, meta: any) => {
          const page = pages[meta.rowIndex];
          return (
            <div className="flex space-x-2">
              <button 
                onClick={() => window.open(val, '_blank')}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-400 transition-colors"
                title="View Page"
              >
                <ExternalLink size={12} />
              </button>
              <button 
                onClick={() => handleEdit(page)} 
                className="p-1.5 hover:bg-[#7A578D]/10 text-[#7A578D] rounded transition-colors"
                title="Edit Content"
              >
                <Edit2 size={12} />
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
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Pages</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Manage website content</p>
        </div>
        <button className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-[#7A578D] transition-all flex items-center space-x-2">
          <Globe size={12} />
          <span>SEO Registry</span>
        </button>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable title="" data={pages} columns={columns} options={options} />
        </ThemeProvider>
      </div>

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Edit: ${editingPage?.title}`}
      >
        <div className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                <input type="text" defaultValue={editingPage?.title} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none focus:border-[#7A578D] text-[11px] font-black uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Path</label>
                <input type="text" readOnly defaultValue={editingPage?.path} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-3 outline-none text-[10px] font-black tracking-widest text-gray-400" />
              </div>
           </div>
           
           <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Page Content</label>
              <textarea 
                rows={8}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg outline-none text-[11px] font-black uppercase tracking-tight leading-relaxed text-gray-700 resize-none"
                defaultValue={`Curating only the finest items for our community...`}
              />
           </div>

           <div className="p-3 bg-gray-50 border border-gray-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                 <Database size={12} className="text-[#7A578D]" />
                 <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-900">SEO Metadata</h4>
              </div>
              <textarea 
                rows={2} 
                className="w-full bg-white border border-gray-100 rounded-lg p-3 outline-none focus:border-[#7A578D] text-[10px] text-gray-500 tracking-tight leading-relaxed italic" 
                placeholder="Meta description..."
              />
           </div>

           <button className="w-full bg-[#7A578D] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
              Save Changes
           </button>
        </div>
      </ManagementModal>
    </div>
  );
};

export default ContentManagement;
