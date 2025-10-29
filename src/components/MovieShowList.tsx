import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  InputAdornment,
  Grid,
  Rating,
  Tooltip,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalMovies as MovieIcon,
  Tv as TvIcon,
  GridView as GridViewIcon,
  TableRows as TableRowsIcon,
} from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import type { MovieShow } from "../types/index";
import { movieShowService } from "../services/movieShowService";
import MovieShowForm from "./MovieShowForm";
import { getImageUrl } from "../services/api";

const MovieShowList: React.FC = () => {
  const [movieShows, setMovieShows] = useState<MovieShow[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [isFetching, setIsFetching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedMovieShow, setSelectedMovieShow] = useState<MovieShow | null>(
    null
  );

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieShowToDelete, setMovieShowToDelete] = useState<MovieShow | null>(
    null
  );

  const fetchMovieShows = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      // Prevent duplicate fetches
      if (isFetching && !reset) return;

      setIsFetching(true);
      setLoading(true);
      setError("");

      try {
        const response = await movieShowService.getMovieShows(
          pageNum,
          10,
          search,
          typeFilter,
          sortBy
        );

        if (reset) {
          setMovieShows(response.movieShows);
          setPage(1); // Reset page to 1
        } else {
          // Check for duplicates before adding
          setMovieShows((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));
            const newItems = response.movieShows.filter(
              (item) => !existingIds.has(item._id)
            );
            return [...prev, ...newItems];
          });
          setPage(pageNum);
        }

        setHasMore(response.hasMore);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch movies/shows";
        setError(errorMessage);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [search, typeFilter, sortBy, isFetching]
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovieShows(1, true);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter, sortBy]);

  const loadMore = () => {
    fetchMovieShows(page + 1, false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddNew = () => {
    setSelectedMovieShow(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (movieShow: MovieShow) => {
    setSelectedMovieShow(movieShow);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDeleteClick = (movieShow: MovieShow) => {
    setMovieShowToDelete(movieShow);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!movieShowToDelete) return;

    try {
      await movieShowService.deleteMovieShow(movieShowToDelete._id);
      setMovieShows((prev) =>
        prev.filter((ms) => ms._id !== movieShowToDelete._id)
      );
      setDeleteDialogOpen(false);
      setMovieShowToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete movie/show");
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (formMode === "create") {
      const newMovieShow = await movieShowService.createMovieShow(formData);
      setMovieShows((prev) => [newMovieShow, ...prev]);
    } else if (selectedMovieShow) {
      const updatedMovieShow = await movieShowService.updateMovieShow(
        selectedMovieShow._id,
        formData
      );
      setMovieShows((prev) =>
        prev.map((ms) =>
          ms._id === updatedMovieShow._id ? updatedMovieShow : ms
        )
      );
    }
    setFormOpen(false);
  };

  return (
    <Box
      sx={{ minHeight: "100vh", pt: { xs: 12, lg: 14 }, pb: { xs: 6, lg: 8 } }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: {
            xs: "100%",
            sm: "720px",
            md: "960px",
            lg: "1280px",
            xl: "1920px",
          },
          px: { xs: 2, sm: 3, lg: 4, xl: 6 },
        }}
      >
        {/* Hero Section */}
        <Box
          className="animate-fadeInUp"
          sx={{
            mb: { xs: 4, md: 6, lg: 8 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h1"
            className="hero-title"
            sx={{
              letterSpacing: { xs: "0.1em", lg: "0.1em" },
              fontSize: {
                xs: "3rem",
                sm: "4rem",
                md: "4rem",
                lg: "4rem",
                xl: "7rem",
              },
              mb: { xs: 2, lg: 2 },
            }}
          >
            Your Collection
          </Typography>
          <Typography
            variant="h6"
            className="subtitle"
            sx={{
              mb: 2,
              maxWidth: { xs: "90%", md: "700px", lg: "900px" },
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.1rem", lg: "1.2rem" },
            }}
          >
            Discover, organize, and manage your favorite movies and TV shows
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              background: "rgba(229, 9, 20, 0.1)",
              border: "1px solid rgba(229, 9, 20, 0.3)",
              color: "#FFFFFF",
              "& .MuiAlert-icon": {
                color: "#E50914",
              },
            }}
            onClose={() => setError("")}
            className="animate-fadeIn"
          >
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Box
          sx={{
            mb: { xs: 4, lg: 6 },
            p: { xs: 2, sm: 3, lg: 4, xl: 5 },
            background: "rgba(47, 47, 47, 0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: { xs: "12px", lg: "16px" },
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          className="animate-fadeIn"
        >
          <Grid container spacing={{ xs: 2, lg: 3, xl: 4 }} alignItems="center">
            <Grid item xs={12} md={5} lg={4} xl={5}>
              <TextField
                fullWidth
                placeholder="Search by title, director, or genre..."
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          ml: 1,
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: { xs: 20, lg: 20 },
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    transition: "all 0.3s ease",
                    fontSize: { xs: "1rem", lg: "1rem" },
                    padding: { lg: "3px 0", xl: "6px 0" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
              <FormControl fullWidth>
                <InputLabel
                  shrink
                  sx={{ fontSize: { xs: "1rem", lg: "1rem" } }}
                >
                  Type
                </InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                  displayEmpty
                  notched
                  sx={{
                    fontSize: { xs: "1rem", lg: "1rem" },
                  }}
                  renderValue={(selected) => {
                    if (selected === "") {
                      return "All";
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Movie">Movie</MenuItem>
                  <MenuItem value="TV Show">TV Show</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2} lg={3} xl={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: { xs: "1rem", lg: "1rem" } }}>
                  Sort By
                </InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    fontSize: { xs: "1rem", lg: "1rem" },
                  }}
                >
                  <MenuItem value="-createdAt">Recently Added</MenuItem>
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                  <MenuItem value="-title">Title (Z-A)</MenuItem>
                  <MenuItem value="-year">Year (Newest)</MenuItem>
                  <MenuItem value="year">Year (Oldest)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, lg: 1.5, xl: 2 },
                  justifyContent: { xs: "center", sm: "flex-end" },
                }}
              >
                <Tooltip title="Grid View">
                  <IconButton
                    onClick={() => setViewMode("grid")}
                    sx={{
                      width: { xs: 40, lg: 40, xl: 56 },
                      height: { xs: 40, lg: 40, xl: 56 },
                      color:
                        viewMode === "grid"
                          ? "#E50914"
                          : "rgba(255, 255, 255, 0.7)",
                      background:
                        viewMode === "grid"
                          ? "rgba(229, 9, 20, 0.2)"
                          : "rgba(255, 255, 255, 0.1)",
                      border:
                        viewMode === "grid"
                          ? "2px solid #E50914"
                          : "2px solid transparent",
                      "&:hover": {
                        background: "rgba(229, 9, 20, 0.3)",
                        color: "#E50914",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <GridViewIcon
                      sx={{ fontSize: { xs: 24, lg: 24, xl: 32 } }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Table View">
                  <IconButton
                    onClick={() => setViewMode("table")}
                    sx={{
                      width: { xs: 40, lg: 40, xl: 56 },
                      height: { xs: 40, lg: 40, xl: 56 },
                      color:
                        viewMode === "table"
                          ? "#E50914"
                          : "rgba(255, 255, 255, 0.7)",
                      background:
                        viewMode === "table"
                          ? "rgba(229, 9, 20, 0.2)"
                          : "rgba(255, 255, 255, 0.1)",
                      border:
                        viewMode === "table"
                          ? "2px solid #E50914"
                          : "2px solid transparent",
                      "&:hover": {
                        background: "rgba(229, 9, 20, 0.3)",
                        color: "#E50914",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <TableRowsIcon
                      sx={{ fontSize: { xs: 24, lg: 24, xl: 32 } }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Content */}
        {loading && movieShows.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#E50914", mb: 2 }} />
            <Typography variant="body1" className="subtitle">
              Loading your collection...
            </Typography>
          </Box>
        ) : movieShows.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 8, lg: 5, xl: 16 },
              px: { xs: 3, lg: 4, xl: 6 },
              background: "rgba(47, 47, 47, 0.6)",
              borderRadius: { xs: "12px", lg: "16px" },
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            className="animate-scaleIn"
          >
            <MovieIcon
              sx={{
                fontSize: { xs: 80, lg: 64, xl: 120 },
                color: "#E50914",
                mb: { xs: 3, lg: 4 },
              }}
            />
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: { xs: "2rem", lg: "2.1rem", xl: "3rem" },
              }}
            >
              No Content Yet
            </Typography>
            <Typography
              variant="body1"
              className="subtitle"
              sx={{
                mb: 4,
                fontSize: { xs: "1rem", lg: "1rem", xl: "1.4rem" },
                maxWidth: { xs: "100%", lg: "600px", xl: "700px" },
                mx: "auto",
              }}
            >
              Start building your collection by adding your first movie or TV
              show
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleAddNew}
              startIcon={
                <AddIcon sx={{ fontSize: { xs: 20, lg: 24, xl: 28 } }} />
              }
              sx={{
                px: { xs: 4, lg: 5, xl: 6 },
                py: { xs: 1.5, lg: 1.5, xl: 2.5 },
                fontSize: { xs: "1rem", lg: "1rem", xl: "1.25rem" },
              }}
            >
              Add Your First Entry
            </Button>
          </Box>
        ) : (
          <InfiniteScroll
            dataLength={movieShows.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 4,
                }}
              >
                <CircularProgress sx={{ color: "#E50914" }} />
              </Box>
            }
            endMessage={
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "rgba(255, 255, 255, 0.5)",
                  fontStyle: "italic",
                }}
              >
                You've reached the end of your collection
              </Typography>
            }
          >
            {viewMode === "grid" ? (
              <Grid container spacing={{ xs: 2, sm: 3, lg: 3.5, xl: 4 }}>
                {movieShows.map((movieShow, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2.4}
                    key={movieShow._id}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(47, 47, 47, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        overflow: "hidden",
                        position: "relative",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-12px) scale(1.03)",
                          boxShadow:
                            "0 25px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(229, 9, 20, 0.4)",
                          border: "1px solid rgba(229, 9, 20, 0.5)",
                          "& .card-overlay": {
                            opacity: 1,
                          },
                          "& .card-image": {
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                      className="animate-fadeIn"
                      style={{
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      {/* Poster Image */}
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "84%",
                          overflow: "hidden",
                          background:
                            "linear-gradient(135deg, #2F2F2F 0%, #1a1a1a 100%)",
                        }}
                      >
                        {movieShow.poster ? (
                          <CardMedia
                            component="img"
                            image={getImageUrl(movieShow.poster)}
                            alt={movieShow.title}
                            className="card-image"
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.4s ease",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                            }}
                          >
                            {movieShow.type === "Movie" ? (
                              <MovieIcon
                                sx={{ fontSize: 80, color: "#E50914", mb: 2 }}
                              />
                            ) : (
                              <TvIcon
                                sx={{ fontSize: 80, color: "#E50914", mb: 2 }}
                              />
                            )}
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                            >
                              No Poster
                            </Typography>
                          </Box>
                        )}

                        {/* Overlay */}
                        <Box
                          className="card-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            pb: 2,
                          }}
                        >
                          <IconButton
                            sx={{
                              background: "rgba(229, 9, 20, 0.9)",
                              color: "#FFFFFF",
                              "&:hover": {
                                background: "#E50914",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <PlayIcon sx={{ fontSize: 32 }} />
                          </IconButton>
                        </Box>

                        {/* Type Badge */}
                        <Chip
                          icon={
                            movieShow.type === "Movie" ? (
                              <MovieIcon />
                            ) : (
                              <TvIcon />
                            )
                          }
                          label={movieShow.type}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            background: "rgba(229, 9, 20, 0.95)",
                            color: "#FFFFFF",
                            fontWeight: 700,
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                          }}
                        />
                      </Box>

                      {/* Content */}
                      <CardContent
                        sx={{ flexGrow: 1, p: { xs: 2.5, lg: 3, xl: 3.5 } }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: {
                              xs: "1.25rem",
                              lg: "1.35rem",
                              xl: "1.5rem",
                            },
                          }}
                        >
                          {movieShow.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CalendarIcon
                              sx={{
                                fontSize: 16,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              {movieShow.year}
                            </Typography>
                          </Box>
                          {movieShow.rating && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Rating
                                value={movieShow.rating / 2}
                                precision={0.5}
                                size="small"
                                readOnly
                                sx={{
                                  "& .MuiRating-iconFilled": {
                                    color: "#E50914",
                                  },
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#E50914",
                                  fontWeight: 600,
                                }}
                              >
                                {movieShow.rating}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mb: 1.5,
                          }}
                        >
                          <PersonIcon
                            sx={{
                              fontSize: 16,
                              color: "rgba(255, 255, 255, 0.6)",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.8)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {movieShow.director}
                          </Typography>
                        </Box>

                        {movieShow.genre && (
                          <Chip
                            label={movieShow.genre}
                            size="small"
                            sx={{
                              background: "rgba(229, 9, 20, 0.2)",
                              color: "#FFFFFF",
                              border: "1px solid rgba(229, 9, 20, 0.4)",
                              fontWeight: 500,
                              mb: 1,
                            }}
                          />
                        )}

                        {movieShow.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              mt: 1.5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              lineHeight: 1.5,
                            }}
                          >
                            {movieShow.description}
                          </Typography>
                        )}
                      </CardContent>

                      {/* Actions */}
                      <CardActions
                        sx={{
                          px: 2.5,
                          pb: 2.5,
                          pt: 0,
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(movieShow)}
                              sx={{
                                color: "#FFFFFF",
                                background: "rgba(255, 255, 255, 0.1)",
                                "&:hover": {
                                  background: "rgba(229, 9, 20, 0.8)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                                mr: 1,
                              }}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(movieShow)}
                              sx={{
                                color: "#FFFFFF",
                                background: "rgba(255, 255, 255, 0.1)",
                                "&:hover": {
                                  background: "rgba(229, 9, 20, 0.8)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255, 255, 255, 0.5)",
                            fontWeight: 500,
                          }}
                        >
                          {movieShow.duration}
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  background: "rgba(47, 47, 47, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: { xs: "8px", lg: "12px" },
                  overflowX: "auto",
                }}
              >
                <Table sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background:
                          "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Poster
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Title
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Director
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Year
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Genre
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Rating
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          textAlign: "center",
                          fontSize: {
                            xs: "0.875rem",
                            lg: "1rem",
                            xl: "1.1rem",
                          },
                          padding: {
                            xs: "12px 16px",
                            lg: "16px 20px",
                            xl: "18px 24px",
                          },
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movieShows.map((movieShow) => (
                      <TableRow
                        key={movieShow._id}
                        sx={{
                          "&:hover": {
                            background: "rgba(229, 9, 20, 0.1)",
                          },
                          transition: "background 0.3s ease",
                        }}
                      >
                        <TableCell
                          sx={{
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          {movieShow.poster ? (
                            <img
                              src={getImageUrl(movieShow.poster)}
                              alt={movieShow.title}
                              style={{
                                width:
                                  window.innerWidth >= 1536
                                    ? "70px"
                                    : window.innerWidth >= 1200
                                    ? "60px"
                                    : "50px",
                                height:
                                  window.innerWidth >= 1536
                                    ? "105px"
                                    : window.innerWidth >= 1200
                                    ? "90px"
                                    : "75px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: { xs: "50px", lg: "60px", xl: "70px" },
                                height: { xs: "75px", lg: "90px", xl: "105px" },
                                background: "rgba(229, 9, 20, 0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px",
                              }}
                            >
                              {movieShow.type === "Movie" ? (
                                <MovieIcon
                                  sx={{
                                    color: "#E50914",
                                    fontSize: { xs: 24, lg: 24, xl: 32 },
                                  }}
                                />
                              ) : (
                                <TvIcon
                                  sx={{
                                    color: "#E50914",
                                    fontSize: { xs: 24, lg: 24, xl: 32 },
                                  }}
                                />
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#FFFFFF",
                              fontSize: {
                                xs: "0.875rem",
                                lg: "1rem",
                                xl: "1.1rem",
                              },
                            }}
                          >
                            {movieShow.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              fontSize: {
                                xs: "0.75rem",
                                lg: "0.85rem",
                                xl: "0.95rem",
                              },
                            }}
                          >
                            {movieShow.duration}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          <Chip
                            icon={
                              movieShow.type === "Movie" ? (
                                <MovieIcon
                                  sx={{
                                    fontSize: {
                                      xs: "1rem",
                                      lg: "1.1rem",
                                      xl: "1.25rem",
                                    },
                                  }}
                                />
                              ) : (
                                <TvIcon
                                  sx={{
                                    fontSize: {
                                      xs: "1rem",
                                      lg: "1.1rem",
                                      xl: "1.25rem",
                                    },
                                  }}
                                />
                              )
                            }
                            label={movieShow.type}
                            size="small"
                            sx={{
                              background: "rgba(229, 9, 20, 0.2)",
                              color: "#FFFFFF",
                              border: "1px solid rgba(229, 9, 20, 0.4)",
                              fontSize: {
                                xs: "0.75rem",
                                lg: "0.85rem",
                                xl: "0.95rem",
                              },
                              height: { xs: "24px", lg: "28px", xl: "32px" },
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.9)",
                            fontSize: {
                              xs: "0.875rem",
                              lg: "1rem",
                              xl: "1.1rem",
                            },
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          {movieShow.director}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.9)",
                            fontSize: {
                              xs: "0.875rem",
                              lg: "1rem",
                              xl: "1.1rem",
                            },
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          {movieShow.year}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.9)",
                            fontSize: {
                              xs: "0.875rem",
                              lg: "1rem",
                              xl: "1.1rem",
                            },
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          {movieShow.genre || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          {movieShow.rating ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 1, lg: 1.5 },
                              }}
                            >
                              <Rating
                                value={movieShow.rating / 2}
                                precision={0.5}
                                size="small"
                                readOnly
                                sx={{
                                  "& .MuiRating-iconFilled": {
                                    color: "#E50914",
                                  },
                                  "& .MuiRating-icon": {
                                    fontSize: {
                                      xs: "1.25rem",
                                      lg: "1.5rem",
                                      xl: "1.75rem",
                                    },
                                  },
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#E50914",
                                  fontWeight: 600,
                                  fontSize: {
                                    xs: "0.875rem",
                                    lg: "1rem",
                                    xl: "1.1rem",
                                  },
                                }}
                              >
                                {movieShow.rating}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              sx={{
                                color: "rgba(255, 255, 255, 0.5)",
                                fontSize: {
                                  xs: "0.875rem",
                                  lg: "1rem",
                                  xl: "1.1rem",
                                },
                              }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            padding: {
                              xs: "12px 16px",
                              lg: "16px 20px",
                              xl: "18px 24px",
                            },
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(movieShow)}
                              sx={{
                                width: { xs: 32, lg: 40, xl: 44 },
                                height: { xs: 32, lg: 40, xl: 44 },
                                color: "#FFFFFF",
                                background: "rgba(255, 255, 255, 0.1)",
                                "&:hover": {
                                  background: "rgba(229, 9, 20, 0.8)",
                                },
                                mr: { xs: 1, lg: 1.5 },
                              }}
                            >
                              <EditIcon
                                sx={{ fontSize: { xs: 18, lg: 20, xl: 22 } }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(movieShow)}
                              sx={{
                                width: { xs: 32, lg: 40, xl: 44 },
                                height: { xs: 32, lg: 40, xl: 44 },
                                color: "#FFFFFF",
                                background: "rgba(255, 255, 255, 0.1)",
                                "&:hover": {
                                  background: "rgba(229, 9, 20, 0.8)",
                                },
                              }}
                            >
                              <DeleteIcon
                                sx={{ fontSize: { xs: 18, lg: 20, xl: 22 } }}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </InfiniteScroll>
        )}

        {/* Floating Add Button */}
        <Tooltip title="Add New Movie/TV Show" placement="left">
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddNew}
            sx={{
              position: "fixed",
              bottom: { xs: 32, lg: 40, xl: 48 },
              right: { xs: 32, lg: 40, xl: 48 },
              width: { xs: 64, lg: 64, xl: 80 },
              height: { xs: 64, lg: 64, xl: 80 },
              background: "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #F40612 0%, #E50914 100%)",
                transform: "scale(1.1) rotate(90deg)",
              },
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(229, 9, 20, 0.5)",
            }}
          >
            <AddIcon sx={{ fontSize: { xs: 32, lg: 32, xl: 40 } }} />
          </Fab>
        </Tooltip>
      </Container>

      {/* Form Dialog */}
      <MovieShowForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMovieShow}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(47, 47, 47, 0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#FFFFFF",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "1rem",
            }}
          >
            Are you sure you want to delete{" "}
            <Box
              component="span"
              sx={{
                color: "#E50914",
                fontWeight: 700,
              }}
            >
              "{movieShowToDelete?.title}"
            </Box>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              color: "#FFFFFF",
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #E50914 0%, #B20710 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #F40612 0%, #E50914 100%)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieShowList;
