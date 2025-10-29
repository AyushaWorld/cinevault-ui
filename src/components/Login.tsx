import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        pt: { xs: 8, lg: 10 },
        pb: { xs: 4, lg: 6 },
        px: { xs: 2, lg: 3 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 50% 0%, rgba(229,9,20,0.15) 0%, transparent 60%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: {
            xs: "100%",
            sm: "500px",
            md: "600px",
            lg: "700px",
            xl: "800px",
          },
        }}
      >
        <Box className="animate-fadeInUp">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: { xs: 4, lg: 5 },
            }}
          >
            <IconButton
              sx={{
                mb: { xs: 2, lg: 3 },
                width: { xs: 80, lg: 56, xl: 112 },
                height: { xs: 80, lg: 56, xl: 112 },
                background: "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #F40612 0%, #E50914 100%)",
                  transform: "scale(1.1) rotate(5deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <MovieIcon
                sx={{ fontSize: { xs: 48, lg: 32, xl: 64 }, color: "#FFFFFF" }}
              />
            </IconButton>
            <Typography
              variant="h2"
              className="hero-title"
              sx={{
                letterSpacing: { xs: "0.1em", lg: "0.1em" },
                fontSize: {
                  xs: "2.5rem",
                  sm: "2.5rem",
                  lg: "2.6rem",
                  xl: "4.5rem",
                },
                mb: { xs: 1, lg: 1 },
                textAlign: "center",
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              className="subtitle"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1rem", lg: "1rem", xl: "1.25rem" },
              }}
            >
              Sign in to continue your cinematic journey
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, sm: 4, lg: 4, xl: 6 },
              background: "rgba(47, 47, 47, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: { xs: "12px", lg: "16px" },
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: { xs: "4px", lg: "5px", xl: "6px" },
                background: "linear-gradient(90deg, #E50914 0%, #F40612 100%)",
              },
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 1,
                  background: "rgba(229, 9, 20, 0.1)",
                  border: "1px solid rgba(229, 9, 20, 0.3)",
                  color: "#FFFFFF",
                  "& .MuiAlert-icon": {
                    color: "#E50914",
                  },
                }}
                className="animate-fadeIn"
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 1 }}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1rem", xl: "1.15rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1rem", xl: "1.15rem" } },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1rem", xl: "1.15rem" } },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          "&:hover": {
                            color: "#E50914",
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1rem", xl: "1.15rem" } },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: { xs: 1.5, lg: 1, xl: 2 },
                  fontSize: { xs: "1rem", lg: ".8rem", xl: "1.2rem" },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                ) : (
                  "Sign In"
                )}
              </Button>
              <Box sx={{ textAlign: "center" }}>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Don't have an account?{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "#E50914",
                        fontWeight: 600,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign Up
                    </Box>
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
