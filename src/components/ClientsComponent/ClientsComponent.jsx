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
          {/* Custom Card List Replaces DataGrid */}
          {isLoading || isFetching ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><Loader /></Box>
          ) : (
            <Box sx={{ width: "100%", mt: 2 }}>
                {clientData.length === 0 ? (
                    <Typography sx={{ color: "text.primary", textAlign: "center", py: 4 }}>No Users Found</Typography>
                ) : (
                    clientData.map((row) => (
                        <Box key={row.id} sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            color: "#000000",
                            mb: 1.5,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            border: "1px solid #e0e0e0"
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', bgcolor: '#f5f5f5', borderRadius: '8px', mr: 2, border: '1px solid #ddd' }}>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>
                                            {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: "#000" }}>{row.name || "Unknown User"}</Typography>
                                        <Typography sx={{ fontSize: '13px', color: '#555555' }}>{row.mobile || "N/A"}</Typography>
                                        <Typography sx={{ fontSize: '12px', color: '#777777' }}>{row.email || "No Email"}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Switch
                                      checked={row.status === 1}
                                      onChange={() => handleStatusChange(row)}
                                      color="primary"
                                      size="small"
                                    />
                                    <Typography sx={{ fontSize: '11px', color: '#888', mt: 0.5 }}>
                                        {dayjs(row.created_at).format('DD MMM YYYY')}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                                <Box sx={{ flex: '1 1 30%', minWidth: '100px', bgcolor: '#fff8e1', p: 1, borderRadius: '5px', border: '1px solid #ffe082' }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: '#b28900', mb: 0.5, textAlign: "center" }}>GOLD</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                       <Typography sx={{ fontSize: '11px', color: '#555' }}>Limit:</Typography>
                                       <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>{row.limit || 0}</Typography>
                                    </Box>
                                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                       <Typography sx={{ fontSize: '11px', color: '#555' }}>Bal:</Typography>
                                       <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>{row.balance || 0}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ flex: '1 1 30%', minWidth: '100px', bgcolor: '#f5f5f5', p: 1, borderRadius: '5px', border: '1px solid #e0e0e0' }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: '#666', mb: 0.5, textAlign: "center" }}>SILVER</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                       <Typography sx={{ fontSize: '11px', color: '#555' }}>Limit:</Typography>
                                       <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>{row.silver_limit || 0}</Typography>
                                    </Box>
                                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                       <Typography sx={{ fontSize: '11px', color: '#555' }}>Bal:</Typography>
                                       <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>{row.silver_balance || 0}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ flex: '1 1 30%', minWidth: '100px', bgcolor: '#fff3e0', p: 1, borderRadius: '5px', border: '1px solid #ffcc80' }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: '#e65100', mb: 0.5, textAlign: "center" }}>RETAIL GOLD</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                       <Typography sx={{ fontSize: '11px', color: '#555' }}>Limit:</Typography>
                                       <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>{row.retail_gold_limit || 0}</Typography>
                                    </Box>
                                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                       <Typography sx={{ fontSize: '11px', color: '#555' }}>Bal:</Typography>
                                       <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>{row.retail_gold_balance || 0}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Actions */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1, pt: 1, borderTop: "1px solid #f0f0f0" }}>
                                <Tooltip title="Edit" arrow>
                                    <IconButton size="small" onClick={() => handleEdit(row)} disabled={isSubAdmin} sx={{ 
                                        color: "rgba(0, 128, 0, 0.6)", 
                                        padding: "4px",
                                        "&:hover": { color: "green", backgroundColor: "rgba(0,128,0,0.1)" } 
                                    }}>
                                        <EditRounded sx={{ fontSize: "18px" }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" arrow>
                                    <IconButton size="small" onClick={() => handleDelete(row)} disabled={isSubAdmin} sx={{ 
                                        color: "rgba(255, 0, 0, 0.6)", 
                                        padding: "4px",
                                        "&:hover": { color: "#ff4d4d", backgroundColor: "rgba(255,77,77,0.1)" } 
                                    }}>
                                        <DeleteRounded sx={{ fontSize: "18px" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
          )}
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
