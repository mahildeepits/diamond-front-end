import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import FrontendLayout from "./Layout/FrontendLayout";
import ScrollToTop from "./utils/ScrollToTop";
import HomePage from "./routes/HomePage/HomePage";
import UpdatesPage from "./routes/Updates/UpdatesPage";
import ClientRoutes from "./routes/ClientsPage/ClientRoutes";
import BankDetailsPage from "./routes/BankDetails/BankDetailsPage";
import ContactDetailsPage from "./routes/ContactDetails/ContactDetailsPage";
import RateDifferencePage from "./routes/RateDifference/RateDifferencePage";
import AdminLoginPage from "./routes/AuthenticationPages/AdminLoginPage/AdminLoginPage";
import UsersRoutes from "./routes/UsersPage/UsersRoutes";
import BookingsRoutes from "./routes/BookingsPage/BookingsRoutes";
import PendingOrdersPage from "./routes/PendingOrders/PendingOrdersPage";
import AllRatesPage from "./routes/AllRatesPage/AllRatesPage";
import IndexRoute from "./routes/FrontendRoutes/IndexRoute";
import { useSelector } from "react-redux";
import AccountRemovePage from "./routes/AccountRemove/AccountRemovePage";
import ContactUsRoute from "./routes/FrontendRoutes/ContactUsRoute";
import AboutUsRoute from "./routes/FrontendRoutes/AboutUsRoute";
import BankDetailsRoute from "./routes/FrontendRoutes/BankDetailsRoute";
import DownloadsRoute from "./routes/FrontendRoutes/DownloadsRoute";
import BookingDeskRoute from './routes/FrontendRoutes/BookingDeskRoute';
import WaConnect from './routes/WaConnectPage';
import EditBookingComponent from './components/BookingsComponents/EditBookingComponent';
import { useParams } from "react-router-dom"
import BookingDatesComponent from './components/BookingsComponents/BookingDatesComponent'
import CoinsRoute from "./routes/FrontendRoutes/CoinsRoute";
import ChatsPage from "./components/ChatsComponents/ChatsPage";
import NewLandingPage from "./components/Frontend/NewLandingPage/NewLandingPage";
import NotificationsPage from "./routes/NotificationsPage/NotificationsPage";
import CoinRatesPage from "./routes/CoinRates/CoinRatesPage";

function App() {
  const user = useSelector((state) => state.CurrentUser.user);

  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={user ? <Layout /> : <FrontendLayout />}>
            {
              user ? (
                <>
                  <Route index element={<HomePage />} />
                  <Route path="/users/*" element={<UsersRoutes />} />
                  <Route path="/updates" element={<UpdatesPage />} />
                  <Route path="/clients/*" element={<ClientRoutes />} />
                  <Route path="/bookings/*" element={<BookingsRoutes />} />
                  <Route path="/bank-details" element={<BankDetailsPage />} />
                  <Route path="/rate-difference" element={<RateDifferencePage />} />
                  <Route path="/contact-details" element={<ContactDetailsPage />} />
                  <Route path="/pending-orders" element={<PendingOrdersPage />} />
                  <Route path="/rates" element={<AllRatesPage />} />
                  {user.is_admin == 1 && <Route path="/wa/connect" element={<WaConnect />} />}
                  {user.is_admin == 1 && <Route path="/coin-management" element={<CoinRatesPage />} />}
                  <Route path="/bookings/edit/:bookingId" element={<EditBookingComponent />} />
                  <Route path="/delivery/charges" element={<BookingDatesComponent />} />
                  <Route path="/chats" element={<ChatsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                </>
              ) : (
                <>
                  <Route index element={<NewLandingPage />} />
                  <Route path="/user/account-removal-request" element={<AccountRemovePage />} />
                  <Route path="/contactus" element={<ContactUsRoute />} />
                  <Route path="/aboutus" element={<AboutUsRoute />} />
                  <Route path="/bankdetails" element={<BankDetailsRoute />} />
                  <Route path="/bookingdesk" element={<BookingDeskRoute />} />
                  <Route path="/download" element={<DownloadsRoute />} />
                  <Route path="/coins" element={<CoinsRoute />} />
                </>
              )
            }
          </Route>
          <Route path="/login" element={<AdminLoginPage />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
}
export default App;
