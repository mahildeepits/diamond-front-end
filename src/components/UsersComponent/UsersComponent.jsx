import { useEffect, useState, useMemo } from "react";
import { Box, IconButton, Tooltip, Switch } from "@mui/material";
import Loader from "../Loader/Loader";
import { useDeleteClientsMutation, useFetchSubAdminQuery, useChangeUserStatusMutation } from "../../store";
import DataGridComponent from "../DataGridComponent/DataGridComponent";
import dayjs from "dayjs";
import ErrorComponent from "../Loader/ErrorComponent";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import { useNavigate } from "react-router";
import DeleteModal from "../ModalComponent/ModalComponent";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AdminAPI } from "../../store/apis/AdminAPI";
import SearchComponent from "../SearchComponent/SearchComponent";
import useUserPermissions from "../../utils/useSubAdmin";

export default function UsersComponent() {
  const { isSubAdmin } = useUserPermissions();
  const dispatch = useDispatch();
  const [subAdminData, setSubAdminData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUser, { isLoading: deletingUser }] = useDeleteClientsMutation();
  const [idToDelete, setIdToDelete] = useState("");
  const [changeUserStatus] = useChangeUserStatusMutation();
  const navigate = useNavigate();
  const handleEdit = (row) => {
    navigate("edit", {
      state: {
        data: row,
      },
    });
  };
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
    { field: "name", headerName: "Name", width: 200, minWidth: 130 },
    { field: "email", headerName: "Email", width: 300, minWidth: 150 },
    {
      field: "mobile",
      headerName: "Phone",
      width: 200,

      minWidth: 100,
    },
    // {
    //   field: "gender",
    //   headerName: "Gender",
    //   width: 194,
    //   minWidth: 100,
    // },
    {
      field: "created_at",
      headerName: "Created at",
      width: 200,
      minWidth: 150,

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD/MM/YYYY");
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
  const handleSearch = (text) => {
    setSearchText(text);
  };
  const { data, isLoading, isFetching, error } = useFetchSubAdminQuery(
    { searchText: searchText },
    { refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    if (data) {
      if (data.code == 200) {
        setSubAdminData(Array.isArray(data.data) ? data.data : (data.data?.data || []));
      }
    }
  }, [data]);

  const memoizedColumns = useMemo(() => columns, [isSubAdmin, deleteUser, changeUserStatus]);

  return (
    <Box >
      {error ? (
        <ErrorComponent />
      ) : (
        <>
          <SearchComponent handleChange={handleSearch} />
          <DataGridComponent
            rows={subAdminData}
            columns={memoizedColumns}
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
          paginationMode="server"
          loading={deletingUser}
        />
      ) : null}
    </Box>
  );
}
