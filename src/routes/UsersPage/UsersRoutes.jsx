import { Route, Routes } from "react-router";
import UsersPage from "./UsersPage";
import AddUsersPage from "./AddUsersPage";

export default function UsersRoutes() {
  return (
    <Routes>
      <Route index element={<UsersPage />} />
      <Route path="/add" element={<AddUsersPage />} />
      <Route path="/edit" element={<AddUsersPage />} />
    </Routes>
  );
}
