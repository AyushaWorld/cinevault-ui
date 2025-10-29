import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import MovieShowList from "./components/MovieShowList";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

// Netflix-inspired dark theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#E50914",
      light: "#F40612",
      dark: "#B20710",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFFFFF",
      light: "#F5F5F5",
      dark: "#E0E0E0",
    },
    background: {
      default: "#141414",
      paper: "#2F2F2F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#808080",
    },
    error: {
      main: "#E50914",
    },
    divider: "rgba(255, 255, 255, 0.1)",
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Bebas Neue', cursive",
      fontWeight: 700,
      letterSpacing: "2px",
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: "'Bebas Neue', cursive",
      fontWeight: 700,
      letterSpacing: "1.5px",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "1px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          padding: "10px 24px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(229, 9, 20, 0.4)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #F40612 0%, #E50914 100%)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(47, 47, 47, 0.8)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(47, 47, 47, 1)",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(47, 47, 47, 1)",
              boxShadow: "0 0 15px rgba(229, 9, 20, 0.3)",
            },
            "& fieldset": {
              borderColor: "rgba(128, 128, 128, 0.4)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(128, 128, 128, 0.6)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#E50914",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(47, 47, 47, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(47, 47, 47, 0.8)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(229, 9, 20, 0.3)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(20, 20, 20, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        filled: {
          backgroundColor: "rgba(229, 9, 20, 0.2)",
          color: "#FFFFFF",
          border: "1px solid rgba(229, 9, 20, 0.4)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(47, 47, 47, 0.8)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(47, 47, 47, 1)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(47, 47, 47, 1)",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(229, 9, 20, 0.2)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(229, 9, 20, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(229, 9, 20, 0.4)",
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(47, 47, 47, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MovieShowList />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
