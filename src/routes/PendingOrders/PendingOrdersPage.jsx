import { useEffect, useState, useMemo } from "react";
import {
  useDeletePendingOrdersMutation,
  useFetchPendingOrdersQuery,
} from "../../store";
import { Box, Container, IconButton, Tooltip, Typography } from "@mui/material";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent/BreadcrumbsComponent";
import Loader from "../../components/Loader/Loader";
import ErrorComponent from "../../components/Loader/ErrorComponent";
import DataGridComponent from "../../components/DataGridComponent/DataGridComponent";
import { DeleteRounded } from "@mui/icons-material";
import dayjs from "dayjs";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import DeleteModal from "../../components/ModalComponent/ModalComponent";
import { toast } from "react-toastify";

export default function PendingOrdersPage() {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading, isFetching, error } = useFetchPendingOrdersQuery(
    {
      searchText: searchText,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteOrder, { isLoading: deletingOrders }] =
    useDeletePendingOrdersMutation();
  const [pendingOrders, setPendingOrders] = useState([]);
  const handleSearch = (text) => {
    setSearchText(text);
  };
  const [idToDelete, setIdToDelete] = useState("");
  const handleDelete = (row) => {
    setOpenDelete(true);
    setIdToDelete(row.id);
  };
  const handleDeleteUser = async () => {
    try {
      const res = await deleteOrder({ id: idToDelete });
      if (res.data.code) {
        toast.success("User deleted successfully");
        setOpenDelete(false);
      }
    } catch (error) {
      console.log("🚀 ~ handleDeleteUser ~ error:", error);
      toast.error("Error while deleting order");
    }
  };
  const columns = [
    {
      field: "client",
      headerName: "Client",
      width: 200,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div>
            <Typography>{params.row.client.name}</Typography>
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 200,
      flex: 1,
      minWidth: 130,
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 200,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "total_amount",
      headerName: "Amount",
      width: 150,
      flex: 1,
      minWidth: 130,
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 150,
      minWidth: 150,
      flex: 1,
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD/MM/YYYY");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Delete" arrow>
              <IconButton onClick={() => handleDelete(params.row)}>
                <DeleteRounded sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    if (data) {
      if (data.code == 200) {
        setPendingOrders(Array.isArray(data.data) ? data.data : (data.data?.data || []));
      }
    }
  }, [data, error]);
  const memoizedColumns = useMemo(() => columns, [deleteOrder]);
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[<Typography key={1}>Contact Details</Typography>]}
        />
      </Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">Manage pending orders</Typography>
      </Box>
      {error ? (
        <ErrorComponent />
      ) : (
        <>
          <SearchComponent handleChange={handleSearch} />
          <DataGridComponent rows={pendingOrders} columns={memoizedColumns} loading={isLoading || isFetching} />
        </>
      )}
      {openDelete ? (
        <DeleteModal
          open={openDelete}
          setOpen={setOpenDelete}
          deleteFunc={handleDeleteUser}
          loading={deletingOrders}
        />
      ) : null}
    </Container>
  );
}
