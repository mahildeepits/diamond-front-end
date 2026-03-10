import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/index.js";
import { SocketProvider } from "./contexts/socket-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d1a14a",
    },
    background: {
      default: "#1a1615",
      paper: "rgba(26, 22, 21, 0.85)",
    },
    sidebar: {
      main: "#1a1615",
    },
    text: {
      primary: "#1a1615",
      secondary: "rgba(26, 22, 21, 0.7)",
    }
  },
  typography: {
    fontFamily: ["'Montserrat','Jost', sans-serif"],
    loginText: {
      fontFamily: "'Jost', sans-serif",
      fontWeight: 500,
    },
    pageHeading: {
      fontWeight: 600,
      fontSize: "20px",
      my: 1,
      color: "#d1a14a",
    },
    bold: { fontWeight: 600 },
    bolder: { fontWeight: 800 },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "loginButton" },
          style: {
            textTransform: "inherit",
            height: "44px",
            width: "100%",
            fontSize: "17px",
            borderRadius: "100px",
            backgroundColor: "#d1a14a",
            color: "#1a1615",
          },
        },
      ],
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(180deg, #895c00 0%, #f2ddae 100%)",
          color: "#2c1e05",
          fontWeight: 700,
          boxShadow: "0 4px 15px rgba(137, 92, 0, 0.4)",
          "&:hover": {
            background: "linear-gradient(180deg, #9a6800 0%, #fcecba 100%)"
          }
        },
        contained: {
          borderRadius: "12px",
          textTransform: "none",
        },
        outlined: {
          borderRadius: "12px",
          textTransform: "none",
          borderColor: "#d1a14a",
          color: "#d1a14a",
          "&:hover": {
            borderColor: "#eebb2e",
            color: "#eebb2e",
            backgroundColor: "rgba(209, 161, 74, 0.1)"
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#ffffff",
          backdropFilter: "none",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "16px",
          color: "#1a1615",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.MuiInputLabel-shrink": {
            zIndex: 9999,
            background: "#fff",
            padding: "0px 2px",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "rgba(0, 0, 0, 0.6)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#d1a14a",
          },
          "& .MuiOutlinedInput-root": {
            background: "#f9f9f9",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            color: "#1a1615",
            transition: "all 0.3s ease",
            "&.Mui-focused": {
              borderColor: "#d1a14a",
              background: "#fff",
              boxShadow: "0 0 0 2px rgba(209, 161, 74, 0.1)"
            },
            "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
              WebkitTextFillColor: "#1a1615",
              WebkitTransition: "color 9999s ease-out, background-color 9999s ease-out",
              WebkitTransitionDelay: "9999s",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: "#f9f9f9",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          color: "#1a1615",
          "&.Mui-focused": {
            borderColor: "#d1a14a",
            background: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiSvgIcon-root": {
            color: "#d1a14a"
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #d1a14a",
          borderRadius: "0px",
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          color: "#fff",
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f6f8",
            borderBottom: "2px solid #d1a14a",
            color: "#d1a14a",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          },
          "& .MuiTablePagination-root": {
            color: "#1a1615",
          },
          "& .MuiDataGrid-iconSeparator": {
            color: "#000000ff",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "#000000ff",
          },
          "& .MuiDataGrid-menuIconButton": {
            color: "#000000ff",
          },
          "& .MuiTableCell-root": {
            color: "#ffffffff",
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "none",
          // color: "#ffffffff!important",
          "& .MuiTableHead-root": {
            background: "black!important",
          },
          "& .MuiTableHead-root .MuiTableCell-head": {
            color: "#ffffffff!important",
          }
        }
      }
    }
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ToastContainer autoClose={2000} />
            <App />
          </PersistGate>
        </Provider>
      </SocketProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
