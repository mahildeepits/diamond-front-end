import Loader from "../../Loader/Loader";
import { useEffect, useState, useMemo } from "react";
import ErrorComponent from "../../Loader/ErrorComponent";
import { useFetchConsolidateByTotalQuery } from "../../../store";
import DataGridComponent from "../../DataGridComponent/DataGridComponent";
export default function TotalBooking() {
  const [consolidateData, setConsolidateData] = useState([]);
  const { data, isLoading, isFetching, error } = useFetchConsolidateByTotalQuery();

  useEffect(() => {
    if (data) {
      setConsolidateData(Array.isArray(data.data) ? data.data : (data.data?.data || []));
    }
  }, [data]);
  const columns = [
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
        <DataGridComponent columns={memoizedColumns} rows={consolidateData} loading={isLoading || isFetching} />
      )}
    </>
  );
}
