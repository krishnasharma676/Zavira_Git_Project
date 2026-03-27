import { createTheme } from '@mui/material/styles';

export const getMuiTheme = () => createTheme({
  typography: {
    fontFamily: '"Times New Roman", Times, serif',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '6px 12px',
          fontSize: '11px',
          borderBottom: '1px solid #eee',
          whiteSpace: 'nowrap',
          width: 'auto',
          fontFamily: '"Times New Roman", Times, serif',
        },
        head: {
          backgroundColor: '#fff',
          fontWeight: 'bold',
          color: '#000',
          padding: '8px 12px',
          fontSize: '11px',
          textTransform: 'uppercase',
        }
      }
    },
    // @ts-ignore
    MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          minHeight: '40px',
          padding: '0 8px',
        },
      },
    },
    // @ts-ignore
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          fontSize: '11px',
          fontWeight: 'bold',
          padding: '8px 12px',
          backgroundColor: '#fff',
          borderBottom: '2px solid #ddd',
          color: '#000',
        },
        data: {
          fontSize: '11px',
          fontWeight: 'bold',
        },
      },
    },
    // @ts-ignore
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: '11px',
          padding: '6px 12px',
          color: '#333',
        },
      },
    },
    // @ts-ignore
    MUIDataTableBodyRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f5f5f5 !important',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: '11px',
          minHeight: '36px',
        },
        toolbar: {
          minHeight: '36px',
        },
        selectLabel: {
          fontSize: '11px',
        },
        displayedRows: {
          fontSize: '11px',
        },
      },
    },
  },
});
