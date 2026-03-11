import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { AccountCircleOutlined, DashboardOutlined } from "@mui/icons-material";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ChatIcon from '@mui/icons-material/Chat';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useSelector } from "react-redux";


export const sidebarLinks = () => {
  const userDetails = useSelector((state) => state.CurrentUser.user);
  const isGuest = userDetails == null ? true : false;
  const isAdmin = userDetails?.is_admin === 1 ? true : false;
  const isSubAdmin = userDetails?.is_subadmin === 1 ? true : false;
  const isClient = userDetails?.is_admin === 0 && userDetails?.is_subadmin === 0 ? true : false;

  return [
    {
      id: 0,
      name: "Dashboard",
      icon: <DashboardOutlined className="sideIcon" />,
      href: "/",
      show: true
    },
    {
      id: 1,
      name: "Rate Differences",
      icon: <TrendingUpIcon className="sideIcon" />,
      href: "/rate-difference",
      text: "Track real-time rate changes across stocks and forex.",
      show: (!isGuest && isAdmin)
    },
    {
      id: 2,
      name: "Bank Details",
      icon: <AccountBalanceOutlinedIcon className="sideIcon" />,
      href: "/bank-details",
      text: "Manage bank information for transactions.",
      show: (!isGuest)
    },
    // {
    //   id: 3,
    //   name: "Users",
    //   icon: <AccountCircleOutlined className="sideIcon" />,
    //   href: "/users",
    //   text: "Manage your sub admins.",
    //   auth: true
    // },

    {
      id: 5,
      name: "Contact Details",
      icon: <ContactPhoneOutlinedIcon className="sideIcon" />,
      href: "/contact-details",
      text: "Update your contact information.",
      show: (!isGuest)
    },
    {
      id: 4,
      name: "Updates",
      icon: <CampaignOutlinedIcon className="sideIcon" />,
      href: "/updates",
      text: "Latest news and updates from the stock market.",

      show: (!isGuest)
    },
    {
      id: 6,
      name: "Users",
      icon: <AccountCircleOutlined className="sideIcon" />,
      href: "/clients",
      text: "Manage and view client details.",
      show: (!isGuest && (isAdmin || isSubAdmin)),
    },
    {
      id: 7,
      name: "Bookings",
      icon: <FormatListBulletedOutlinedIcon className="sideIcon" />,
      href: "/bookings",
      text: "Track and manage all your trading bookings.",
      show: (isClient || isAdmin || isSubAdmin)
    },
    // {
    //   id: 8,
    //   name: "Client Wise",
    //   icon: <GroupWorkOutlinedIcon className="sideIcon" />,
    //   href: "/bookings/client-wise",
    //   text: "Track all your client Wise trading bookings.",
    //   show: (isClient || isAdmin || isSubAdmin)
    // },
    {
      id: 9,
      name: "Delivery Charges",
      icon: <GroupWorkOutlinedIcon className="sideIcon" />,
      href: "/delivery/charges",
      text: "Manage Delivery Charges.",
      show: (isAdmin || isSubAdmin)
    },
    {
      id: 10,
      name: "Booking Status",
      icon: <AccessTimeOutlinedIcon className="sideIcon" />,
      href: "/bookings/status",
      text: "Manage booking status.",
      show: (isAdmin || isSubAdmin)
    },
    {
      id: 11,
      name: "Notifications",
      icon: <CampaignOutlinedIcon className="sideIcon" />,
      href: "/notifications",
      text: "Send broadcast push notifications to apps.",
      show: (isAdmin)
    },
    {
      id: 12,
      name: "Coin Management",
      icon: <TrendingUpIcon className="sideIcon" />,
      href: "/coin-management",
      text: "Manage Gold and Silver coin rates and disparity.",
      show: (isAdmin)
    },
    {
      id: 13,
      name: "WA Connect",
      icon: <WhatsAppIcon className="sideIcon" />,
      href: "/wa/connect",
      text: "Connect your WhatsApp for notifications.",
      show: (isAdmin)
    },
    // {
    //   id: 11,
    //   name: "Chats",
    //   icon: <ChatIcon className="sideIcon" />,
    //   href: "/chats",
    //   text: "Manage Chats.",
    //   show: (isAdmin || isSubAdmin)
    // },
    // {
    //   id: 8,
    //   name: "Pending Orders",
    //   icon: <WatchLaterOutlinedIcon className="sideIcon" />,
    //   href: "/pending-orders",
    //   text: "Track and manage all your pending trading orders.",
    //   show: (!isGuest && (isAdmin || isSubAdmin))
    // },
    // {
    //   id: 9,
    //   name: "Delivery Charges",
    //   icon: <WatchLaterOutlinedIcon className="sideIcon" />,
    //   href: "/delivery/charges",
    //   text: "Track and manage all your delivery dates.",
    //   show: (isAdmin)
    // },
  ];
}
