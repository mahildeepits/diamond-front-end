import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Box, Checkbox, IconButton, Tooltip, Button, Typography } from "@mui/material";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import {
  useDeleteBookingMutation,
  useFetchBookingsQuery,
  useUpdateSeenBookingMutation,
} from "../../store";
import Loader from "../Loader/Loader";
import ErrorComponent from "../Loader/ErrorComponent";
import DeleteModal from "../ModalComponent/ModalComponent";
import EditBookingModal from "../ModalComponent/EditBookingModal";
import DataGridComponent from "../DataGridComponent/DataGridComponent";
import { toast } from "react-toastify";
import SearchComponent from "../SearchComponent/SearchComponent";
import ExportDataComponent from "../ExportDataComponent/ExportDataComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import DatesComponent from "../BookingsComponents/DatesComponent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BookingTotalsComponent from "../BookingsComponents/BookingTotalsComponent";
export default function BookingsList() {
  const navigate = useNavigate();
  const activeUser = useSelector((state) => {
    return state.CurrentUser.user;
  });
  const [updateSeen, { isLoading: updatingSeen }] = useUpdateSeenBookingMutation();
  const [deleteBooking, { isLoading: deletingBooking }] =
    useDeleteBookingMutation();
  const [searchText, setSearchText] = useState("");
  const [bookingsData, setBookingData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);
  const [editRow, setEditRow] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  useEffect(() => {
    if (searchParams) {
      handleSearch(searchParams.get("search"));
    }
  }, [])
  const { data, isLoading, isFetching, error } = useFetchBookingsQuery(
    { searchString: searchText, from_date: fromDate, to_date: toDate },
    { refetchOnMountOrArgChange: false }
  );

  useEffect(() => {
    if (data && data.code === 200) {
      setBookingData(Array.isArray(data.data) ? data.data : (data.data?.data || []));
    }
  }, [data, error]);
  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleDelete = (row) => {
    setOpenDelete(true);
    setIdToDelete(row.id);
  };

  const handleEdit = (row) => {
    setOpenEdit(true);
    setEditRow(row);
  };

  const handleDeleteBooking = async () => {
    try {
      const res = await deleteBooking({ id: idToDelete });
      if (res.data.code === 200) {
        toast.success("Booking deleted successfully");
        setOpenDelete(false);
        setIdToDelete(null);
      }
    } catch (error) {
      toast.error("Error while deleting booking");
    }
  };

  const handleMarkAsSeen = async (row) => {
    const updatedSeenValue = row.seen === 1 ? 0 : 1;
    const updateData = {
      values: {
        client_id: row?.client_id || "",
        rate: row?.order?.rate || "",
        quantity: row?.order?.quantity || "",
        total_amount: row?.order?.total_amount || "",
        remarks: row?.remarks || "",
        seen: updatedSeenValue,
        created_by: row?.created_by || "admin",
      },
      id: row?.id || "",
    };
    await updateSeen(updateData);
    toast.success("Booking Seen Updated");
  };
  const handleFromDateChange = (date) => {
    setFromDate(date ? dayjs(date).format("YYYY-MM-DD") : null);
  };

  const handleRowClick = (client_id) => {
    if (client_id) {
      setSearchText(client_id);
    }
  };
  const handleToDateChange = (date) => {
    setToDate(date ? dayjs(date).format("YYYY-MM-DD") : null);
  };
  const handleExports = async (type) => {
    let urlApi = `/admin/bookings?export=${type}&search=${searchText || ""}`;
    if (fromDate) {
      urlApi += `&from_date=${fromDate}`;
    }
    if (toDate) {
      urlApi += `&to_date=${toDate}`;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}${urlApi}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch export URL");

      if (type === "pdf") {
        // Handle PDF (API returns a URL in JSON response)
        const data = await response.json();
        if (data.url) {
          let localUrl = data.url;
          let pdfUrl = data.url.split('/storage');
          let liveUrl = pdfUrl[0] + '/Backend/public/storage' + pdfUrl[1];
          window.open((import.meta.env.VITE_IS_PRODUCTION == 'true') ? liveUrl : localUrl, "_blank");
        } else {
          console.error("PDF URL not found in response.");
        }
      } else {
        // Handle Excel/CSV (API directly returns the file)
        const blob = await response.blob();
        const fileExtension = type === "excel" ? "xlsx" : "csv";

        // Create a download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `exported_bookings.${fileExtension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };
  const columns = [
    {
      field: "o_number",
      headerName: "O.No",
      width: 200,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
          {/* <Checkbox
            disabled={updatingSeen}
            size="small"
            checked={params.row.seen !== 0}
            onChange={() => handleMarkAsSeen(params.row)}
          /> */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <strong>{params?.row?.id || 'N/A'}</strong>
            <p style={{ margin: 0, fontSize: "12px" }}>
              Created by: <strong style={{ textTransform: "capitalize" }}>{params?.row?.created_by?.name || 'N/A'}</strong>
            </p>
            {/* <p style={{ margin: 0, fontSize: "12px" }}>
              Is Pending Order: <strong style={{ textTransform: "capitalize" }}>{params?.row?.is_pending_order ? 'yes' : 'no'}</strong>
            </p> */}
          </div>

        </div>
      ),
    },
    {
      field: "client",
      headerName: "Client",
      width: 200,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div>
          <div><Box sx={{ cursor: "pointer", textDecoration: "underline", color: "blue" }} onClick={() => handleRowClick(params.row.client.client_id)}>{params.row.client.name}</Box></div>
          <div>{params.row.client.mobile}</div>
        </div>
      ),
    },
    {
      field: "order",
      headerName: "Order",
      width: 170,
      flex: 1,
      minWidth: 170,
      renderCell: (params) => {
        const { quantity, rate, total_amount } = params.value;
        const metal = params?.row?.type || 'gold';
        const isCoin = !!params?.row?.coin_id;
        const coinName = params?.row?.coin_name;
        const coinGrams = params?.row?.coin_grams;

        return (
          <div>
            <Box sx={{
              display: 'flex',
              gap: 0.5,
              mb: 0.5,
              alignItems: 'center'
            }}>
              <Box sx={{
                display: 'inline-block',
                px: 1,
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: metal === 'gold' ? '#FFD700' : (metal === 'retail_gold' ? '#FFAC33' : '#C0C0C0'),
                color: '#000'
              }}>
                {metal === 'retail_gold' ? 'Retail Gold' : metal}
              </Box>
              {isCoin && (
                <Box sx={{
                  display: 'inline-block',
                  px: 1,
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backgroundColor: '#000',
                  color: '#FFD700',
                  border: '1px solid #FFD700'
                }}>
                  COIN
                </Box>
              )}
            </Box>
            
            {isCoin && (
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#af9560', marginBottom: '4px' }}>
                {coinName} ({coinGrams}g)
              </div>
            )}

            <div>{isCoin ? 'Units' : 'Quantity'}: <strong>{quantity || 0}</strong></div>
            <div>Rate: <strong>{rate || 0}</strong></div>
            <div>Amount: <strong>{total_amount || 0}</strong></div>
          </div>
        );
      },
    },
    {
      field: "delivery_date",
      headerName: "Delivery Date and Charges",
      width: 200,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div>
          <div>{dayjs(params?.row?.delivery_date).format("DD/MM/YYYY") || 'N/A'}</div>
          <div>₹ {params?.row?.delivery_charges || 'N/A'}</div>
        </div>
      ),
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 100,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 120,
      minWidth: 120,
      flex: 1,
      valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <>
          {
            activeUser.is_admin == 1 &&
            <Box>
              {/* <Tooltip title="Edit" arrow>
                <Button onClick={() => navigate(`/bookings/edit/${params.row.id}`)}><EditRounded sx={{ color: "green" }} /></Button>
              </Tooltip> */}
              <Tooltip title="Delete" arrow>
                <IconButton onClick={() => handleDelete(params.row)}>
                  <DeleteRounded sx={{ color: "red" }} />
                </IconButton>
              </Tooltip>
            </Box>
          }
        </>
      ),
    },
  ];

  const memoizedColumns = useMemo(() => columns, [activeUser, updatingSeen]);

  return (
    <>
      {error ? (
        <ErrorComponent />
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", gap: "10px", flexDirection: { xs: "column", sm: "row" }, paddingBottom: "10px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", flexDirection: { xs: "column", sm: "row" } }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate ? dayjs(fromDate) : null}
                  onChange={handleFromDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: 'small' } }}
                  sx={{
                    width: '100%', backgroundColor: "white", borderRadius: "5px",
                    "& .MuiOutlinedInput-root": { borderRadius: "5px" },
                    "& .MuiInputBase-input": { color: "black", fontSize: "14px" },
                    "& .MuiInputLabel-root": { color: "black", fontSize: "14px" }
                  }}
                />
                <DatePicker
                  label="To Date"
                  value={toDate ? dayjs(toDate) : null}
                  onChange={handleToDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: 'small' } }}
                  sx={{
                    width: '100%', backgroundColor: "white", borderRadius: "5px",
                    "& .MuiOutlinedInput-root": { borderRadius: "5px" },
                    "& .MuiInputBase-input": { color: "black", fontSize: "14px" },
                    "& .MuiInputLabel-root": { color: "black", fontSize: "14px" }
                  }}
                />
              </LocalizationProvider>

            </Box>
            <SearchComponent handleChange={handleSearch} searchValue={searchText} />
            <ExportDataComponent handleClickExport={handleExports} />
          </Box>
          {/* Mobile-Style Card List Replacing DataGrid */}
          {isLoading || isFetching ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><Loader /></Box>
          ) : (
             <Box sx={{ 
                width: "100%",
                mt: 1 
             }}>
                 {bookingsData.length === 0 ? (
                    <Typography sx={{ color: "text.primary", textAlign: "center", py: 4 }}>No Bookings Found</Typography>
                 ) : (
                    bookingsData.map((row) => {
                       const metal = row.type === 'retail_gold' ? 'Retail Gold' : (row.type === 'silver' ? 'Silver' : 'Gold');
                       const isCoin = !!row.coin_id;
                       
                       return (
                          <Box key={row.id} sx={{
                              backgroundColor: "#ffffff",
                              borderRadius: "10px",
                              p: 2,
                              display: "flex",
                              justifyContent: "space-between",
                              color: "#000000",
                              mb: 1.5,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              border: "1px solid #e0e0e0"
                          }}>
                              {/* Left Date Section */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minWidth: '65px', pt: 0.5 }}>
                                  <Typography sx={{ fontSize: '22px', fontWeight: 'bold', lineHeight: 1 }}>{dayjs(row.created_at).format('D')}</Typography>
                                  <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{dayjs(row.created_at).format('MMM')}</Typography>
                                  <Typography sx={{ fontSize: '11px', color: '#666666', mt: 0.5 }}>{dayjs(row.created_at).format('h:mm A')}</Typography>
                              </Box>

                              {/* Center Client Details Section */}
                              <Box sx={{ flex: 1, px: 1.5, borderLeft: '1px solid #e0e0e0', ml: 1 }}>
                                  <Typography 
                                    sx={{ fontWeight: 'bold', fontSize: '16px', color: "#000", cursor: "pointer", transition: "color 0.2s", "&:hover": { color: "#4f46e5" } }} 
                                    onClick={() => handleRowClick(row.client?.client_id)}
                                  >
                                    {row.client?.name?.length > 15 ? row.client?.name?.substring(0, 15) + '...' : row.client?.name || "Unknown"}
                                  </Typography>
                                  <Typography sx={{ fontSize: '13px', color: '#555555', mb: 1, mt: 0.5 }}>{row.client?.mobile || "N/A"}</Typography>
                                  
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                                      <Box sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 0.5,
                                          backgroundColor: '#f5f5f5',
                                          borderRadius: '15px',
                                          border: '1px solid #ddd',
                                          px: 1.2,
                                          py: 0.3
                                      }}>
                                          <span style={{ fontSize: "14px" }}>🪙</span> 
                                          <Typography sx={{ fontSize: '12px', color: '#333', fontWeight: "bold" }}>
                                              {metal}
                                          </Typography>
                                      </Box>
                                      {isCoin && (
                                        <Box sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          backgroundColor: '#fff',
                                          borderRadius: '15px',
                                          border: '1px solid #FFD700',
                                          px: 1.2,
                                          py: 0.3
                                        }}>
                                          <Typography sx={{ fontSize: '12px', color: '#b8860b', fontWeight: 'bold' }}>COIN</Typography>
                                        </Box>
                                      )}
                                  </Box>
                                  {isCoin && (
                                      <Typography sx={{ fontSize: '11px', color: '#8b6914', mt: 1, fontWeight: '500' }}>
                                          {row.coin_name} ({row.coin_grams}g)
                                      </Typography>
                                  )}
                              </Box>

                              {/* Right Order Details Section */}
                              <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", minWidth: '95px' }}>
                                  <Typography sx={{ fontSize: '13px', color: '#333' }}>{row.order?.quantity || 0} {isCoin ? 'Units' : 'G'}</Typography>
                                  <Typography sx={{ fontSize: '12px', color: '#666', mt: 0.5 }}>× ₹{(Number(row.order?.rate) || 0).toLocaleString('en-IN')}</Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" rx="3" ry="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                      <Typography sx={{ fontSize: '12px', color: '#666' }}>₹{row.delivery_charges || 0}</Typography>
                                  </Box>
                                  <Box sx={{ borderTop: "1px solid #e0e0e0", mt: 1, pt: 1 }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: "#000" }}>₹{(Number(row.order?.total_amount) || 0).toLocaleString('en-IN')}</Typography>
                                  </Box>
                              </Box>
                              
                              {/* Action Section (Delete) */}
                              {activeUser.is_admin === 1 && (
                                  <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                                      <IconButton size="small" onClick={() => handleDelete(row)} sx={{ 
                                          color: "rgba(0, 0, 0, 0.4)", 
                                          padding: "4px",
                                          "&:hover": { color: "#ff4d4d", backgroundColor: "rgba(255,77,77,0.1)" } 
                                      }}>
                                          <DeleteRounded sx={{ fontSize: "18px" }} />
                                      </IconButton>
                                  </Box>
                              )}
                          </Box>
                       );
                    })
                 )}
             </Box>
          )}

          {!isLoading && !isFetching && !error && bookingsData.length > 0 && (
            <Box sx={{ backgroundColor: "#5148F0", p: 1.5, borderRadius: "5px", mt: 1, color: "white", display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Total Amount: ₹{bookingsData.reduce((sum, b) => sum + (parseFloat(b.order?.total_amount) || 0), 0).toLocaleString('en-IN')}</Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Total Quantity: {bookingsData.reduce((sum, b) => sum + (parseFloat(b.order?.quantity) || 0), 0).toLocaleString('en-IN', {minimumFractionDigits: 3, maximumFractionDigits: 3})}</Typography>
            </Box>
          )}
        </>
      )}
      {openDelete && <DeleteModal open={openDelete} setOpen={setOpenDelete} variant="booking" deleteFunc={handleDeleteBooking} loading={deletingBooking} />}
      {/* {openEdit && <EditBookingModal open={openEdit} setOpen={setOpenEdit} editData={editRow} />} */}

    </>
  );
}
