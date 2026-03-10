import { Route, Routes } from "react-router";
import ClientsPage from "./ClientsPage";
import AddClientsPage from "./AddClientsPage";

export default function UpdatesRoutes() {
  return (
    <Routes>
      <Route index element={<ClientsPage />} />
      <Route path="/add" element={<AddClientsPage />} />
    </Routes>
  );
}
