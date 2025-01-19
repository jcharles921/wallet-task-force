import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

interface DataGridComponentProps {
  columns: GridColDef[];
  rows: any[];
  height?: number;
}

const Table: React.FC<DataGridComponentProps> = ({
  columns,
  rows,
  height = 400,
}) => {
  return (
    <Box sx={{ height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableColumnMenu
        sx={{
          '& .MuiDataGrid-cell--textRight': {
            justifyContent: 'flex-end',
            display: 'flex',
          },
          '& .MuiDataGrid-cell--error': {
            color: 'error.main',
          },
          '& .MuiDataGrid-cell--success': {
            color: 'success.main',
          },
          '& .MuiDataGrid-cell':{
            display: 'flex',
            alignItems: 'center',
          }

        }}
      />
    </Box>
  );
};

export { Table };