/* eslint-disable react/prop-types */
import { styled } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}`]: {
    backgroundColor: "white",
    color: "black",
  },
  "& .MuiDataGrid-sortIcon": {
    opacity: 1,
    color: "white",
  },
  "& .MuiDataGrid-menuIconButton": {
    opacity: 1,
    color: "white",
  },
  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
  {
    display: "none",
  },
}));

export default function DataGridComponent({
  rows,
  columns,
  data,
  applyHeight,
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  loading,
}) {
  console.log(rows);

  return (
    <div
      style={{
        height: applyHeight ? "calc(100vh - 220px)" : "100%",
        width: "100%",
      }}
    >
      <StripedDataGrid
        getRowHeight={() => (applyHeight ? "auto" : 52)}
        checkboxSelection={false}
        disableRowSelectionOnClick
        loading={loading}
        sx={{
          backgroundColor: "white",
          color: "black",
          "& .MuiDataGrid-columnHeader": { backgroundColor: "black", color: "white" },
          "& .MuiDataGrid-row:hover": { cursor: "pointer", backgroundColor: "#f5f5f5" },
          "& .MuiDataGrid-cell": { color: "black" },
          "& .MuiDataGrid-footerContainer": { color: "black" },
          "& .MuiTablePagination-root": { color: "black" },
        }}
        rows={rows || []}
        columns={columns || []}
        getRowId={(row) => row.id || row.booking_date || row.client_id || 1}
      />
    </div>
  );
}
