import { createTheme } from '@mui/material/styles';

export const getMuiTheme = () => createTheme({
  components: {
    // @ts-ignore – mui-datatables components not typed in MUI5
    MUIDataTableToolbar: {
      styleOverrides: {
        root: {
          minHeight: '36px',
          padding: '0 8px',
        },
      },
    },
    // @ts-ignore
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          fontSize: '8px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '5px 10px',
          whiteSpace: 'nowrap',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #f3f4f6',
        },
        data: {
          fontSize: '8px',
          fontWeight: '900',
        },
        sortAction: {
          fontSize: '8px',
        },
      },
    },
    // @ts-ignore
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontSize: '9px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          padding: '3px 10px',
          borderBottom: '1px solid #f9fafb',
          lineHeight: '1.2',
          height: '32px',
          maxHeight: '32px',
          overflow: 'hidden',
        },
      },
    },
    // @ts-ignore
    MUIDataTableBodyRow: {
      styleOverrides: {
        root: {
          height: '32px',
          '&:hover': {
            backgroundColor: '#fafafa !important',
          },
        },
      },
    },
    // @ts-ignore
    MUIDataTableFooter: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #f3f4f6',
        },
      },
    },
    // @ts-ignore
    MUIDataTablePagination: {
      styleOverrides: {
        root: {
          padding: '0px',
        },
        tableCellContainer: {
          padding: '0 8px',
        },
      },
    },
    // @ts-ignore
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: '9px',
        },
        selectLabel: {
          fontSize: '9px',
          fontWeight: '700',
        },
        displayedRows: {
          fontSize: '9px',
          fontWeight: '700',
        },
      },
    },
  },
});
