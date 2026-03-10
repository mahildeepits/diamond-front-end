import { useEffect, useState, useMemo } from "react";
import { useFetchConsolidateByClientQuery } from "../../../store";
import Loader from "../../Loader/Loader";
import ErrorComponent from "../../Loader/ErrorComponent";
import DataGridComponent from "../../DataGridComponent/DataGridComponent";
import SearchComponent from "../../SearchComponent/SearchComponent";
import BreadcrumbsComponent from "../../BreadcrumbsComponent/BreadcrumbsComponent";
import BookingTotalsComponent from "../../BookingsComponents/BookingTotalsComponent";
import ExportDataComponent from "../../ExportDataComponent/ExportDataComponent";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
export default function ConsolidateByClient() {
  const navigate = useNavigate();
  const activeUser = useSelector((state) => {
    return state.CurrentUser.user;
  });
  const isAdmin = activeUser.is_admin === 1;
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [consolidateData, setConsolidateData] = useState([]);
  const { data, isLoading, isFetching, error } = useFetchConsolidateByClientQuery(
    { searchText: searchText, from_date: fromDate, to_date: toDate },
    { refetchOnMountOrArgChange: true }
  );
  const handleFromDateChange = (date) => {
    setFromDate(date ? dayjs(date).format("YYYY-MM-DD") : null);
  };
  const handleToDateChange = (date) => {
    setToDate(date ? dayjs(date).format("YYYY-MM-DD") : null);
  };
  useEffect(() => {
    if (data) {
      setConsolidateData(Array.isArray(data.data) ? data.data : (data.data?.data || []));
    }
  }, [data]);
  const handleExports = async (type) => {
    let urlApi = `/admin/bookings/client-wise?export=${type}&search=${searchText || ""}`;
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
          window.open((import.meta.env.VITE_IS_PRODUCTION == 'true') ? liveUrl : localUrl, "_blank"); // Open PDF in new tab
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
      field: "client",
      headerName: "Client",
      width: 200,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div>
          <div><Box sx={{ cursor: "pointer", textDecoration: "underline", color: "blue" }} onClick={() => navigate('/bookings?search=' + params.row.client.client_id + '')}>{params.row.client.name}</Box></div>
          <div>{params.row.client.mobile}</div>
        </div>
      ),
    },
    {
      field: "record_count",
      headerName: "Orders",
      width: 200,
      flex: 1,
      minWidth: 130,
    },
    {
      field: "total_quantity",
      headerName: "Quantity",
      width: 200,
      flex: 1,
      minWidth: 130,
    },
    {
      field: "total_rate",
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
  ];
  const handleSearch = (text) => {
    setSearchText(text);
  };
  const memoizedColumns = useMemo(() => columns, [navigate]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 1 }}>
        <BreadcrumbsComponent
          breadcrumbs={[
            <Link
              style={{ textDecoration: "underline", color: 'white' }}
              to={"/bookings"}
              key={0}
            >
              Bookings
            </Link>,
            <Typography key={1}>Client Wise</Typography>,
          ]}
        />
      </Box>
      {/* <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="pageHeading">Client Wise Bookings</Typography>
      </Box> */}
      {error ? (
        <ErrorComponent />
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", gap: "10px", flexDirection: { xs: "column", sm: "row" }, mb: 2 }}>
            <SearchComponent handleChange={handleSearch} />
            <ExportDataComponent handleClickExport={handleExports} />
          </Box>
          <DataGridComponent rows={consolidateData} columns={memoizedColumns} loading={isLoading || isFetching} applyHeight={true} />
          {!isLoading && !isFetching && !error && (
            <>
              <BookingTotalsComponent bookings={consolidateData} totals_for={"consolidate"} />
            </>
          )}
        </>
      )}
    </Container>
  );
}
