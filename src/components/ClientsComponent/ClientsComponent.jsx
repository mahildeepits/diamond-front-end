/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { Box, IconButton, Tooltip, Switch, Typography } from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Loader from "../Loader/Loader";
import { AdminAPI } from "../../store/apis/AdminAPI";
import ErrorComponent from "../Loader/ErrorComponent";
import DeleteModal from "../ModalComponent/ModalComponent";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import DataGridComponent from "../DataGridComponent/DataGridComponent";
import { useDeleteClientsMutation, useFetchClientsQuery, useChangeUserStatusMutation } from "../../store";
import SearchComponent from "../SearchComponent/SearchComponent";
export default function ClientsComponent({ isSubAdmin }) {
  const dispatch = useDispatch();
  const [clientData, setClientData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUser, { isLoading: deletingUser }] = useDeleteClientsMutation();
  const [changeUserStatus] = useChangeUserStatusMutation();
  const navigate = useNavigate();
  const handleEdit = (row) => {
    navigate("edit", {
      state: {
        data: row,
      },
    });
  };
  const [idToDelete, setIdToDelete] = useState("");
  const handleDelete = (row) => {
    setOpenDelete(true);
    setIdToDelete(row.id);
  };
  const handleDeleteUser = async () => {
    try {
      const res = await deleteUser({ id: idToDelete });
      if (res.data.code) {
        toast.success("User deleted successfully");
        dispatch(AdminAPI.util.resetApiState());
        setOpenDelete(false);
      }
    } catch (error) {
      console.log("🚀 ~ handleDeleteUser ~ error:", error);
      toast.error("Error while deleting user");
    }
  };

  const handleStatusChange = async (row) => {
    try {
      const res = await changeUserStatus({ id: row.id });
      if (res.data.status) {
        toast.success("User status updated successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleStatusChange ~ error:", error);
      toast.error("Error updating user status");
    }
  };
  const columns = [
    { field: "name", headerName: "Name", width: 200, flex: 1, minWidth: 130 },
    { field: "email", headerName: "Email", width: 200, flex: 1, minWidth: 150 },
    {
      field: "mobile",
      headerName: "Phone",
      width: 150,
      flex: 1,
      minWidth: 130,
    },
    // {
    //   field: "gender",
    //   headerName: "Gender",
    //   width: 100,
    //   flex: 1,
    //   minWidth: 100,
    // },
    // {
    //   field: "opted_for",
    //   headerName: "Opted for",
    //   width: 70,
    //   flex: 1,
    //   minWidth: 70,
    // },
    {
      field: "limit",
      headerName: "Gold Limit",
      width: 150,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Limit: {params.row.limit || 0}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Balance: {params.row.balance ?? 0}</Typography>
          </Box>
        );
      }
    },
    {
      field: "silver_limit",
      headerName: "Silver Limit",
      width: 150,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Limit: {params.row.silver_limit || 0}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Balance: {params.row.silver_balance ?? 0}</Typography>
          </Box>
        );
      }
    },
    {
      field: "retail_gold_limit",
      headerName: "Retail Gold Limit",
      width: 150,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Limit: {params.row.retail_gold_limit || 0}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Balance: {params.row.retail_gold_balance ?? 0}</Typography>
          </Box>
        );
      }
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 150,
      minWidth: 150,
      flex: 1,  
      valueFormatter: (params) => {
        return dayjs(params).format("DD/MM/YYYY");
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row.status === 1}
            onChange={() => handleStatusChange(params.row)}
            color="primary"
          />
        );
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
            <Tooltip title="Edit" arrow>
              <IconButton
                disabled={isSubAdmin}
                sx={{ color: "green" }}
                onClick={() => handleEdit(params.row)}
              >
                <EditRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                disabled={isSubAdmin}
                sx={{ color: "red" }}
                onClick={() => handleDelete(params.row)}
              >
                <DeleteRounded />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];
  const [searchText, setSearchText] = useState("");
  const { data, isLoading, isFetching, error } = useFetchClientsQuery(
    {
      searchText: searchText,
    },
    { refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    if (data) {
      if (data.code == 200) {
        setClientData(Array.isArray(data.data) ? data.data : (data.data?.data || []));
      }
    }
  }, [data]);
  const handleSearch = (text) => {
    setSearchText(text);
  };

  const memoizedColumns = useMemo(() => columns, [isSubAdmin, deleteUser, changeUserStatus]);

  return (
    <>
      {error ? (
        <ErrorComponent />
      ) : (
        <>
          <SearchComponent handleChange={handleSearch} />
          <DataGridComponent
            rows={clientData}
            columns={memoizedColumns}
            applyHeight={true}
            loading={isLoading || isFetching}
          />
        </>
      )}
      {openDelete ? (
        <DeleteModal
          open={openDelete}
          setOpen={setOpenDelete}
          variant="user"
          deleteFunc={handleDeleteUser}
          loading={deletingUser}
        />
      ) : null}
    </>
  );
}
