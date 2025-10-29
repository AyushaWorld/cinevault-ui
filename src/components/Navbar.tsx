import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { Movie as MovieIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: scrolled
          ? "rgba(20, 20, 20, 0.98)"
          : "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.8)" : "none",
      }}
    >
      <Toolbar
        sx={{
          py: { xs: 1, lg: 1, xl: 2 },
          px: { xs: 2, lg: 4, xl: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          onClick={() => user && navigate("/")}
        >
          <IconButton
            size="large"
            edge="start"
            sx={{
              mr: { xs: 1, lg: 1.5 },
              width: { xs: 48, lg: 46, xl: 64 },
              height: { xs: 48, lg: 46, xl: 64 },
              color: "#E50914",
              background: "rgba(229, 9, 20, 0.1)",
              "&:hover": {
                background: "rgba(229, 9, 20, 0.2)",
              },
            }}
            aria-label="menu"
          >
            <MovieIcon sx={{ fontSize: { xs: 32, lg: 32, xl: 40 } }} />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontFamily: "'Bebas Neue', cursive",
              fontWeight: 700,
              letterSpacing: { xs: "2px", lg: "2.5px", xl: "3px" },
              fontSize: { xs: "1.5rem", lg: "1.35rem", xl: "2rem" },
              background: "linear-gradient(135deg, #FFFFFF 0%, #E50914 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textTransform: "uppercase",
              display: { xs: "none", sm: "block" },
            }}
          >
            CineVault
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2, lg: 2.5, xl: 3 },
            }}
            className="animate-fadeIn"
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: { md: 1.5, lg: 1 },
                px: { md: 2, lg: 2, xl: 3 },
                py: { md: 1, lg: 1, xl: 1.5 },
                borderRadius: { md: "4px", lg: "6px" },
                background: "rgba(47, 47, 47, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Avatar
                sx={{
                  width: { md: 32, lg: 32, xl: 40 },
                  height: { md: 32, lg: 32, xl: 40 },
                  background:
                    "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
                  fontSize: { md: "14px", lg: "14px", xl: "18px" },
                  fontWeight: 700,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 500,
                  fontSize: { md: "0.875rem", lg: ".8rem", xl: "1.1rem" },
                }}
              >
                {user.name}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleLogout}
              startIcon={
                <LogoutIcon sx={{ fontSize: { xs: 18, lg: 20, xl: 22 } }} />
              }
              sx={{
                color: "#FFFFFF",
                borderColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  borderColor: "#E50914",
                  background: "rgba(229, 9, 20, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", lg: "0.75rem", xl: "1.05rem" },
                px: { xs: 1.5, sm: 2.5, lg: 1.5, xl: 3.5 },
                py: { xs: 0.75, lg: 1, xl: 1.25 },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Logout
              </Box>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
