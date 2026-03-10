import { Route, Routes } from "react-router";
import BookingsPage from "./BookingsPage";
import BookingStatusPage from "./BookingStatusPage";
import BookingConsolidatePage from "./BookingConsolidatePage";
import ConsolidateByClient from "../../components/BookingsComponents/BookingConsolidate/ConsolidateByClient";

export default function BookingsRoutes() {
  return (
    <Routes>
      <Route index element={<BookingsPage />} />
      <Route path="/status" element={<BookingStatusPage />} />
      <Route path="/consolidate" element={<BookingConsolidatePage />} />
      <Route path="/client-wise" element={<ConsolidateByClient />} />
    </Routes>
  );
}
