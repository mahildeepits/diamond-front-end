import { Route, Routes } from "react-router";
import ClientsPage from "./ClientsPage";
import AddClientsPage from "./AddClientsPage";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route index element={<ClientsPage />} />
      <Route path="/add" element={<AddClientsPage />} />
      <Route path="/edit" element={<AddClientsPage />} />
    </Routes>
  );
}
