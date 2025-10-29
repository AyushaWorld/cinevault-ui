import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { MovieShow, MovieShowFormData } from "../types/index";
import { getImageUrl } from "../services/api";

interface MovieShowFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: MovieShow | null;
  mode: "create" | "edit";
}

const MovieShowForm: React.FC<MovieShowFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<MovieShowFormData>({
    title: "",
    type: "Movie",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: new Date().getFullYear(),
    genre: "",
    rating: undefined,
    description: "",
    poster: null,
  });
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        title: initialData.title,
        type: initialData.type,
        director: initialData.director,
        budget: initialData.budget || "",
        location: initialData.location || "",
        duration: initialData.duration,
        year: initialData.year,
        genre: initialData.genre || "",
        rating: initialData.rating || undefined,
        description: initialData.description || "",
        poster: null,
      });
      if (initialData.poster) {
        setPosterPreview(getImageUrl(initialData.poster));
      }
    } else {
      setFormData({
        title: "",
        type: "Movie",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: new Date().getFullYear(),
        genre: "",
        rating: undefined,
        description: "",
        poster: null,
      });
      setPosterPreview(null);
    }
    setError("");
  }, [initialData, mode, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "rating"
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "Movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year: new Date().getFullYear(),
      genre: "",
      rating: undefined,
      description: "",
      poster: null,
    });
    setPosterPreview(null);
    setError("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, poster: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("type", formData.type);
      submitData.append("director", formData.director);
      submitData.append("duration", formData.duration);
      submitData.append("year", formData.year.toString());

      if (formData.budget) submitData.append("budget", formData.budget);
      if (formData.location) submitData.append("location", formData.location);
      if (formData.genre) submitData.append("genre", formData.genre);
      if (formData.rating !== undefined)
        submitData.append("rating", formData.rating.toString());
      if (formData.description)
        submitData.append("description", formData.description);
      if (formData.poster) submitData.append("poster", formData.poster);

      await onSubmit(submitData);
      resetForm(); // Reset form after successful submit
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save movie/show");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (mode === "create") {
      resetForm(); // Reset form when closing in create mode
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: {
            xs: "100%",
            sm: "600px",
            md: "900px",
            lg: "900px",
            xl: "1300px",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: { xs: "1.2rem", lg: "1.2rem", xl: "2rem" },
          padding: { xs: "16px 24px", lg: "10px 32px", xl: "24px 40px" },
        }}
      >
        {mode === "create" ? "Add New Movie/TV Show" : "Edit Movie/TV Show"}
      </DialogTitle>
      <DialogContent
        sx={{
          padding: { xs: "8px 24px", lg: "12px 32px", xl: "16px 40px" },
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={{ xs: 2, lg: 2, xl: 4 }}>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <FormControl fullWidth required>
                <InputLabel
                  sx={{ fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } }}
                >
                  Type
                </InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as "Movie" | "TV Show",
                    }))
                  }
                  sx={{ fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } }}
                >
                  <MenuItem value="Movie">Movie</MenuItem>
                  <MenuItem value="TV Show">TV Show</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                required
                fullWidth
                label="Director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                required
                fullWidth
                label="Duration (e.g., 120 min or 3 seasons)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                required
                fullWidth
                type="number"
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                label="Budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="$100M"
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hollywood, USA"
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Action, Drama, Comedy"
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                type="number"
                label="Rating (0-10)"
                name="rating"
                value={formData.rating || ""}
                onChange={handleChange}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                InputProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: "1rem", lg: "1.05rem", xl: "1.1rem" } },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  fontSize: { xs: "0.875rem", lg: "1rem", xl: "1.1rem" },
                  padding: { xs: "8px 16px", lg: "10px 20px", xl: "12px 24px" },
                }}
              >
                Upload Poster Image
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {posterPreview && (
                <Box sx={{ mt: { xs: 2, lg: 3 }, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{
                      fontSize: { xs: "0.875rem", lg: "1rem", xl: "1.1rem" },
                    }}
                  >
                    Poster Preview:
                  </Typography>
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    style={{
                      maxWidth:
                        window.innerWidth >= 1536
                          ? "280px"
                          : window.innerWidth >= 1200
                          ? "240px"
                          : "200px",
                      maxHeight:
                        window.innerWidth >= 1536
                          ? "420px"
                          : window.innerWidth >= 1200
                          ? "360px"
                          : "300px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: { xs: "16px 24px", lg: "20px 32px", xl: "24px 40px" },
          gap: { xs: 1, lg: 1.5 },
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            fontSize: { xs: "0.875rem", lg: "1rem", xl: "1.1rem" },
            padding: { xs: "6px 16px", lg: "8px 20px", xl: "10px 24px" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            fontSize: { xs: "0.875rem", lg: "1rem", xl: "1.1rem" },
            padding: { xs: "6px 16px", lg: "8px 20px", xl: "10px 24px" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : mode === "create" ? (
            "Add"
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieShowForm;
