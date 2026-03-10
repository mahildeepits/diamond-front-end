import dayjs from "dayjs";
import { useEffect, useState, useMemo } from "react";
import Loader from "../../Loader/Loader";
import ErrorComponent from "../../Loader/ErrorComponent";
import { useFetchConsolidateByDateQuery } from "../../../store";
import DataGridComponent from "../../DataGridComponent/DataGridComponent";
export default function ConsolidateByDate() {
  const [consolidateData, setConsolidateData] = useState([]);
  const { data, isLoading, isFetching, error } = useFetchConsolidateByDateQuery();
  useEffect(() => {
    if (data) {
      setConsolidateData(Array.isArray(data.data) ? data.data : (data.data?.data || []));
    }
  }, [data]);
  const columns = [
    {
      field: "booking_date",
      headerName: "Booking Date",
      width: 200,
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const formattedDate = dayjs(params.value).format("DD MMMM YYYY");
        return formattedDate;
      },
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
  const memoizedColumns = useMemo(() => columns, []);
  return (
    <>
      {error ? (
        <ErrorComponent />
      ) : (
        <DataGridComponent rows={consolidateData} columns={memoizedColumns} loading={isLoading || isFetching} />
      )}
    </>
  );
}
